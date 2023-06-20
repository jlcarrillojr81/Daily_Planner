let selectedEventId;

const displayEvents = () => {
  fetch(`${DEPLOY_URL}/events`)
    .then(response => response.json())
    .then(data => {
      const eventData = data;

      contentContainer.innerHTML = '';

      eventData.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.eventId = event.id;
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
const addFormContainer = document.getElementById('addFormContainer');
const editFormContainer = document.getElementById('editFormContainer');

const addButton = document.getElementById('addButton');
const editButton = document.getElementById('editButton');
const deleteButton = document.getElementById('deleteButton');
const exitButton = document.getElementById('exitButton');

addButton.addEventListener('click', () => {
  addFormContainer.style.display = 'block';
  editFormContainer.style.display = 'none';
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
    selectedEventId = selectedCheckbox.dataset.eventId;
    populateEditForm(selectedEventId);
  }
});

exitButton.addEventListener('click', () => {
  document.getElementById("addForm").reset();
  document.getElementById("editForm").reset();

  addFormContainer.style.display = 'none';
  editFormContainer.style.display = 'none';
  addButton.style.display = 'inline-block';
  deleteButton.style.display = 'inline-block';
});

document.getElementById("addForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const time = document.getElementById("addTime").value;
  const activity = document.getElementById("addActivity").value;
  const location = document.getElementById("addLocation").value;
  const notes = document.getElementById("addNotes").value;

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

      document.getElementById("addForm").reset();

      displayEvents();

      addFormContainer.style.display = 'none';
      addButton.style.display = 'inline-block';
      deleteButton.style.display = 'inline-block';
    })
    .catch(error => {
      console.error("Error creating event:", error);
    });
});

document.getElementById("editForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const time = document.getElementById("editTime").value;
  const activity = document.getElementById("editActivity").value;
  const location = document.getElementById("editLocation").value;
  const notes = document.getElementById("editNotes").value;

  const updatedData = { time, activity, location, notes };

  fetch(`${DEPLOY_URL}/events/${selectedEventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Event updated:", data);

      document.getElementById("editForm").reset();

      displayEvents();

      editFormContainer.style.display = "none";
      addButton.style.display = "inline-block";
      deleteButton.style.display = "inline-block";
    })
    .catch((error) => {
      console.error("Error updating event:", error);
    });
});

const populateEditForm = (eventId) => {
  fetch(`${DEPLOY_URL}/events/${eventId}`)
    .then((response) => response.json())
    .then((event) => {
      document.getElementById("editTime").value = event.time;
      document.getElementById("editActivity").value = event.activity;
      document.getElementById("editLocation").value = event.location;
      document.getElementById("editNotes").value = event.notes;

      addFormContainer.style.display = "none";
      editFormContainer.style.display = "block";
      addButton.style.display = "none";
      deleteButton.style.display = "none";
    })
    .catch((error) => {
      console.error("Error fetching event:", error);
    });
};

// Call the displayEvents function initially to load the events
displayEvents();
