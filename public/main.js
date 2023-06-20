let selectedEventsId;

const displayEvents = () => {
  fetch(`${DEPLOY_URL}/events`)
    .then(response => response.json())
    .then(data => {
      eventData = data;

      contentContainer.innerHTML = '';

      eventData.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.eventId = event.id; // Add this line
        eventElement.appendChild(checkbox);

        const eventContent = document.createElement('p');
        eventContent.textContent = `${event.time} ${event.activity} At ${event.location}: ${event.notes}`;
        eventElement.appendChild(eventContent);

        contentContainer.appendChild(eventElement);
      });
    })
    .catch(error => {
      console.error('Error fetching events:', error);
    });
};

const DEPLOY_URL = 'https://daily-planner-4ssy.onrender.com';

const contentContainer = document.getElementById('content');
const formContainer = document.getElementById('formContainer');

const addButton = document.getElementById('addButton');
const editButton = document.getElementById('editButton'); // Add this line
const deleteButton = document.getElementById('deleteButton');
const exitButton = document.getElementById('exitButton');

addButton.addEventListener('click', () => {
  formContainer.style.display = 'block';
  addButton.style.display = 'none';
  deleteButton.style.display = 'none';
});

editButton.addEventListener('click', () => {
  const checkedBoxes = document.querySelectorAll('.event input[type="checkbox"]:checked');

  if (checkedBoxes.length === 0) {
    alert("Please select an event to edit.");
  } else if (checkedBoxes.length > 1) {
    alert("Please only select one event!");
  } else {
    const selectedCheckbox = checkedBoxes[0];
    selectedEventId = selectedCheckbox.dataset.eventId; // Store the selected event ID
    populateEditForm(selectedEventId);
  }
});

exitButton.addEventListener('click', () => {
  document.getElementById("events").reset();

  formContainer.style.display = 'none';
  addButton.style.display = 'inline-block';
  deleteButton.style.display = 'inline-block';
});

document.getElementById("events").addEventListener("submit", function (event) {
  event.preventDefault();

  const time = document.getElementById("time").value;
  const activity = document.getElementById("activity").value;
  const location = document.getElementById("location").value;
  const notes = document.getElementById("notes").value;

  const formData = { time, activity, location, notes };

  fetch(`${DEPLOY_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Event created:", data);

      document.getElementById("events").reset();

      displayEvents();

      formContainer.style.display = 'none';
      addButton.style.display = 'inline-block';
      deleteButton.style.display = 'inline-block';
    })
    .catch(error => {
      console.error("Error creating event:", error);
    });
});

const populateEditForm = (eventId) => {
  fetch(`${DEPLOY_URL}/events/${eventId}`, {
    method: "PUT", // Use PUT method instead of POST
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Event updated:", data);

      document.getElementById("events").reset();

      displayEvents();

      formContainer.style.display = "none";
      addButton.style.display = "inline-block";
      deleteButton.style.display = "inline-block";
    })
    .catch((error) => {
      console.error("Error updating event:", error);
    });
};

// Call the displayEvents function initially to load the events
displayEvents();
