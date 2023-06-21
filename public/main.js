document.addEventListener('DOMContentLoaded', () => {
  const eventList = document.getElementById('event-list');
  const createForm = document.getElementById('create-form');
  const updateForm = document.getElementById('update-form');

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/events');
      if (response.ok) {
        const events = await response.json();
        events.forEach((event) => displayEvent(event));
      } else {
        console.error('Failed to fetch events:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  // Create Event
  createForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const time = createForm.elements['create-time'].value;
    const activity = createForm.elements['create-activity'].value;
    const location = createForm.elements['create-location'].value;
    const notes = createForm.elements['create-notes'].value;

    try {
      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time,
          activity,
          location,
          notes,
          completed: false,
          completionTime: null,
        }),
      });

      if (response.ok) {
        const event = await response.json();
        displayEvent(event);
        createForm.reset();
      } else {
        console.error('Failed to create event:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  });

  // Delete Event
  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const eventItem = document.querySelector(`li[data-id="${eventId}"]`);
        eventItem.remove();
      } else {
        console.error('Failed to delete event:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  // Populate Update Form
  const populateUpdateForm = async (eventId) => {
    try {
      const response = await fetch(`/events/${eventId}`);
      if (response.ok) {
        const event = await response.json();
        updateForm.elements['update-id'].value = event.id;
        updateForm.elements['update-time'].value = event.time;
        updateForm.elements['update-activity'].value = event.activity;
        updateForm.elements['update-location'].value = event.location;
        updateForm.elements['update-notes'].value = event.notes;
      } else {
        console.error('Failed to fetch event for update:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch event for update:', error);
    }
  };

  // Update Event
  updateForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const eventId = updateForm.elements['update-id'].value;
    const time = updateForm.elements['update-time'].value;
    const activity = updateForm.elements['update-activity'].value;
    const location = updateForm.elements['update-location'].value;
    const notes = updateForm.elements['update-notes'].value;

    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time,
          activity,
          location,
          notes,
        }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        const eventItem = document.querySelector(`li[data-id="${eventId}"]`);
        eventItem.innerHTML = `
          <strong data-type="time">Time:</strong> ${updatedEvent.time}<br>
          <strong>Activity:</strong> ${updatedEvent.activity}<br>
          <strong>Location:</strong> ${updatedEvent.location}<br>
          <strong>Notes:</strong> ${updatedEvent.notes}<br>
          <div>
            <label for="completed-${updatedEvent.id}">Completed:</label>
            <input type="checkbox" id="completed-${updatedEvent.id}" class="completed-checkbox" data-id="${updatedEvent.id}">
          </div>
          <div class="completion-time" data-id="${updatedEvent.id}"></div>
          <button class="delete-button">Delete</button>
          <button class="update-button">Update</button>
        `;
        const deleteButton = eventItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => deleteEvent(updatedEvent.id));
        const updateButton = eventItem.querySelector('.update-button');
        updateButton.addEventListener('click', () => populateUpdateForm(updatedEvent.id));
        const completedCheckbox = eventItem.querySelector(`#completed-${updatedEvent.id}`);
        completedCheckbox.addEventListener('change', () => handleCompletedCheckbox(updatedEvent.id));
        const completionTime = eventItem.querySelector(`.completion-time[data-id="${updatedEvent.id}"]`);
        if (updatedEvent.completed) {
          completedCheckbox.checked = true;
          completionTime.textContent = `Completed at: ${updatedEvent.completionTime}`;
        } else {
          completionTime.textContent = '';
        }
      } else {
        console.error('Failed to update event:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  });

  // Display Event in List
  const displayEvent = (event) => {
    const li = document.createElement('li');
    li.dataset.id = event.id;
    li.innerHTML = `
      <strong data-type="time">Time:</strong> ${event.time}<br>
      <strong>Activity:</strong> ${event.activity}<br>
      <strong>Location:</strong> ${event.location}<br>
      <strong>Notes:</strong> ${event.notes}<br>
      <div>
        <label for="completed-${event.id}">Completed:</label>
        <input type="checkbox" id="completed-${event.id}" class="completed-checkbox" data-id="${event.id}">
      </div>
      <div class="completion-time" data-id="${event.id}"></div>
      <button class="delete-button">Delete</button>
      <button class="update-button">Update</button>
    `;

    const sortedListItems = Array.from(eventList.getElementsByTagName('li')).sort((a, b) => {
      const timeA = a.querySelector('strong[data-type="time"]').textContent;
      const timeB = b.querySelector('strong[data-type="time"]').textContent;
      return timeA.localeCompare(timeB);
    });

    const insertIndex = sortedListItems.findIndex((item) => item.dataset.id > event.id);
    if (insertIndex !== -1) {
      eventList.insertBefore(li, sortedListItems[insertIndex]);
    } else {
      eventList.appendChild(li);
    }

    const deleteButton = li.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => deleteEvent(event.id));

    const updateButton = li.querySelector('.update-button');
    updateButton.addEventListener('click', () => populateUpdateForm(event.id));

    const completedCheckbox = li.querySelector(`#completed-${event.id}`);
    completedCheckbox.addEventListener('change', () => handleCompletedCheckbox(event.id));

    const completionTime = li.querySelector(`.completion-time[data-id="${event.id}"]`);
    if (event.completed) {
      completedCheckbox.checked = true;
      completionTime.textContent = `Completed at: ${event.completionTime}`;
    }
  };

  // Handle Completed Checkbox
  const handleCompletedCheckbox = async (eventId) => {
    const checkbox = document.querySelector(`.completed-checkbox[data-id="${eventId}"]`);
    const completionTime = document.querySelector(`.completion-time[data-id="${eventId}"]`);

    if (checkbox.checked) {
      const currentTime = new Date().toLocaleTimeString();
      completionTime.textContent = `Completed at: ${currentTime}`;

      try {
        const response = await fetch(`/events/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            completed: true,
            completionTime: currentTime,
          }),
        });

        if (response.ok) {
          console.log('Event marked as completed successfully');
        } else {
          console.error('Failed to mark event as completed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to mark event as completed:', error);
      }
    } else {
      completionTime.textContent = '';

      try {
        const response = await fetch(`/events/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            completed: false,
            completionTime: null,
          }),
        });

        if (response.ok) {
          console.log('Event marked as incomplete successfully');
        } else {
          console.error('Failed to mark event as incomplete:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to mark event as incomplete:', error);
      }
    }
  };

  // Initialize
  fetchEvents();
});
