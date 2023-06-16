const addButton = document.getElementById('addButton');
const formContainer = document.getElementById('formContainer');

addButton.addEventListener('click', () => {
  formContainer.style.display = 'block';
});

document.getElementById("activityForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the form input values
  const time = document.getElementById("timeInput").value;
  const date = document.getElementById("dateInput").value;
  const activity = document.getElementById("activityInput").value;
  const location = document.getElementById("locationInput").value;
  const notes = document.getElementById("notesInput").value;

  // Create an object with the form data
  const formData = { time, date, activity, location, notes };

  // Send an HTTP POST request to your server
  fetch("/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Event created:", data);
      // Reset the form after successful submission
      document.getElementById("activityForm").reset();
    })
    .catch(error => {
      console.error("Error creating event:", error);
    });
});

const refreshButton = document.getElementById('refreshButton');
const contentContainer = document.getElementById('content');

// Function to fetch and display events in the content container
const displayEvents = () => {
  // Send an HTTP GET request to fetch events from the server
  fetch('/events')
    .then(response => response.json())
    .then(data => {
      // Clear the existing content
      contentContainer.innerHTML = '';

      // Display each event in the content container
      data.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.innerHTML = `
          <p>Date: ${event.date}</p>
          <p>Time: ${event.time}</p>
          <p>Activity: ${event.activity}</p>
          <p>Location: ${event.location}</p>
          <p>Notes: ${event.notes}</p>
        `;
        contentContainer.appendChild(eventElement);
      });
    })
    .catch(error => {
      console.error('Error fetching events:', error);
    });
};

// Add event listener to the refresh button
refreshButton.addEventListener('click', displayEvents);

// Call the displayEvents function initially to load the events
displayEvents();

