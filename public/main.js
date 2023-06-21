document.addEventListener('DOMContentLoaded', () => {
  const contentContainer = document.getElementById('content');

  // Fetch all events from the server
  fetch('/events')
    .then(response => response.json())
    .then(events => {
      // Process the received events data
      events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.textContent = `${event.time} ${event.activity} at ${event.location}: ${event.notes}`;
        contentContainer.appendChild(eventElement);
      });
    })
    .catch(error => console.error('Error fetching events:', error));
});

