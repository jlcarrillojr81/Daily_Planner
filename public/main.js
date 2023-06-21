document.addEventListener('DOMContentLoaded', () => {
  const createForm = document.getElementById('create-form');
  const updateForm = document.getElementById('update-form');
  const eventList = document.getElementById('event-list');

  // Create Event
  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const timeInput = document.getElementById('time');
    const activityInput = document.getElementById('activity');
    const locationInput = document.getElementById('location');
    const notesInput = document.getElementById('notes');

    const eventData = {
      time: timeInput.value,
      activity: activityInput.value,
      location: locationInput.value,
      notes: notesInput.value,
    };

    try {
      const response = await fetch('/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (response.status === 201) {
        const createdEvent = await response.json();
        displayEvent(createdEvent);
        timeInput.value = '';
        activityInput.value = '';
        locationInput.value = '';
        notesInput.value = '';
      } else {
        console.error('Error creating event:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error creating event:', err);
    }
  });

  // Update Event
  const populateUpdateForm = async (id) => {
    try {
      const response = await fetch(`/events/${id}`);

      if (response.status === 200) {
        const eventToUpdate = await response.json();

        const timeInput = document.getElementById('update-time');
        const activityInput = document.getElementById('update-activity');
        const locationInput = document.getElementById('update-location');
        const notesInput = document.getElementById('update-notes');

        timeInput.value = eventToUpdate.time;
        activityInput.value = eventToUpdate.activity;
        locationInput.value = eventToUpdate.location;
        notesInput.value = eventToUpdate.notes;

        updateForm.addEventListener('submit', async (e) => {
          e.preventDefault();

          const eventData = {
            time: timeInput.value,
            activity: activityInput.value,
            location: locationInput.value,
            notes: notesInput.value,
          };

          try {
            const response = await fetch(`/events/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(eventData),
            });

            if (response.status === 200) {
              const updatedEvent = await response.json();
              updateEventInList(updatedEvent);
              timeInput.value = '';
              activityInput.value = '';
              locationInput.value = '';
              notesInput.value = '';
            } else {
              console.error('Error updating event:', response.status, response.statusText);
            }
          } catch (err) {
            console.error('Error updating event:', err);
          }
        });
      } else {
        console.error('Error retrieving event:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error retrieving event:', err);
    }
  };

  // Delete Event
  const deleteEvent = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/events/${id}`, { method: 'DELETE' });

        if (response.status === 200) {
          const deletedEvent = await response.json();
          removeEventFromList(deletedEvent.id);
        } else {
          console.error('Error deleting event:', response.status, response.statusText);
        }
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  // Display Event in List
  const displayEvent = (event) => {
    const li = document.createElement('li');
    li.dataset.id = event.id;
    li.innerHTML = `
      <strong>ID:</strong> ${event.id}<br>
      <strong>Time:</strong> ${event.time}<br>
      <strong>Activity:</strong> ${event.activity}<br>
      <strong>Location:</strong> ${event.location}<br>
      <strong>Notes:</strong> ${event.notes}<br>
      <button class="delete-button">Delete</button>
      <button class="update-button">Update</button>
    `;

    const sortedListItems = Array.from(eventList.getElementsByTagName('li')).sort((a, b) => {
      return a.dataset.id - b.dataset.id;
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
  };

  // Update Event in List
  const updateEventInList = (event) => {
    const listItem = document.querySelector(`li[data-id="${event.id}"]`);
    listItem.innerHTML = `
      <strong>ID:</strong> ${event.id}<br>
      <strong>Time:</strong> ${event.time}<br>
      <strong>Activity:</strong> ${event.activity}<br>
      <strong>Location:</strong> ${event.location}<br>
      <strong>Notes:</strong> ${event.notes}<br>
      <button class="delete-button">Delete</button>
      <button class="update-button">Update</button>
    `;

    const deleteButton = listItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => deleteEvent(event.id));

    const updateButton = listItem.querySelector('.update-button');
    updateButton.addEventListener('click', () => populateUpdateForm(event.id));
  };

  // Remove Event from List
  const removeEventFromList = (id) => {
    const listItem = document.querySelector(`li[data-id="${id}"]`);
    listItem.remove();
  };

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/events');

      if (response.status === 200) {
        const events = await response.json();
        events.forEach(displayEvent);
      } else {
        console.error('Error fetching events:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  fetchEvents();
});
