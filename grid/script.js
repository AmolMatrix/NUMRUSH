const levelText =
  document.getElementById("level");

const startBtn =
  document.getElementById("startBtn");

const instructions =
  document.getElementById("instructions");

const game =
  document.getElementById("game");

const grid =
  document.getElementById("grid");

const livesText =
  document.getElementById("lives");

const timerBar =
  document.getElementById("timer-bar");

const levelCompletePopup =
  document.getElementById("level-complete");

const gameOverPopup =
  document.getElementById("game-over");

const gameOverMessage =
  document.getElementById("gameover-msg");

const retryBtn =
  document.getElementById("retry-btn");

const menuBtn =
  document.getElementById("menu-btn");

const nextBtn =
  document.getElementById("next-btn");

const particlesContainer =
  document.getElementById("particles");

let level =
  Number(
    localStorage.getItem(
      "grid_level"
    )
  ) || 1;

let expectedIndex = 0;

let livesLeft = 3;

let levelTimer;

let totalTime = 20 + level * 3;

let sortedNumbers = [];

let gameRunning = false;

levelText.textContent = level;

startBtn.addEventListener(
  "click",
  startGame
);

function startGame() {

  instructions.classList.add(
    "hidden"
  );

  game.classList.remove(
    "hidden"
  );

  initializeLevel();
}

function initializeLevel() {

  clearInterval(levelTimer);

  expectedIndex = 0;

  livesLeft = 3;

  totalTime =
    20 + level * 3;

  gameRunning = true;

  updateLives();

  generateGrid();

  startLevelTimer();
}

function generateGrid() {

  grid.innerHTML = "";

  const min = 1;

  const max =
    9 + (level - 1) * 20;

  const numberSet =
    new Set();

  while (
    numberSet.size < 9
  ) {

    numberSet.add(

      randomNumber(
        min,
        max
      )

    );
  }

  sortedNumbers =
    Array.from(numberSet)
      .sort((a, b) => a - b);

  const shuffled =
    [...sortedNumbers]
      .sort(() => Math.random() - 0.5);

  shuffled.forEach((num) => {

    const cell =
      document.createElement(
        "div"
      );

    cell.className = "cell";

    cell.textContent = num;

    cell.dataset.value = num;

    cell.addEventListener(
      "click",
      () => handleCellClick(
        cell,
        num
      )
    );

    grid.appendChild(cell);
  });
}

function handleCellClick(
  cell,
  num
) {

  if (
    !gameRunning ||
    cell.classList.contains(
      "clicked"
    )
  ) return;

  if (
    num ===
    sortedNumbers[expectedIndex]
  ) {

    cell.classList.add(
      "clicked"
    );

    expectedIndex++;

    createParticles();

    if (
      expectedIndex >= 9
    ) {

      levelComplete();

    }
  }

  else {

    cell.classList.add(
      "wrong"
    );

    livesLeft--;

    updateLives();

    setTimeout(() => {

      cell.classList.remove(
        "wrong"
      );

    }, 500);

    if (
      livesLeft <= 0
    ) {

      gameOver(
        "❌ No Lives Left!"
      );
    }
  }
}

function updateLives() {

  livesText.textContent =
    "❤️".repeat(livesLeft);
}

function startLevelTimer() {

  let percentage = 100;

  timerBar.style.width =
    "100%";

  updateTimerColor(
    timerBar,
    percentage
  );

  levelTimer = setInterval(() => {

    percentage -=
      100 / (totalTime * 10);

    timerBar.style.width =
      percentage + "%";

    updateTimerColor(
      timerBar,
      percentage
    );

    if (
      percentage <= 0
    ) {

      gameOver(
        "⏰ Level Time Over!"
      );
    }

  }, 100);
}

function updateTimerColor(
  bar,
  percentage
) {

  if (percentage > 60) {

    bar.style.background =
      "linear-gradient(90deg, #00ff99, #00cfff)";
  }

  else if (percentage > 30) {

    bar.style.background =
      "linear-gradient(90deg, #ffe600, #ff9900)";
  }

  else {

    bar.style.background =
      "linear-gradient(90deg, #ff003c, #ff0000)";
  }
}

function levelComplete() {

  gameRunning = false;

  clearInterval(levelTimer);

  createParticles();

  setTimeout(() => {

    levelCompletePopup.classList.remove(
      "hidden"
    );

  }, 400);
}

function gameOver(message) {

  gameRunning = false;

  clearInterval(levelTimer);

  gameOverMessage.textContent =
    message;

  gameOverPopup.classList.remove(
    "hidden"
  );
}

nextBtn.addEventListener(
  "click",
  nextLevel
);

function nextLevel() {

  level++;

  localStorage.setItem(
    "grid_level",
    level
  );

  levelText.textContent =
    level;

  levelCompletePopup.classList.add(
    "hidden"
  );

  initializeLevel();
}

retryBtn.addEventListener(
  "click",
  retryLevel
);

function retryLevel() {

  gameOverPopup.classList.add(
    "hidden"
  );

  initializeLevel();
}

menuBtn.addEventListener(
  "click",
  returnMenu
);

function returnMenu() {

  localStorage.setItem(
    "grid_level",
    level
  );

  window.location.href =
    "../index.html";
}

function randomNumber(
  min,
  max
) {

  return Math.floor(

    Math.random() *
    (max - min + 1)

  ) + min;
}

function createParticles() {

  for (
    let i = 0;
    i < 50;
    i++
  ) {

    const particle =
      document.createElement(
        "div"
      );

    particle.classList.add(
      "particle"
    );

    const angle =
      Math.random() *
      Math.PI * 2;

    const distance =
      70 + Math.random() * 250;

    particle.style.left =
      "50%";

    particle.style.top =
      "50%";

    particle.style.setProperty(
      "--x",
      Math.cos(angle) *
      distance + "px"
    );

    particle.style.setProperty(
      "--y",
      Math.sin(angle) *
      distance + "px"
    );

    particlesContainer.appendChild(
      particle
    );

    setTimeout(() => {

      particle.remove();

    }, 800);
  }
}