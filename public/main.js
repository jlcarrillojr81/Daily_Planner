const addButton = document.getElementById('addButton');
const formContainer = document.getElementById('formContainer');

addButton.addEventListener('click', () => {
  formContainer.style.display = 'block';
});

document.getElementById("events").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the form input values
  const time = document.getElementById("time").value;
  const date = document.getElementById("date").value;
  const activity = document.getElementById("activity").value;
  const location = document.getElementById("location").value;
  const notes = document.getElementById("notes").value;

  // Create an object with the form data
  const formData = { date, time, activity, location, notes };

  console.log("FormData:", formData); // Log the form data

  // Send an HTTP POST request to your server
  fetch("/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData) // Serialize the form data as JSON
  })
    .then(response => response.json())
    .then(data => {
      console.log("Event created:", data);
      // Reset the form after successful submission
      document.getElementById("events").reset();
      // Refresh the displayed events
      displayEvents();
    })
    .catch(error => {
      console.error("Error creating event:", error);
    });
});

const refreshButton = document.getElementById('refreshButton');
const contentContainer = document.getElementById('content');


const displayEvents = () => {

  fetch('/events')
  .then(response => {
    console.log("Response:", response); 
    return response.json();
  })
    .then(data => {
   
      contentContainer.innerHTML = '';

      
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
