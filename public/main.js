document.addEventListener('DOMContentLoaded', () => {
  const contentContainer = document.getElementById('content');

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
        eventElement.insertBefore(checkbox, eventElement.firstChild); // Insert checkbox as the first child of eventElement
        contentContainer.appendChild(eventElement);
      });
    })
    .catch(error => console.error('Error fetching events:', error));
});
