const levelText =
    document.getElementById("level");

const startBtn =
    document.getElementById("startBtn");

const instructions =
    document.getElementById("instructions");

const game =
    document.getElementById("game");

const display =
    document.getElementById("number-display");

const answer =
    document.getElementById("answer");

const submit =
    document.getElementById("submit");

const timerBar =
    document.getElementById("timer");

const successPopup =
    document.getElementById("success");

const wrongPopup =
    document.getElementById("wrong");

const nextLevelBtn =
    document.getElementById("next-level-btn");

const retryBtn =
    document.getElementById("retry-btn");

const menuBtn =
    document.getElementById("menu-btn");

const successMenuBtn =
    document.getElementById("success-menu-btn");

const correctTotalText =
    document.getElementById("correct-total");

const particlesContainer =
    document.getElementById("particles");


let level =
    Number(
        localStorage.getItem(
            "addsub_level"
        )
    ) || 1;

let sequence = [];

let index = 0;

let total = 0;

let timer;

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

    resetInput();

    generateSequence();

    showNext();
}


function generateSequence() {

    sequence = [];

    total = 0;

    index = 0;


    const count =
        8 + Math.floor(level / 2);

    const addMin =
        2 + level;

    const addMax =
        8 + level * 2;

    const subMin =
        1 + Math.floor(level / 2);

    const subMax =
        6 + level;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const isAdd =
            i % 2 === 0;

        let value;

        if (isAdd) {

            value =
                randomNumber(
                    addMin,
                    addMax
                );
        }

        else {

            value =
                -randomNumber(
                    subMin,
                    subMax
                );
        }

        sequence.push(value);

        total += value;
    }


    if (total <= 0) {

        sequence[0] +=
            Math.abs(total) +
            randomNumber(5, 12);

        total =
            sequence.reduce(
                (a, b) => a + b,
                0
            );
    }
}


function showNext() {

    gameRunning = true;

    if (index >= sequence.length) {

        askAnswer();

        return;
    }

    const value =
        sequence[index];


    if (index === 0) {

        display.textContent =
            "+" + Math.abs(value);
    }

    else {

        display.textContent =
            Math.abs(value);
    }

    display.style.opacity = "1";


    setTimeout(() => {

        display.style.opacity = "0";

    }, 1500);

    index++;


    const speed =
        Math.max(
            900,
            2300 - level * 70
        );

    setTimeout(
        showNext,
        speed
    );
}


function askAnswer() {

    display.style.opacity = "1";

    display.textContent =
        "TOTAL ?";

    answer.disabled = false;

    submit.disabled = false;

    answer.value = "";

    answer.focus();

    startTimer(
        Math.max(5, 10 - level)
    );
}


function startTimer(seconds) {

    clearInterval(timer);

    let percentage = 100;

    timerBar.style.width = "100%";

    updateTimerColor(percentage);

    timer = setInterval(() => {

        percentage -=
            100 / (seconds * 25);

        timerBar.style.width =
            percentage + "%";

        updateTimerColor(
            percentage
        );

        if (percentage <= 0) {

            clearInterval(timer);

            showWrongPopup();
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


submit.addEventListener(
    "click",
    checkAnswer
);

function checkAnswer() {

    if (!gameRunning) return;

    clearInterval(timer);

    const userAnswer =
        Number(answer.value);

    if (userAnswer === total) {

        showSuccessPopup();
    }

    else {

        showWrongPopup();
    }
}


function showSuccessPopup() {

    gameRunning = false;

    createBlast();

    setTimeout(() => {

        successPopup.classList.remove(
            "hidden"
        );

    }, 500);
}


function showWrongPopup() {

    gameRunning = false;

    correctTotalText.textContent =
        total;

    wrongPopup.classList.remove(
        "hidden"
    );
}


nextLevelBtn.addEventListener(
    "click",
    nextLevel
);

function nextLevel() {

    level++;

    localStorage.setItem(
        "addsub_level",
        level
    );

    successPopup.classList.add(
        "hidden"
    );

    levelText.textContent = level;

    restartLevel();
}


retryBtn.addEventListener(
    "click",
    retryLevel
);

function retryLevel() {

    wrongPopup.classList.add(
        "hidden"
    );

    restartLevel();
}


function restartLevel() {

    clearInterval(timer);

    resetInput();

    generateSequence();

    showNext();
}


function resetInput() {

    answer.value = "";

    answer.disabled = true;

    submit.disabled = true;

    timerBar.style.width = "100%";
}


menuBtn.addEventListener(
    "click",
    returnMenu
);

successMenuBtn.addEventListener(
    "click",
    returnMenu
);

function returnMenu() {

    localStorage.setItem(
        "addsub_level",
        level
    );

    window.location.href =
        "../index.html";
}


function randomNumber(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}


function createBlast() {

    for (
        let i = 0;
        i < 60;
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
            80 + Math.random() * 280;

        particle.style.left = "50%";

        particle.style.top = "50%";

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