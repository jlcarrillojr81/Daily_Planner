// Display Event in List
const displayEvent = (event) => {
  const li = document.createElement('li');
  li.dataset.id = event.id;
  li.innerHTML = `
    <strong data-type="time">Time:</strong> ${event.time}<br>
    <strong>Activity:</strong> ${event.activity}<br>
    <strong>Location:</strong> ${event.location}<br>
    <strong>Notes:</strong> ${event.notes}<br>
    <div>
      <label for="completed-${event.id}">Completed:</label>
      <input type="checkbox" id="completed-${event.id}" class="completed-checkbox" data-id="${event.id}">
    </div>
    <div class="completion-time" data-id="${event.id}"></div>
    <button class="delete-button">Delete</button>
    <button class="update-button">Update</button>
  `;

  const sortedListItems = Array.from(eventList.getElementsByTagName('li')).sort((a, b) => {
    const timeA = a.querySelector('strong[data-type="time"]').textContent;
    const timeB = b.querySelector('strong[data-type="time"]').textContent;
    return timeA.localeCompare(timeB);
  });

  const insertIndex = sortedListItems.findIndex((item) => item.dataset.id > event.id);
  if (insertIndex !== -1) {
    eventList.insertBefore(li, sortedListItems[insertIndex]);
  } else {
    eventList.appendChild(li);
  }

  const deleteButton = li.querySelector('.delete-button');
  deleteButton.addEventListener('click', () => deleteEvent(event.id));

  const updateButton = li.querySelector('.update-button');
  updateButton.addEventListener('click', () => populateUpdateForm(event.id));

  const completedCheckbox = li.querySelector(`#completed-${event.id}`);
  completedCheckbox.addEventListener('change', () => handleCompletedCheckbox(event.id));

  const completionTime = li.querySelector(`.completion-time[data-id="${event.id}"]`);
  if (event.completed) {
    completedCheckbox.checked = true;
    completionTime.textContent = `Completed at: ${event.completionTime}`;
  }
};

// Handle Completed Checkbox
const handleCompletedCheckbox = async (eventId) => {
  const checkbox = document.querySelector(`.completed-checkbox[data-id="${eventId}"]`);
  const completionTime = document.querySelector(`.completion-time[data-id="${eventId}"]`);

  if (checkbox.checked) {
    const currentTime = new Date().toLocaleTimeString();
    completionTime.textContent = `Completed at: ${currentTime}`;

    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: true,
          completionTime: currentTime,
        }),
      });

      if (response.status === 200) {
        console.log('Event marked as completed successfully');
      } else {
        console.error('Error marking event as completed:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error marking event as completed:', err);
    }
  } else {
    completionTime.textContent = '';

    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: false,
          completionTime: null,
        }),
      });

      if (response.status === 200) {
        console.log('Event marked as incomplete successfully');
      } else {
        console.error('Error marking event as incomplete:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error marking event as incomplete:', err);
    }
  }
};
