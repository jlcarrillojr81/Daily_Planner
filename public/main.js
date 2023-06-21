document.addEventListener('DOMContentLoaded', () => {
  const eventList = document.getElementById('event-list');
  fetchEvents();

  async function fetchEvents() {
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
  }

  async function createEvent(eventData) {
    try {
      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        displayEvent(newEvent);
      } else {
        console.error('Failed to create event:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  }

  async function deleteEvent(eventId) {
    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const eventItem = document.querySelector(`li[data-id="${eventId}"]`);
        eventItem.remove();
        console.log('Event deleted successfully');
      } else {
        console.error('Failed to delete event:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }

  async function updateEvent(eventId, eventData) {
    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        const eventItem = document.querySelector(`li[data-id="${eventId}"]`);
        eventItem.innerHTML = `
          <strong data-type="time">Time:</strong> ${updatedEvent.time}<br>
          <strong>ID:</strong> ${updatedEvent.id}<br>
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
        console.log('Event updated successfully');
      } else {
        console.error('Failed to update event:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  }

  function displayEvent(event) {
    const li = document.createElement('li');
    li.dataset.id = event.id;
    li.innerHTML = `
      <strong data-type="time">Time:</strong> ${event.time}<br>
      <strong>ID:</strong> ${event.id}<br>
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
  }

  function handleCreateFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const time = form.elements['time'].value;
    const activity = form.elements['activity'].value;
    const location = form.elements['location'].value;
    const notes = form.elements['notes'].value;
    const eventData = {
      time: time,
      activity: activity,
      location: location,
      notes: notes,
      completed: false,
      completionTime: null,
    };
    createEvent(eventData);
    form.reset();
  }

  function handleUpdateFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const eventId = form.elements['update-event-id'].value;
    const time = form.elements['update-time'].value;
    const activity = form.elements['update-activity'].value;
    const location = form.elements['update-location'].value;
    const notes = form.elements['update-notes'].value;
    const eventData = {
      time: time,
      activity: activity,
      location: location,
      notes: notes,
    };
    updateEvent(eventId, eventData);
    form.reset();
  }

  function populateUpdateForm(eventId) {
    const form = document.getElementById('update-event-form');
    const eventItem = document.querySelector(`li[data-id="${eventId}"]`);
    const time = eventItem.querySelector('strong[data-type="time"]').nextSibling.textContent.trim();
    const activity = eventItem.querySelector('strong:nth-of-type(2)').nextSibling.textContent.trim();
    const location = eventItem.querySelector('strong:nth-of-type(3)').nextSibling.textContent.trim();
    const notes = eventItem.querySelector('strong:nth-of-type(4)').nextSibling.textContent.trim();
    form.elements['update-event-id'].value = eventId;
    form.elements['update-time'].value = time;
    form.elements['update-activity'].value = activity;
    form.elements['update-location'].value = location;
    form.elements['update-notes'].value = notes;
  }

  async function handleCompletedCheckbox(eventId) {
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
  }

  const createForm = document.getElementById('create-event-form');
  createForm.addEventListener('submit', handleCreateFormSubmit);

  const updateForm = document.getElementById('update-event-form');
  updateForm.addEventListener('submit', handleUpdateFormSubmit);
});
