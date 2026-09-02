const equationElement = document.getElementById("equation");
const levelElement = document.getElementById("level");
const currentQuestionElement = document.getElementById("currentQuestion");
const scoreElement = document.getElementById("score");

const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

const startBtn = document.getElementById("startBtn");

const menuScreen = document.getElementById("menuScreen");
const gameContainer = document.getElementById("gameContainer");

const timerBar = document.getElementById("timerBar");

const gameOverModal = document.getElementById("gameOverModal");
const levelCompleteModal = document.getElementById("levelCompleteModal");

const retryBtn = document.getElementById("retryBtn");
const menuBtn = document.getElementById("menuBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");

const gameOverTitle = document.getElementById("gameOverTitle");
const gameOverText = document.getElementById("gameOverText");

let level = parseInt(localStorage.getItem("mathGameLevel")) || 1;

let score = 0;

let currentQuestion = 1;

let correctAnswer = true;

let timer;
let totalTime;
let timeLeft;

startBtn.addEventListener("click", () => {

    menuScreen.style.display = "none";

    gameContainer.style.display = "block";

    startGame();
});

function startGame() {

    levelElement.innerText = level;

    scoreElement.innerText = score;

    currentQuestion = 1;

    updateQuestionCounter();

    generateEquation();

    startTimer();
}

function getLevelTime(level) {

    if (level <= 3) {
        return 15;
    }

    else if (level <= 6) {
        return 12;
    }

    else if (level <= 10) {
        return 10;
    }

    else {
        return 8;
    }
}

function startTimer() {
    clearInterval(timer);
    totalTime = getLevelTime(level);
    timeLeft = totalTime;
    updateTimerBar();
    timer = setInterval(() => {

        timeLeft -= 0.1;

        updateTimerBar();

        if (timeLeft <= 0) {

            clearInterval(timer);

            showGameOver(
                "⏰ Time Over",
                "You ran out of time."
            );
        }
    }, 100);
}

function updateTimerBar() {

    let percentage =
        (timeLeft / totalTime) * 100;
    timerBar.style.width = percentage + "%";

    if (percentage > 60) {
        timerBar.style.background =
            "linear-gradient(90deg, #00ff99, #00c6ff)";
    }

    else if (percentage > 30) {
        timerBar.style.background =
            "linear-gradient(90deg, #ffe600, #ff9900)";
    }

    else {

        timerBar.style.background =
            "linear-gradient(90deg, #ff003c, #ff0000)";
    }
}

function generateEquation() {

    let num1;
    let num2;
    let operator;

    let realAnswer;
    let shownAnswer;

    if (level <= 3) {
        num1 = randomNumber(1, 10);
        num2 = randomNumber(1, 10);
        operator = randomOperator(["+", "-"]);
    }

    else if (level <= 6) {
        num1 = randomNumber(10, 30);
        num2 = randomNumber(5, 20);
        operator = randomOperator(["+", "-", "*"]);
    }

    else {
        num1 = randomNumber(20, 80);
        num2 = randomNumber(5, 40);
        operator = randomOperator(["+", "-", "*", "/"]);
    }

    if (operator === "/") {
        num2 = randomNumber(1, 10);
        realAnswer =
            Math.floor(num1 / num2);
    }

    else {

        switch (operator) {
            case "+":
                realAnswer = num1 + num2;
                break;
            case "-":
                realAnswer = num1 - num2;
                break;
            case "*":
                realAnswer = num1 * num2;
                break;
        }
    }

    correctAnswer = Math.random() > 0.5;

    if (correctAnswer) {

        shownAnswer = realAnswer;
    }

    else {

        shownAnswer =
            realAnswer + randomNumber(1, 8);

        if (shownAnswer === realAnswer) {

            shownAnswer += 2;
        }
    }

    equationElement.innerText =
        `${num1} ${operator} ${num2} = ${shownAnswer}`;
}

function checkAnswer(userChoice) {

    if (userChoice === correctAnswer) {

        score += 10;

        scoreElement.innerText = score;

        currentQuestion++;

        clearInterval(timer);

        if (currentQuestion > 10) {

            level++;

            localStorage.setItem(
                "mathGameLevel",
                level
            );

            levelCompleteModal.classList.add("active");

            return;
        }
        updateQuestionCounter();
        generateEquation();
        startTimer();
    }

    else {

        clearInterval(timer);

        showGameOver(
            "❌ Wrong Answer",
            "You selected wrong option."
        );
    }
}

function randomNumber(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function randomOperator(array) {

    return array[
        Math.floor(Math.random() * array.length)
    ];
}

function updateQuestionCounter() {

    currentQuestionElement.innerText =
        currentQuestion;
}

function showGameOver(title, message) {
    gameOverTitle.innerText = title;
    gameOverText.innerText = message;
    gameOverModal.classList.add("active");
}

function retryGame() {
    gameOverModal.classList.remove("active");
    score = 0;
    currentQuestion = 1;
    scoreElement.innerText = score;
    updateQuestionCounter();
    generateEquation();
    startTimer();
}

function returnToMenu() {

    window.location.href = "../index.html";
}

function nextLevel() {

    levelCompleteModal.classList.remove("active");
    score = 0;
    currentQuestion = 1;
    levelElement.innerText = level;
    scoreElement.innerText = score;
    updateQuestionCounter();
    generateEquation();
    startTimer();
}

trueBtn.addEventListener("click", () => {
    checkAnswer(true);
});

falseBtn.addEventListener("click", () => {
    checkAnswer(false);
});

retryBtn.addEventListener("click", retryGame);
menuBtn.addEventListener("click", returnToMenu);
nextLevelBtn.addEventListener("click", nextLevel);