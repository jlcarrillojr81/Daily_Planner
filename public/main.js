document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('addButton');
  const editButton = document.getElementById('editButton');
  const deleteButton = document.getElementById('deleteButton');
  const addFormContainer = document.getElementById('addFormContainer');
  const editFormContainer = document.getElementById('editFormContainer');
  const exitButton = document.getElementById('exitButton');
  const editExitButton = document.getElementById('edit-exitButton');
  const addForm = document.getElementById('add-Form');
  const editForm = document.getElementById('edit-Form');
  const contentContainer = document.getElementById('content');

  // Initialize activeForm variable
  let activeForm = '';

  // Event listener for exit button
  exitButton.addEventListener('click', () => {
    addFormContainer.classList.remove('form-displayed');
    editFormContainer.classList.remove('form-displayed');
    activeForm = '';
  });

  // Event listener for add button
  addButton.addEventListener('click', () => {
    if (activeForm === 'add') {
      addFormContainer.classList.remove('form-displayed');
      activeForm = '';
    } else {
      addFormContainer.classList.add('form-displayed');
      editFormContainer.classList.remove('form-displayed');
      activeForm = 'add';
    }
  });

  // Event listener for edit button
  editButton.addEventListener('click', () => {
    if (activeForm === 'edit') {
      editFormContainer.classList.remove('form-displayed');
      activeForm = '';
    } else {
      editFormContainer.classList.add('form-displayed');
      addFormContainer.classList.remove('form-displayed');
      activeForm = 'edit';
    }
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
    const timeInput = editForm.elements['edit-time'];
    const activityInput = editForm.elements['edit-activity'];
    const locationInput = editForm.elements['edit-location'];
    const notesInput = editForm.elements['edit-notes'];

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
    try {
      const response = await fetch('/events');
      if (response.ok) {
        const events = await response.json();
        // Generate HTML for events and append it to the content container
        const eventsHTML = events.map((event) => {
          return `
            <div class="event">
              <input type="checkbox" data-id="${event.id}">
              <p>${event.time} ${event.activity} at ${event.location}: ${event.notes}</p>
            </div>
          `;
        }).join('');

        contentContainer.innerHTML = eventsHTML;
      } else {
        console.error('Failed to fetch events.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  fetchEvents();
});
