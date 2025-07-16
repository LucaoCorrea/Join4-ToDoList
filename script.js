let currentColumn = null;

function openModal(columnId) {
  currentColumn = columnId;
  document.getElementById('taskInput').value = '';
  document.getElementById('taskDate').value = '';
  document.getElementById('taskLabel').value = '';
  document.getElementById('taskTheme').value = 'default';
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('taskInput').focus();
}

function closeModel() {
  document.getElementById('modal').style.display = 'none';
}

function confirmAddTask() {
  const text = document.getElementById('taskInput').value.trim()
  const date = document.getElementById('taskDate').value
  const label = document.getElementById('taskLabel').value.trim()
  const theme = document.getElementById('taskTheme').value

  if (!text || !currentColumn) return
  const cardData = { text, date, label, theme }
  const cards = JSON.parse(localStorage.getItem(currentColumn)) || []
  cards.push(cardData)
  localStorage.setItem(currentColumn, JSON.stringify(cards))
  renderCards()
  closeModal()
}

function createCardElement(cardData) {
  const card = document.createElement("div")
  card.className = `card ${cardData.theme}`
  card.draggable = true
  const content = document.createElement("div")
  content.className = 'card-content'
  content.innerHTML = `<p>${cardData.text}</p>`
  if (cardData.date) content.innerHTML += `<small>📅 ${cardData.date}</small>`
  if (cardData.label) content.innerHTML += `<span class="label">${cardData.label}</span>`
  const delBtn = document.createElement("button")
  delBtn.textContent = "X"
  delBtn.onclick = () => {
    removeCard(cardData)
  }
  card.appendChild(content)
  card.appendChild(delBtn)
  addDragEvents(card)
  return card
}

function renderCards() {
  ['todo', 'doing', 'done'].forEach(columnId => {
    const container = document.getElementById(columnId)
    container.innerHTML = ''
    const cards = JSON.parse(localStorage.getItem(columnId)) || []
    cards.forEach(cardData => {
      const card = createCardElement(cardData)
      container.appendChild(card)
    })
  })
}

function removeCard(cardToRemove) {
  const cards = JSON.parse(localStorage.getItem(currentColumn)) || []
  const updatedCards = cards.filter(card => card.text !== cardToRemove.text)
  localStorage.setItem(currentColumn, JSON.stringify(updatedCards))
  renderCards()
}

function saveAllCards() {
  ['todo', 'doing', 'done'].forEach(columnId => {
    const container = document.getElementById(columnId)
    const cards = Array.from(container.querySelectorAll(".card")).map(card => {
      const text = card.querySelector("p")?.textContent
      const date = card.querySelector("small")?.textContent?.replace('📅 ', '') || ''
      const label = card.querySelector(".label")?.textContent || ''
      const theme = [...card.classList].find(c => c !== 'card') || 'default'
      return { text, date, label, theme }
    })
    localStorage.setItem(columnId, JSON.stringify(cards))
  })
}

function addDragEvents(card) {
  card.addEventListener("dragstart", () => card.classList.add("dragging"))
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging")
    saveAllCards()
  })
}

document.querySelectorAll(".card-container").forEach(container => {
  container.addEventListener("dragover", e => {
    e.preventDefault()
    const dragging = document.querySelector(".dragging")
    if (dragging) container.appendChild(dragging)
  })
})

const themeBtn = document.getElementById('toggleTheme')

themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark')
  themeBtn.textContent = isDark ? '☀️' : '🌙'
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
})

window.addEventListener('load', () => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    document.body.classList.add('dark')
    themeBtn.textContent = '☀️'
  } else {
    themeBtn.textContent = '🌙'
  }
  renderCards()
})


