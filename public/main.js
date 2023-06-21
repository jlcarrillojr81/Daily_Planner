document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('addButton');
  const addFormContainer = document.getElementById('addFormContainer');
  const exitButton = document.getElementById('exitButton');
  const addForm = document.getElementById('addForm');

  addButton.addEventListener('click', () => {
    addFormContainer.classList.remove('hidden');
  });

  exitButton.addEventListener('click', () => {
    addFormContainer.classList.add('hidden');
  });

  addForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the form input values
    const timeInput = document.getElementById('time');
    const activityInput = document.getElementById('activity');
    const locationInput = document.getElementById('location');
    const notesInput = document.getElementById('notes');

    const time = timeInput.value;
    const activity = activityInput.value;
    const location = locationInput.value;
    const notes = notesInput.value;

    // Send a POST request to the server
    try {
      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ time, activity, location, notes })
      });

      if (response.ok) {
        // Reset the form fields
        addForm.reset();

        // Hide the form
        addFormContainer.classList.add('hidden');

        // Fetch and display the updated events
        // ...
      } else {
        console.error('Failed to add event.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // Fetch and display events
  // ...
});
