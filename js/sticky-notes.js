function loadStickyNotes() {
  const notesContainer = document.getElementById('stickyNotes');
  notesContainer.innerHTML = '';

  const notes = JSON.parse(localStorage.getItem('stickyNotes')) || []; 
  notes.forEach((note, index) => {
    const noteElement = createStickyNote(note, index);
    notesContainer.appendChild(noteElement);
  });
}

function createStickyNote(content, index) {
  const noteElement = document.createElement('div');
  noteElement.classList.add('sticky-note');
  noteElement.innerHTML = `
    <textarea>${content}</textarea>
    <button onclick="deleteStickyNote(${index})">Excluir</button>
  `;

  const textarea = noteElement.querySelector('textarea');
  textarea.addEventListener('input', () => {
    saveStickyNotes();
  });

  return noteElement;
}

function saveStickyNotes() {
  const notesContainer = document.getElementById('stickyNotes');
  const notes = [];
  
  const stickyNotes = notesContainer.querySelectorAll('.sticky-note textarea');
  stickyNotes.forEach((note) => {
    notes.push(note.value);
  });

  localStorage.setItem('stickyNotes', JSON.stringify(notes));
}

function addStickyNote() {
  const notesContainer = document.getElementById('stickyNotes');
  const newNote = createStickyNote('', 0);
  notesContainer.appendChild(newNote);

  saveStickyNotes();
}

function deleteStickyNote(index) {
  const notesContainer = document.getElementById('stickyNotes');
  const noteElements = notesContainer.querySelectorAll('.sticky-note');
  noteElements[index].remove();

  saveStickyNotes();
}

loadStickyNotes();

const addNoteButton = document.createElement('button');
addNoteButton.textContent = 'Criar Nota';
addNoteButton.onclick = addStickyNote;
document.body.appendChild(addNoteButton);
