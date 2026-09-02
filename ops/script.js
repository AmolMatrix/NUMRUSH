let level = Number(localStorage.getItem("ops_level")) || 1;
let goal = 5 + (level - 1) * 3; 

document.getElementById("level").textContent = level;
document.getElementById("goal").textContent = goal;

const startBtn = document.getElementById("startBtn");
const instructions = document.getElementById("instructions");
const gameScreen = document.getElementById("game");
const equationEl = document.getElementById("equation");
const scoreEl = document.getElementById("score");
const comboEl = document.getElementById("combo");
const timerBar = document.getElementById("timer-bar");
const optionsDiv = document.querySelector(".options");

let score = 0;
let combo = 1;
let timeLeft = 30;
let timerId;
let correctAnswer = 0;

startBtn.onclick = () => {
  instructions.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  startBlitz();
};

function startBlitz() {
  score = 0;
  combo = 1;
  timeLeft = 30;
  scoreEl.textContent = "0";
  comboEl.textContent = "x1";
  timerBar.style.width = "100%";
  nextEquation();
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft -= 0.05;
    const percent = (timeLeft / 30) * 100;
    timerBar.style.width = percent + "%";

    // Color change: Green → Yellow → Red
    if (percent > 60) timerBar.style.background = "#4caf50";
    else if (percent > 30) timerBar.style.background = "#ffeb3b";
    else timerBar.style.background = "#f44336";

    if (timeLeft <= 0) {
      clearInterval(timerId);
      endGame();
    }
  }, 50);
}

function nextEquation() {
  const q = generateEquation();
  correctAnswer = q.answer;
  equationEl.textContent = q.display;

  const shuffled = [...q.options].sort(() => Math.random() - 0.5);
  const buttons = optionsDiv.querySelectorAll(".option");

  buttons.forEach((btn, i) => {
    btn.textContent = shuffled[i];
    btn.dataset.value = shuffled[i];
    btn.classList.remove("correct", "wrong");
    btn.disabled = false;
  });
}

optionsDiv.addEventListener("click", e => {
  const btn = e.target.closest(".option");
  if (!btn || btn.disabled) return;

  const selected = Number(btn.dataset.value);

  optionsDiv.querySelectorAll(".option").forEach(b => b.disabled = true);

  if (selected === correctAnswer) {
    btn.classList.add("correct");
    score += combo;
    combo++;
    scoreEl.textContent = score;
    comboEl.textContent = `x${combo}`;
    setTimeout(nextEquation, 380);
  } else {
    btn.classList.add("wrong");
    combo = 1;
    comboEl.textContent = "x1";
    setTimeout(nextEquation, 600);
  }
});

function generateEquation() {
  const range = 3 + level * 3;
  const ops = ['+', '-', '*', '/'];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a, b, result, display;

  switch(op) {
    case '+':
      a = rand(2, range);
      b = rand(2, range);
      result = a + b;
      display = `${a} + ${b} = ?`;
      break;
    case '-':
      a = rand(5, range + 5);
      b = rand(2, a - 2);
      result = a - b;
      display = `${a} - ${b} = ?`;
      break;
    case '*':
      a = rand(2, 9 + level);
      b = rand(2, 6 + Math.floor(level/2));
      result = a * b;
      display = `${a} × ${b} = ?`;
      break;
    case '/':
      b = rand(2, 8 + level);
      a = b * rand(2, 6 + Math.floor(level/2));
      result = a / b;
      display = `${a} ÷ ${b} = ?`;
      break;
  }

  let options = [result];
  while (options.length < 4) {
    let wrong = result + rand(-6, 6);
    if (wrong > 0 && !options.includes(wrong)) options.push(wrong);
  }

  return { display, answer: result, options };
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function endGame() {
  clearInterval(timerId);
  const won = score >= goal;

  if (won) {
    document.getElementById("level-complete").classList.remove("hidden");
    document.getElementById("complete-score").textContent = score;
  } else {
    document.getElementById("gameover").classList.remove("hidden");
    document.getElementById("final-score").textContent = score;
    document.getElementById("result-text").textContent = `You needed ${goal} correct`;
  }

  localStorage.setItem("ops_level", level);
}

document.getElementById("retry-btn").onclick = () => {
  document.getElementById("gameover").classList.add("hidden");
  startBlitz();
};

document.getElementById("menu-btn").onclick = () => {
  window.location.href = "../index.html";
};

function nextLevel() {
  level++;
  localStorage.setItem("ops_level", level);
  location.reload();
}