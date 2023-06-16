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

