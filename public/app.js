document.addEventListener('DOMContentLoaded', () => {
  const notesList = document.getElementById('notes-list');
  const addNoteForm = document.getElementById('add-note-form');

  // Function to fetch and display notes from the server
  const fetchAndDisplayNotes = () => {
    fetch('/')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.notes) {
          // Clear the existing notes
          notesList.innerHTML = '';

          // Loop through the retrieved notes and display them
          data.notes.forEach((note) => {
            const li = document.createElement('li');
            li.className = 'note';
            li.dataset.id = note._id;

            li.innerHTML = `
              <h2>${note.title}</h2>
              <p>${note.content}</p>
              <button class="delete">Delete</button>
            `;

            notesList.appendChild(li);
          });
        } else {
          console.error('Error fetching notes:', data.error);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  };

  // Handle form submission to add a new note
  addNoteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = event.target.title.value;
    const content = event.target.content.value;

    fetch('/add-note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Clear the form fields after successful submission
          event.target.title.value = '';
          event.target.content.value = '';

          // Fetch and display the updated notes
          fetchAndDisplayNotes();
        } else {
          console.error('Error adding note:', data.error);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  });

  // Handle note deletion by clicking the "Delete" button
  notesList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete')) {
      const noteId = event.target.parentElement.dataset.id;

      fetch(`/delete-note/${noteId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Fetch and display the updated notes
            fetchAndDisplayNotes();
          } else {
            console.error('Error deleting note:', data.error);
          }
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    }
  });

  // Initial fetch and display of notes
  fetchAndDisplayNotes();
});
