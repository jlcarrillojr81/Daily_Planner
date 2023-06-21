document.addEventListener('DOMContentLoaded', () => {
  const menuContainer = document.getElementById('menu');
  const addButton = document.getElementById('addButton');
  const addFormContainer = document.getElementById('addFormContainer');
  const addForm = document.getElementById('addForm');
  const exitButton = document.getElementById('exitButton');

  addButton.addEventListener('click', () => {
    addFormContainer.classList.remove('hidden'); // Show the form when the Add button is clicked
  });

  exitButton.addEventListener('click', () => {
    addForm.reset(); // Reset the form fields
    addFormContainer.classList.add('hidden'); // Hide the form
  });

  addForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Get the form input values
    const time = document.getElementById('time').value;
    const activity = document.getElementById('activity').value;
    const location = document.getElementById('location').value;
    const notes = document.getElementById('notes').value;

    // Create the event object
    const eventObject = {
      time,
      activity,
      location,
      notes
    };

    // Send a POST request to add the event to the server
    fetch('/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventObject)
    })
      .then(response => response.json())
      .then(newEvent => {
        // Process the newly added event data
        const eventElement = document.createElement('div');
        eventElement.textContent = `${newEvent.time} ${newEvent.activity} at ${newEvent.location}: ${newEvent.notes}`;
        contentContainer.appendChild(eventElement);
      })
      .catch(error => console.error('Error adding event:', error));

    addForm.reset(); // Reset the form fields
    addFormContainer.classList.add('hidden'); // Hide the form after submission
  });

  // Fetch all events from the server
  fetch('/events')
    .then(response => response.json())
    .then(events => {
      // Process the received events data
      events.forEach(event => {
        const eventElement = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        eventElement.textContent = `${event.time} ${event.activity} at ${event.location}: ${event.notes}`;
        eventElement.insertBefore(checkbox, eventElement.firstChild);
        contentContainer.appendChild(eventElement);
      });
    })
    .catch(error => console.error('Error fetching events:', error));
});
