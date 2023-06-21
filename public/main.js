document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('addButton');
  const editButton = document.getElementById('editButton');
  const deleteButton = document.getElementById('deleteButton');
  const addFormContainer = document.getElementById('addFormContainer');
  const editFormContainer = document.getElementById('editFormContainer');
  const exitButton = document.getElementById('exitButton');
  const addForm = document.getElementById('addForm');
  const editForm = document.getElementById('editForm');
  const contentContainer = document.getElementById('content');

  addButton.addEventListener('click', () => {
    addFormContainer.classList.toggle('form-displayed');
  });

  editButton.addEventListener('click', () => {
    const checkedEvents = document.querySelectorAll('.event input[type="checkbox"]:checked');
    if (checkedEvents.length === 0) {
      alert('Please check an Event');
      return;
    }
    if (checkedEvents.length > 1) {
      alert('Only select one Event');
      return;
    }

    const eventId = checkedEvents[0].dataset.id;
    fetch(`/events/${eventId}`)
      .then(response => response.json())
      .then(eventData => {
        // Populate the edit form with the selected event data
        editForm.elements.time.value = eventData.time;
        editForm.elements.activity.value = eventData.activity;
        editForm.elements.location.value = eventData.location;
        editForm.elements.notes.value = eventData.notes;

        editFormContainer.classList.add('form-displayed');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });

  exitButton.addEventListener('click', () => {
    addFormContainer.classList.remove('form-displayed');
    editFormContainer.classList.remove('form-displayed');
  });

  addForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Rest of the add form submission code...
  });

  editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const checkedEvents = document.querySelectorAll('.event input[type="checkbox"]:checked');
    if (checkedEvents.length === 0) {
      alert('Please check an Event');
      return;
    }
    if (checkedEvents.length > 1) {
      alert('Only select one Event');
      return;
    }

    const eventId = checkedEvents[0].dataset.id;

    // Get the form input values
    const timeInput = editForm.elements.time;
    const activityInput = editForm.elements.activity;
    const locationInput = editForm.elements.location;
    const notesInput = editForm.elements.notes;

    const time = timeInput.value;
    const activity = activityInput.value;
    const location = locationInput.value;
    const notes = notesInput.value;

    // Send a PUT request to update the selected event
    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ time, activity, location, notes })
      });

      if (response.ok) {
        // Reset the form fields
        editForm.reset();

        // Hide the edit form
        editFormContainer.classList.remove('form-displayed');

        // Fetch and display the updated events
        fetchEvents();
      } else {
        console.error('Failed to update event.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  const fetchEvents = async () => {
    // Fetch and display events in the content container
  };

  fetchEvents();
});
