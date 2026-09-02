const levelText =
    document.getElementById("level");

const startBtn =
    document.getElementById("startBtn");

const instructions =
    document.getElementById("instructions");

const game =
    document.getElementById("game");

const equation =
    document.getElementById("equation");

const progress =
    document.getElementById("progress");

const optionsDiv =
    document.querySelector(".options");

const optionButtons =
    document.querySelectorAll(".option");

const timerBar =
    document.getElementById("timer");

const successPopup =
    document.getElementById("success");

const gameOverPopup =
    document.getElementById("gameover");

const gameOverMessage =
    document.getElementById("gameover-msg");

const nextLevelBtn =
    document.getElementById("next-level-btn");

const retryBtn =
    document.getElementById("retry-btn");

const exitBtn =
    document.getElementById("exit-btn");

const successMenuBtn =
    document.getElementById("success-menu-btn");

const particlesContainer =
    document.getElementById("particles");


let level =
    Number(
        localStorage.getItem(
            "question_level"
        )
    ) || 1;

let currentQuestion = 0;

let correctAnswer = 0;

let timerId;

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

    currentQuestion = 0;

    nextQuestion();
}


function nextQuestion() {

    clearInterval(timerId);

    resetButtons();


    if (currentQuestion >= 10) {

        showSuccessPopup();

        return;
    }

    gameRunning = true;

    const question =
        generateQuestion();

    correctAnswer =
        question.answer;

    equation.textContent =
        question.display;

    progress.textContent =
        `${currentQuestion + 1} / 10`;


    const shuffledOptions =
        [...question.options].sort(
            () => Math.random() - 0.5
        );

    optionButtons.forEach(
        (button, index) => {

            button.textContent =
                shuffledOptions[index];

            button.dataset.value =
                shuffledOptions[index];
        }
    );

    startTimer();
}


function startTimer() {

    clearInterval(timerId);


    const maxTime =
        Math.max(4, 9 - level);

    let percentage = 100;

    timerBar.style.width =
        "100%";

    updateTimerColor(
        percentage
    );

    timerId = setInterval(() => {

        percentage -=
            100 / (maxTime * 25);

        timerBar.style.width =
            percentage + "%";

        updateTimerColor(
            percentage
        );

        if (percentage <= 0) {

            clearInterval(timerId);

            showGameOver(
                "⏰ Time Over!"
            );
        }

    }, 40);
}


function updateTimerColor(
    percentage
) {

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


optionsDiv.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".option"
            );

        if (
            !button ||
            !gameRunning
        ) return;

        gameRunning = false;

        clearInterval(timerId);

        disableButtons();

        const selectedAnswer =
            Number(
                button.dataset.value
            );


        if (
            selectedAnswer ===
            correctAnswer
        ) {

            button.classList.add(
                "correct"
            );

            createParticles();

            setTimeout(() => {

                currentQuestion++;

                nextQuestion();

            }, 700);
        }


        else {

            button.classList.add(
                "wrong"
            );

            setTimeout(() => {

                showGameOver(
                    "❌ Wrong Answer!"
                );

            }, 600);
        }
    }
);


function showGameOver(
    message
) {

    gameOverMessage.textContent =
        message;

    game.classList.add(
        "hidden"
    );

    gameOverPopup.classList.remove(
        "hidden"
    );
}


function showSuccessPopup() {

    createParticles();

    setTimeout(() => {

        successPopup.classList.remove(
            "hidden"
        );

    }, 400);
}


retryBtn.addEventListener(
    "click",
    retryLevel
);

function retryLevel() {

    clearInterval(timerId);

    gameOverPopup.classList.add(
        "hidden"
    );

    game.classList.remove(
        "hidden"
    );

    currentQuestion = 0;

    nextQuestion();
}


nextLevelBtn.addEventListener(
    "click",
    nextLevel
);

function nextLevel() {

    level++;

    localStorage.setItem(
        "question_level",
        level
    );

    successPopup.classList.add(
        "hidden"
    );

    levelText.textContent =
        level;

    currentQuestion = 0;

    nextQuestion();
}


exitBtn.addEventListener(
    "click",
    returnMenu
);

successMenuBtn.addEventListener(
    "click",
    returnMenu
);

function returnMenu() {

    localStorage.setItem(
        "question_level",
        level
    );

    window.location.href =
        "../index.html";
}


function generateQuestion() {

    const base =
        3 + level;

    const range =
        5 + level * 2;

    let firstNumber =
        randomNumber(
            base,
            range
        );

    let operator =
        Math.random() < 0.7
            ? "+"
            : "-";

    let secondNumber;

    let result;


    if (operator === "+") {

        secondNumber =
            randomNumber(
                1,
                range + level
            );

        result =
            firstNumber +
            secondNumber;
    }


    else {

        secondNumber =
            randomNumber(
                1,
                firstNumber - 1 || 1
            );

        result =
            firstNumber -
            secondNumber;
    }


    const hiddenPart =
        randomNumber(0, 2);

    let display;

    let answer;

    if (hiddenPart === 0) {

        display =
            `? ${operator} ${secondNumber} = ${result}`;

        answer =
            firstNumber;
    }

    else if (
        hiddenPart === 1
    ) {

        display =
            `${firstNumber} ${operator} ? = ${result}`;

        answer =
            secondNumber;
    }

    else {

        display =
            `${firstNumber} ${operator} ${secondNumber} = ?`;

        answer =
            result;
    }


    const options =
        [answer];

    while (
        options.length < 4
    ) {

        let wrongAnswer =
            answer +
            randomNumber(-5, 5);

        if (
            wrongAnswer >= 0 &&
            !options.includes(
                wrongAnswer
            )
        ) {

            options.push(
                wrongAnswer
            );
        }
    }

    return {
        display,
        answer,
        options
    };
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


function resetButtons() {

    optionButtons.forEach(
        (button) => {

            button.disabled = false;

            button.classList.remove(
                "correct",
                "wrong"
            );
        }
    );
}


function disableButtons() {

    optionButtons.forEach(
        (button) => {

            button.disabled = true;
        }
    );
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
            "--tx",
            Math.cos(angle) *
            distance + "px"
        );

        particle.style.setProperty(
            "--ty",
            Math.sin(angle) *
            distance + "px"
        );

        particlesContainer.appendChild(
            particle
        );

        setTimeout(() => {

            particle.remove();

        }, 1200);
    }
}