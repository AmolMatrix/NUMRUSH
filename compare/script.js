const playBtn = document.getElementById("playBtn");

const startScreen =
    document.getElementById("startScreen");

const gameArea =
    document.getElementById("gameArea");

const leftSide =
    document.getElementById("leftSide");

const rightSide =
    document.getElementById("rightSide");

const levelText =
    document.getElementById("levelText");

const questionText =
    document.getElementById("questionText");

const scoreText =
    document.getElementById("scoreText");

const buttonsArea =
    document.getElementById("buttonsArea");

const timerBar =
    document.getElementById("timerBar");

const gameOverPopup =
    document.getElementById("gameOverPopup");

const levelPopup =
    document.getElementById("levelPopup");

const retryBtn =
    document.getElementById("retryBtn");

const menuBtn =
    document.getElementById("menuBtn");

const nextBtn =
    document.getElementById("nextBtn");

const popupTitle =
    document.getElementById("popupTitle");

const popupMessage =
    document.getElementById("popupMessage");

let level =
    parseInt(
        localStorage.getItem("compareClashLevel")
    ) || 1;

let score = 0;

let currentQuestion = 1;

let correctAnswer = "";

let timer;

let totalTime;

let timeLeft;

playBtn.addEventListener("click", () => {

    startScreen.style.display = "none";

    gameArea.style.display = "block";

    startGame();
});

function startGame() {

    levelText.innerText = level;

    scoreText.innerText = score;

    currentQuestion = 1;

    updateQuestionText();

    generateQuestion();

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

    timerBar.style.width =
        percentage + "%";

    // Color Change

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

function generateQuestion() {

    let leftExpression;
    let rightExpression;

    let leftValueResult;
    let rightValueResult;

    if (level <= 3) {

        leftValueResult =
            randomNumber(1, 50);

        rightValueResult =
            randomNumber(1, 50);

        leftExpression =
            leftValueResult;

        rightExpression =
            rightValueResult;
    }

    else if (level <= 6) {

        let a =
            randomNumber(5, 30);

        let b =
            randomNumber(1, 20);

        let c =
            randomNumber(5, 30);

        let d =
            randomNumber(1, 20);

        leftExpression =
            `${a} + ${b}`;

        rightExpression =
            `${c} + ${d}`;

        leftValueResult = a + b;

        rightValueResult = c + d;
    }

    else {

        let root1 =
            randomPerfectSquare();

        let root2 =
            randomPerfectSquare();

        let add1 =
            randomNumber(1, 10);

        let add2 =
            randomNumber(1, 10);

        leftExpression =
            `√${root1} + ${add1}`;

        rightExpression =
            `√${root2} + ${add2}`;

        leftValueResult =
            Math.sqrt(root1) + add1;

        rightValueResult =
            Math.sqrt(root2) + add2;
    }

    leftSide.innerText =
        leftExpression;

    rightSide.innerText =
        rightExpression;

    if (leftValueResult >
        rightValueResult) {

        correctAnswer = ">";
    }

    else if (leftValueResult <
        rightValueResult) {

        correctAnswer = "<";
    }

    else {

        correctAnswer = "=";
    }

    createButtons();
}

function createButtons() {

    buttonsArea.innerHTML = "";

    const choices =
        [">", "<", "="];

    choices.sort(() =>
        Math.random() - 0.5
    );

    choices.forEach((symbol, index) => {

        const button =
            document.createElement("button");

        button.innerText =
            symbol;

        button.classList.add(
            "choice-btn"
        );

        if (index === 0) {

            button.classList.add(
                "blue"
            );
        }

        else if (index === 1) {

            button.classList.add(
                "pink"
            );
        }

        else {

            button.classList.add(
                "purple"
            );
        }

        button.addEventListener(
            "click",
            () => {

                checkAnswer(symbol);
            }
        );

        buttonsArea.appendChild(
            button
        );
    });
}

function checkAnswer(userAnswer) {

    if (userAnswer ===
        correctAnswer) {

        score += 10;

        scoreText.innerText =
            score;

        currentQuestion++;

        clearInterval(timer);

        if (currentQuestion > 10) {

            level++;

            localStorage.setItem(
                "compareClashLevel",
                level
            );

            levelPopup.classList.add(
                "active"
            );

            return;
        }

        updateQuestionText();

        generateQuestion();

        startTimer();
    }

    else {

        clearInterval(timer);

        showGameOver(
            "❌ Wrong Answer",
            "You selected wrong symbol."
        );
    }
}

function updateQuestionText() {

    questionText.innerText =
        `${currentQuestion} / 10`;
}

function showGameOver(
    title,
    message
) {

    popupTitle.innerText =
        title;

    popupMessage.innerText =
        message;

    gameOverPopup.classList.add(
        "active"
    );
}

function retryGame() {

    gameOverPopup.classList.remove(
        "active"
    );

    score = 0;
    currentQuestion = 1;
    scoreText.innerText = score;
    updateQuestionText();
    generateQuestion();
    startTimer();
}

function nextLevel() {

    levelPopup.classList.remove(
        "active"
    );

    score = 0;

    currentQuestion = 1;

    levelText.innerText =
        level;

    scoreText.innerText =
        score;

    updateQuestionText();
    generateQuestion();
    startTimer();
}

function returnMenu() {

    window.location.href =
        "../index.html";
}

function randomNumber(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}

function randomPerfectSquare() {

    const numbers =
        [4, 9, 16, 25, 36, 49, 64, 81];

    return numbers[
        Math.floor(
            Math.random() *
            numbers.length
        )
    ];
}

retryBtn.addEventListener(
    "click",
    retryGame
);

nextBtn.addEventListener(
    "click",
    nextLevel
);

menuBtn.addEventListener(
    "click",
    returnMenu
);