let currentColumn = null
let timer
let minutes = 25
let seconds = 0
let running = false

function openModal(columnId) {
  currentColumn = columnId
  document.getElementById('taskInput').value = ''
  document.getElementById('taskDate').value = ''
  document.getElementById('taskLabel').value = ''
  document.getElementById('taskTheme').value = 'default'
  document.getElementById('modal').style.display = 'flex'
  document.getElementById('taskInput').focus()
}

function closeModal() {
  document.getElementById('modal').style.display = 'none'
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
  delBtn.onclick = () => removeCard(cardData)
  card.appendChild(content)
  card.appendChild(delBtn)
  addDragEvents(card)
  return card
}

function renderCards() {
  document.querySelectorAll(".card-container").forEach(container => {
    const columnId = container.id
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
  document.querySelectorAll(".card-container").forEach(container => {
    const columnId = container.id
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

document.getElementById('toggleTheme').addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark')
  document.getElementById('toggleTheme').textContent = isDark ? '☀️' : '🌙'
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
})

window.addEventListener('load', () => {
  document.body.classList.add('dark')
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    document.body.classList.add('dark')
    document.getElementById('toggleTheme').textContent = '☀️'
  } else {
    document.getElementById('toggleTheme').textContent = '🌙'
  }
  renderCards()
  loadStickyNotes()
})

function openColumnModal() {
  document.getElementById('columnModal').style.display = 'flex'
  document.getElementById('columnName').value = ''
  document.getElementById('columnName').focus()
}

function closeColumnModal() {
  document.getElementById('columnModal').style.display = 'none'
}

function addColumn() {
  const name = document.getElementById('columnName').value.trim()
  if (!name) return
  const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
  const board = document.getElementById('board')
  const column = document.createElement('div')
  column.className = 'column'
  column.dataset.status = id
  column.innerHTML = `<h2>${name}</h2><div class="card-container" id="${id}"></div><button onclick="openModal('${id}')">+ Nova Tarefa</button>`
  board.appendChild(column)
  localStorage.setItem(id, JSON.stringify([]))
  closeColumnModal()
}

function loadStickyNotes() {
  const container = document.getElementById('stickyNotes')
  container.innerHTML = ''
  const notes = JSON.parse(localStorage.getItem('stickyNotes')) || []
  notes.forEach((text, i) => {
    const textarea = document.createElement('textarea')
    textarea.className = 'sticky'
    textarea.value = text
    textarea.oninput = () => saveStickyNotes()
    container.appendChild(textarea)
  })
  const addNote = document.createElement('button')
  addNote.textContent = '+'
  addNote.onclick = () => {
    notes.push('')
    localStorage.setItem('stickyNotes', JSON.stringify(notes))
    loadStickyNotes()
  }
  container.appendChild(addNote)
}

function saveStickyNotes() {
  const notes = Array.from(document.querySelectorAll('.sticky')).map(note => note.value)
  localStorage.setItem('stickyNotes', JSON.stringify(notes))
}

function startPomodoro() {
  if (running) return
  running = true
  timer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(timer)
        running = false
        const isBreak = document.getElementById('timer').textContent === '00:00'
        if (isBreak) {
          minutes = 25
        } else {
          minutes = 5
        }
        seconds = 0
        startPomodoro()
      } else {
        minutes--
        seconds = 59
      }
    } else {
      seconds--
    }
    updateTimer()
  }, 1000)
}

function pausePomodoro() {
  clearInterval(timer)
  running = false
}

function resetPomodoro() {
  clearInterval(timer)
  running = false
  minutes = 25
  seconds = 0
  updateTimer()
}

function updateTimer() {
  const m = minutes.toString().padStart(2, '0')
  const s = seconds.toString().padStart(2, '0')
  document.getElementById('timer').textContent = `${m}:${s}`
}
