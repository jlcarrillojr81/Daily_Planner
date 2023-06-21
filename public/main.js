document.addEventListener('DOMContentLoaded', () => {
  const eventList = document.getElementById('event-list');
  
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const events = await response.json();
        events.forEach((event) => displayEvent(event));
        console.log('Events fetched successfully');
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
        const event = await response.json();
        displayEvent(event);
        console.log('Event created successfully');
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
        eventList.removeChild(eventItem);
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
        const eventItem = document.querySelector(`li[data-id="${updatedEvent.id}"]`);
        const time = eventItem.querySelector('strong[data-type="time"]');
        const activity = eventItem.querySelector('strong[data-type="activity"]');
        const location = eventItem.querySelector('strong[data-type="location"]');
        const notes = eventItem.querySelector('strong[data-type="notes"]');
        time.textContent = `Time: ${updatedEvent.time}`;
        activity.textContent = `Activity: ${updatedEvent.activity}`;
        location.textContent = `Location: ${updatedEvent.location}`;
        notes.textContent = `Notes: ${updatedEvent.notes}`;
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
      <strong data-type="time">Time: ${event.time}</strong><br>
      <strong data-type="activity">Activity: ${event.activity}</strong><br>
      <strong data-type="location">Location: ${event.location}</strong><br>
      <strong data-type="notes">Notes: ${event.notes}</strong><br>
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
  
  const handleCreateFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const time = form.elements['create-time'].value;
    const activity = form.elements['create-activity'].value;
    const location = form.elements['create-location'].value;
    const notes = form.elements['create-notes'].value;
    const eventData = {
      time: time,
      activity: activity,
      location: location,
      notes: notes,
    };
    createEvent(eventData);
    form.reset();
  };
  
  const handleUpdateFormSubmit = (event) => {
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
    hideUpdateForm();
  };
  
  const handleCompletedCheckbox = (eventId) => {
    const completedCheckbox = document.querySelector(`#completed-${eventId}`);
    const completionTime = document.querySelector(`.completion-time[data-id="${eventId}"]`);
    const eventData = {
      completed: completedCheckbox.checked,
      completionTime: completedCheckbox.checked ? new Date().toLocaleString() : null,
    };
    updateEvent(eventId, eventData);
    if (completedCheckbox.checked) {
      completionTime.textContent = `Completed at: ${eventData.completionTime}`;
    } else {
      completionTime.textContent = '';
    }
  };
  
  const populateUpdateForm = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const event = await response.json();
        const form = document.getElementById('update-form');
        form.elements['update-event-id'].value = event.id;
        form.elements['update-time'].value = event.time;
        form.elements['update-activity'].value = event.activity;
        form.elements['update-location'].value = event.location;
        form.elements['update-notes'].value = event.notes;
        showUpdateForm();
      } else {
        console.error('Failed to fetch event for update:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch event for update:', error);
    }
  };
  
  const showUpdateForm = () => {
    document.getElementById('update-form-container').style.display = 'block';
  };
  
  const hideUpdateForm = () => {
    document.getElementById('update-form-container').style.display = 'none';
  };
  
  const createButton = document.getElementById('create-button');
  const createForm = document.getElementById('create-form');
  createForm.addEventListener('submit', handleCreateFormSubmit);
  
  const updateForm = document.getElementById('update-form');
  updateForm.addEventListener('submit', handleUpdateFormSubmit);
  
  fetchEvents();
});
