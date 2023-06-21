document.addEventListener('DOMContentLoaded', () => {
  const eventsList = document.getElementById('events-list');
  const addEventForm = document.getElementById('add-event-form');
  const editEventForm = document.getElementById('edit-event-form');
  const cancelEditButton = document.getElementById('cancel-edit');

  let editEventId = null;

  // Helper function to create an event item
  function createEventItem(event) {
    const item = document.createElement('div');
    item.classList.add('event-item');

    const time = document.createElement('p');
    time.textContent = `Time: ${event.time}`;

    const activity = document.createElement('p');
    activity.textContent = `Activity: ${event.activity}`;

    const location = document.createElement('p');
    location.textContent = `Location: ${event.location}`;

    const notes = document.createElement('p');
    notes.textContent = `Notes: ${event.notes}`;

    const completed = document.createElement('input');
    completed.type = 'checkbox';
    completed.checked = event.completed;
    completed.addEventListener('change', () => updateEventCompletion(event.id, completed.checked));

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      editEventId = event.id;
      document.getElementById('edit-time').value = event.time;
      document.getElementById('edit-activity').value = event.activity;
      document.getElementById('edit-location').value = event.location;
      document.getElementById('edit-notes').value = event.notes;
      editEventForm.style.display = 'block';
      addEventForm.style.display = 'none';
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteEvent(event.id));

    item.appendChild(time);
    item.appendChild(activity);
    item.appendChild(location);
    item.appendChild(notes);
    item.appendChild(completed);
    item.appendChild(editButton);
    item.appendChild(deleteButton);

    return item;
  }

  // Helper function to clear the forms
  function clearForms() {
    addEventForm.reset();
    editEventForm.reset();
    editEventForm.style.display = 'none';
    addEventForm.style.display = 'block';
    editEventId = null;
  }

  // Function to fetch and display all events
  async function fetchEvents() {
    try {
      const response = await fetch('/events');
      const events = await response.json();

      eventsList.innerHTML = '';

      if (events.length === 0) {
        const noEventsMsg = document.createElement('p');
        noEventsMsg.textContent = 'No events found.';
        eventsList.appendChild(noEventsMsg);
      } else {
        events.forEach(event => {
          const item = createEventItem(event);
          eventsList.appendChild(item);
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Function to add a new event
  async function addEvent(event) {
    event.preventDefault();

    const formData = new FormData(addEventForm);
    const newEvent = {
      time: formData.get('time'),
      activity: formData.get('activity'),
      location: formData.get('location'),
      notes: formData.get('notes'),
      completed: false,
    };

    try {
      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        clearForms();
        fetchEvents();
      } else {
        console.error('Error adding event');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Function to update an event
  async function updateEvent(event) {
    event.preventDefault();

    const formData = new FormData(editEventForm);
    const updatedEvent = {
      id: editEventId,
      time: formData.get('time'),
      activity: formData.get('activity'),
      location: formData.get('location'),
      notes: formData.get('notes'),
      completed: false,
    };

    try {
      const response = await fetch(`/events/${editEventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        clearForms();
        fetchEvents();
      } else {
        console.error('Error updating event');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Function to update the completion status of an event
  async function updateEventCompletion(eventId, completed) {
    const updatedEvent = { completed };

    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        console.error('Error updating event completion');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Function to delete an event
  async function deleteEvent(eventId) {
    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEvents();
      } else {
        console.error('Error deleting event');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Event listeners
  addEventForm.addEventListener('submit', addEvent);
  editEventForm.addEventListener('submit', updateEvent);
  cancelEditButton.addEventListener('click', clearForms);

  // Initial fetch of events
  fetchEvents();
});
