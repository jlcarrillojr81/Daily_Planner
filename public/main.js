document.addEventListener('DOMContentLoaded', () => {
  const eventList = document.getElementById('event-list');
  const createForm = document.getElementById('create-event-form');
  const updateForm = document.getElementById('update-event-form');

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
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

  const createEvent = async (eventData) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        displayEvent(newEvent);
        createForm.reset();
      } else {
        console.error('Failed to create event:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
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
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
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
          <strong>Time:</strong> ${updatedEvent.time}<br>
          <strong>ID:</strong> ${updatedEvent.id}<br>
          <strong>Activity:</strong> ${updatedEvent.activity}<br>
          <strong>Location:</strong> ${updatedEvent.location}<br>
          <strong>Notes:</strong> ${updatedEvent.notes}<br>
          <button class="delete-button">Delete</button>
          <button class="update-button">Update</button>
        `;

        const deleteButton = eventItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
          deleteEvent(updatedEvent.id);
        });

        const updateButton = eventItem.querySelector('.update-button');
        updateButton.addEventListener('click', () => {
          populateUpdateForm(updatedEvent.id);
        });

        console.log('Event updated successfully');
      } else {
        console.error('Failed to update event:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const displayEvent = (event) => {
    const li = document.createElement('li');
    li.dataset.id = event.id;
    li.innerHTML = `
      <strong>Time:</strong> ${event.time}<br>
      <strong>ID:</strong> ${event.id}<br>
      <strong>Activity:</strong> ${event.activity}<br>
      <strong>Location:</strong> ${event.location}<br>
      <strong>Notes:</strong> ${event.notes}<br>
      <button class="delete-button">Delete</button>
      <button class="update-button">Update</button>
    `;

    const deleteButton = li.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
      deleteEvent(event.id);
    });

    const updateButton = li.querySelector('.update-button');
    updateButton.addEventListener('click', () => {
      populateUpdateForm(event.id);
    });

    eventList.appendChild(li);
  };

  const populateUpdateForm = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const eventData = await response.json();
        updateForm.eventId.value = eventData.id;
        updateForm.time.value = eventData.time;
        updateForm.activity.value = eventData.activity;
        updateForm.location.value = eventData.location;
        updateForm.notes.value = eventData.notes;
      } else {
        console.error('Failed to fetch event:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    }
  };

  createForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const eventData = {
      time: createForm.time.value,
      activity: createForm.activity.value,
      location: createForm.location.value,
      notes: createForm.notes.value,
    };
    createEvent(eventData);
  });

  updateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const eventId = updateForm.eventId.value;
    const eventData = {
      time: updateForm.time.value,
      activity: updateForm.activity.value,
      location: updateForm.location.value,
      notes: updateForm.notes.value,
    };
    updateEvent(eventId, eventData);
  });

  fetchEvents();
});
