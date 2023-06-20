const displayEvents = () => {
  fetch(`${DEPLOY_URL}/events`)
    .then(response => {
      console.log("Response:", response);
      return response.json();
    })
    .then(data => {
      contentContainer.innerHTML = '';

      data.forEach(event => {
        const eventElement = document.createElement('span'); 
        eventElement.innerHTML = `
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


const DEPLOY_URL = 'https://daily-planner-4ssy.onrender.com';

const contentContainer = document.getElementById('content');
const formContainer = document.getElementById('formContainer');

const addButton = document.getElementById('addButton');
addButton.addEventListener('click', () => {
  formContainer.style.display = 'block';
});

const refreshButton = document.getElementById('refreshButton');
refreshButton.addEventListener('click', displayEvents);

document.getElementById("events").addEventListener("submit", function(event) {
  event.preventDefault(); 
  
  const time = document.getElementById("time").value;
  const activity = document.getElementById("activity").value;
  const location = document.getElementById("location").value;
  const notes = document.getElementById("notes").value;
  
  
  const formData = { time, activity, location, notes };
  
  console.log("FormData:", formData); 
  
  
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
  })
  .catch(error => {
    console.error("Error creating event:", error);
  });
});

// Call the displayEvents function initially to load the events
displayEvents();