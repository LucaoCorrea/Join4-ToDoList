let pomodoroTimer;
let timeRemaining = 25 * 60; // 25 minutes
let isPomodoroActive = false;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function updateTimer() {
  const timerElement = document.getElementById('timer');
  timerElement.textContent = formatTime(timeRemaining);
}

function startPomodoro() {
  if (!isPomodoroActive) {
    isPomodoroActive = true;
    pomodoroTimer = setInterval(() => {
      timeRemaining--;
      updateTimer();
      if (timeRemaining === 0) {
        clearInterval(pomodoroTimer);
        alert('Pomodoro finalizado!');
        isPomodoroActive = false;
      }
    }, 1000);
  }
}

function pausePomodoro() {
  clearInterval(pomodoroTimer);
  isPomodoroActive = false;
}

function resetPomodoro() {
  timeRemaining = 25 * 60;
  updateTimer();
  pausePomodoro();
}
