function openModal(column) {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  modal.dataset.column = column;
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

function confirmAddTask() {
  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');
  const taskLabel = document.getElementById('taskLabel');
  const taskTheme = document.getElementById('taskTheme');
  const column = document.getElementById('modal').dataset.column;

  const task = {
    description: taskInput.value,
    date: taskDate.value,
    label: taskLabel.value,
    theme: taskTheme.value,
  };

  if (task.description) {
    addTaskToColumn(task, column);
  }

  closeModal();
}

function addTaskToColumn(task, column) {
  const columnContainer = document.getElementById(column);
  const taskElement = document.createElement('div');
  taskElement.classList.add('card');
  taskElement.classList.add(task.theme);
  taskElement.innerHTML = `
    <p>${task.description}</p>
    <span>${task.date}</span>
  `;
  columnContainer.appendChild(taskElement);
}
