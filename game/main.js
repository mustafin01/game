window.addEventListener('DOMContentLoaded', (event) => {
  // Шаг 1: создание HTML-страницы с экраном входа
  const loginScreen = document.getElementById('login-screen');
  const startBtn = document.getElementById('start-btn');
  const usernameInput = document.getElementById('username');

  // Шаг 2: добавление CSS-стилей для оформления экрана входа
  loginScreen.classList.add('login-screen');

  // Шаг 3: обработка события нажатия на кнопку "для начала игры"
  startBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const username = usernameInput.value;
    if (username) {
      startGame(username);
    }
    
  });


  // Шаг 4: создание HTML-страницы для игрового экрана
  const gameScreen = document.getElementById('game-screen');
  const gameMap = document.getElementById('game-map');
  const gameInfo = document.getElementById('game-info');
  const usernameDisplay = document.getElementById('username-display');
  const currentTimeDisplay = document.getElementById('current-time-display');
  const timeSpentDisplay = document.getElementById('time-spent-display');
  const livesCounter = document.getElementById('lives-counter');

  // Функция для форматирования времени
  function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Функция для обновления информации о игре
  function updateGameInfo(username, currentTime, timeSpent, lives) {
    usernameDisplay.textContent = username;
    currentTimeDisplay.textContent = currentTime;
    timeSpentDisplay.textContent = timeSpent;
    livesCounter.textContent = lives;
  }

  // Функция для запуска секундомера
  function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
  }

  // Функция для обновления секундомера
  function updateTimer() {
    seconds++;
    const timeSpent = formatTime(seconds);
    document.getElementById('game-timer').textContent = timeSpent;
    updateGameInfo(usernameDisplay.textContent, currentTimeDisplay.textContent, timeSpent, livesCounter.textContent);
  }

  // Функция для остановки секундомера
  function stopTimer() {
    clearInterval(timerInterval);
  }

  // Функция для сброса секундомера
  function resetTimer() {
    stopTimer();
    seconds = 0;
    document.getElementById('game-timer').textContent = formatTime(seconds);
  }

  function startGame(username) {
    lives = 100; // Инициализация жизней игрока
    loginScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    updateGameInfo(username, new Date().toLocaleTimeString(), '00:00:00', lives);
    drawPlayer(gameMap.offsetWidth / 2, gameMap.offsetHeight / 2);
    drawMonster(Math.random() * gameMap.offsetWidth, Math.random() * gameMap.offsetHeight);
    document.addEventListener('keydown', movePlayer);
    startTimer();
    gameLoop();
  }
  
  // Функция для движения монстра к игроку
  function moveMonster(playerX, playerY) {
    const monster = document.getElementById('monster');
    const player = document.getElementById('player');
    if (!monster || !player) return;
  
    let monsterX = parseInt(monster.style.left, 10) || 0;
    let monsterY = parseInt(monster.style.top, 10) || 0;
    const step = 2;
  
    // Вычисление направления движения монстра
    const dx = playerX - monsterX;
    const dy = playerY - monsterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    // Если монстр не достиг игрока, двигаем его
    if (distance > step) {
      monsterX += dx / distance * step;
      monsterY += dy / distance * step;
    } else {
      // Если монстр достиг игрока, уменьшаем количество жизней игрока
      lives--;
      updateGameInfo(usernameDisplay.textContent, currentTimeDisplay.textContent, timeSpentDisplay.textContent, lives);
      if (lives > 0) {
        // Если игрок еще не проиграл, перемещаем монстра в новую позицию
        monsterX = Math.random() * gameMap.offsetWidth;
        monsterY = Math.random() * gameMap.offsetHeight;
      } else {
        // Если игрок проиграл, завершаем игру
        endGame();
      }
    }
    // Обновление позиции монстра
  monster.style.left = monsterX + 'px';
  monster.style.top = monsterY + 'px';
}
  // Функция для отрисовки игрока на игровом поле
  function drawPlayer(x, y) {
    const player = document.createElement('div');
    player.id = 'player';
    player.style.position = 'absolute';
    player.style.width = '50px';
    player.style.height = '50px';
    player.style.backgroundColor = 'none';
    player.style.left = x + 'px';
    player.style.top = y + 'px';
    gameMap.appendChild(player);
  }

  // Функция для движения игрока
  function movePlayer(event) {
    const player = document.getElementById('player');
    let top = parseInt(player.style.top, 10) || 0;
    let left = parseInt(player.style.left, 10) || 0;
    const step = 10; // Шаг движения игрока
  
    // Вычисление направления движения игрока
    let dx = 0;
    let dy = 0;
    switch (event.key) {
      case 'ArrowUp':
        dy = -step;
        break;
      case 'ArrowDown':
        dy = step;
        break;
      case 'ArrowLeft':
        dx = -step;
        break;
      case 'ArrowRight':
        dx = step;
        break;
      default:
        return;
    }
  
    // Проверка на выход за границы игрового поля
    const mapRect = gameMap.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
  
    // Проверка на выход за границы по вертикали
    if (top + dy < 0) {
      dy = -top;
    } else if (top + dy + playerRect.height > mapRect.height) {
      dy = mapRect.height - top - playerRect.height;
    }
  
    // Проверка на выход за границы по горизонтали
    if (left + dx < 0) {
      dx = -left;
    } else if (left + dx + playerRect.width > mapRect.width) {
      dx = mapRect.width - left - playerRect.width;
    }
  
    // Обновление позиции игрока
    player.style.top = (top + dy) + 'px';
    player.style.left = (left + dx) + 'px';
  }

// Функция для отрисовки монстра на игровом поле
function drawMonster(x, y) {
  const monster = document.createElement('div');
  monster.id = 'monster';
  monster.style.position = 'absolute';
  monster.style.width = '50px';
  monster.style.height = '50px';
  monster.style.backgroundColor = 'red';
  monster.style.left = x + 'px';
  monster.style.top = y + 'px';
  gameMap.appendChild(monster);
}

function moveMonster(playerX, playerY) {
  const monster = document.getElementById('monster');
  const player = document.getElementById('player');
  if (!monster || !player) return;

  let monsterX = parseInt(monster.style.left, 10) || 0;
  let monsterY = parseInt(monster.style.top, 10) || 0;
  const step = 2;

  // Вычисление направления движения монстра
  const dx = playerX - monsterX;
  const dy = playerY - monsterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Если монстр не достиг игрока, двигаем его
  if (distance > step) {
    monsterX += dx / distance * step;
    monsterY += dy / distance * step;
  } else {
    // Если монстр достиг игрока, игра заканчивается
    endGame();
  }

  // Обновление позиции монстра
  monster.style.left = monsterX + 'px';
  monster.style.top = monsterY + 'px';
}

// Функция для завершения игры
function endGame() {
  clearInterval(timerInterval);
  gameScreen.style.display = 'none';
  gameOverScreen.style.display = 'block';
  gameOverMessage.textContent = 'GAME OVER';

  // Добавление обработчика события для кнопки "Играть сначала"
  const playAgainButton = document.getElementById('play-again-btn');
  playAgainButton.addEventListener('click', restartGame);
}
// Функция для перезапуска игры
function restartGame() {
  // Сброс экрана окончания игры
  gameOverScreen.style.display = 'none';
  // Сброс экрана игры
  gameScreen.style.display = 'block';
  // Сброс информации о игре
  updateGameInfo(usernameDisplay.textContent, '00:00:00', '00:00:00', 100);
  // Сброс карты игры
  gameMap.innerHTML = '';
  // Перезапуск игры
  startGame(usernameDisplay.textContent);
}

// Функция для создания экрана окончания игры
function createGameOverScreen() {
  
  const gameOverScreen = document.createElement('div');
  gameOverScreen.id = 'game-over-screen';
  gameOverScreen.style.display = 'none'; // Скрываем экран по умолчанию
  gameOverScreen.style.position = 'absolute';
  gameOverScreen.style.top = '0';
  gameOverScreen.style.left = '0';
  gameOverScreen.style.width = '100%';
  gameOverScreen.style.height = '100%';
  gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  gameOverScreen.style.color = 'white';
  gameOverScreen.style.textAlign = 'center';
  gameOverScreen.style.paddingTop = '20%';
  gameOverScreen.style.fontSize = '3em';
  document.body.appendChild(gameOverScreen);

  const gameOverMessage = document.createElement('p');
  gameOverMessage.id = 'game-over-message';
  gameOverScreen.appendChild(gameOverMessage);

  return gameOverScreen;
}

// Создание экрана окончания игры при загрузке документа
const gameOverScreen = createGameOverScreen();function restartGame() {
  // Сброс игрового экрана
  gameOverScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  // Сброс игрового поля
  gameMap.innerHTML = '';

  // Перезапуск игры
  startGame(usernameDisplay.textContent);
}
const gameOverMessage = document.getElementById('game-over-message');
// Функция для начала игры
function startGame(username) {
  loginScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  updateGameInfo(username, new Date().toLocaleTimeString(), '00:00:00', 3);
  drawPlayer(gameMap.offsetWidth / 2, gameMap.offsetHeight / 2);
  drawMonster(Math.random() * gameMap.offsetWidth, Math.random() * gameMap.offsetHeight);
  document.addEventListener('keydown', movePlayer);
  startTimer();
  gameLoop(); // Запускаем игровой цикл
}



// Функция игрового цикла
function gameLoop() {
  const player = document.getElementById('player');
  if (!player) return;

  const playerX = parseInt(player.style.left, 10) || 0;
  const playerY = parseInt(player.style.top, 10) || 0;

  moveMonster(playerX, playerY); // Двигаем монстра к игроку

  requestAnimationFrame(gameLoop); // Запускаем следующий кадр
}

// Добавление обработчиков событий кнопок
document.getElementById('start-timer').addEventListener('click', startTimer);
document.getElementById('stop-timer').addEventListener('click', stopTimer);
document.getElementById('reset-timer').addEventListener('click', resetTimer);
  document.getElementById('start-timer').addEventListener('click', startTimer);
  document.getElementById('stop-timer').addEventListener('click', stopTimer);
  document.getElementById('reset-timer').addEventListener('click', resetTimer);
});

