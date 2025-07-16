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