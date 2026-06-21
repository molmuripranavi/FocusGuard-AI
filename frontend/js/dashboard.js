// ==========================
// FOCUSGUARD AI DASHBOARD
// ==========================

// Timer Variables
let timer;
let timeLeft = 1500;

// Analytics Variables
let focusScore =
Number(localStorage.getItem("focusScore")) || 100;

let distractions = 0;

let sessionsCompleted =
Number(localStorage.getItem("sessions")) || 0;

// ==========================
// ELEMENTS
// ==========================

const timerDisplay =
document.getElementById("timer");

const scoreDisplay =
document.getElementById("score");

const distractionDisplay =
document.getElementById("distractions");

const sessionsDisplay =
document.getElementById("sessions");

const startBtn =
document.getElementById("startBtn");

const resetBtn =
document.getElementById("resetBtn");

const modeSelect =
document.getElementById("mode");

const goalProgress =
document.getElementById("goalProgress");

const goalText =
document.getElementById("goalText");

// ==========================
// TIMER
// ==========================

function updateTimer() {

    const minutes =
    Math.floor(timeLeft / 60);

    const seconds =
    timeLeft % 60;

    timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

updateTimer();

startBtn.addEventListener("click", () => {

    clearInterval(timer);

    timer = setInterval(() => {

        if (timeLeft > 0) {

            timeLeft--;
            updateTimer();

        } else {

            clearInterval(timer);

            sessionsCompleted++;

            focusScore =
            Math.min(
                100,
                focusScore + 5
            );

            localStorage.setItem(
                "sessions",
                sessionsCompleted
            );

            localStorage.setItem(
                "focusScore",
                focusScore
            );

            let streak =
            Number(
                localStorage.getItem(
                    "streak"
                )
            ) || 0;

            streak++;

            localStorage.setItem(
                "streak",
                streak
            );

            updateScore();
            updateGoal();

            notify(
                "Session Completed!"
            );

            speak(
                "Excellent work. Focus session completed."
            );

            alert(
                "🎉 Focus Session Completed!"
            );
        }

    }, 1000);

});

resetBtn.addEventListener("click", () => {

    clearInterval(timer);

    timeLeft =
    Number(modeSelect.value);

    updateTimer();

});

modeSelect.addEventListener("change", () => {

    timeLeft =
    Number(modeSelect.value);

    updateTimer();

});

// ==========================
// SCORE
// ==========================

function updateScore() {

    scoreDisplay.textContent =
    focusScore + "%";

    distractionDisplay.textContent =
    distractions;

    if (sessionsDisplay) {

        sessionsDisplay.textContent =
        sessionsCompleted;
    }

}

// ==========================
// DAILY GOAL
// ==========================

function updateGoal() {

    let minutes =
    sessionsCompleted * 25;

    if (goalProgress) {

        goalProgress.value =
        minutes;

        goalText.textContent =
        `${minutes} / 180 Minutes`;

    }

}

// ==========================
// NOTIFICATIONS
// ==========================

if ("Notification" in window) {

    Notification.requestPermission();
}

function notify(message) {

    if (
        Notification.permission ===
        "granted"
    ) {

        new Notification(
            "FocusGuard AI",
            {
                body: message
            }
        );
    }
}

// ==========================
// VOICE ALERTS
// ==========================

function speak(text) {

    const speech =
    new SpeechSynthesisUtterance(
        text
    );

    speech.lang = "en-US";

    speechSynthesis.speak(
        speech
    );
}

// ==========================
// DISTRACTION DETECTION
// ==========================

function handleDistraction() {

    distractions++;

    focusScore =
    Math.max(
        0,
        focusScore - 10
    );

    localStorage.setItem(
        "focusScore",
        focusScore
    );

    updateScore();

    notify(
        "Distraction detected!"
    );

    speak(
        "Please return to your study session."
    );
}

window.handleDistraction = handleDistraction;

// ==========================
// TAB SWITCH DETECTION
// ==========================

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            handleDistraction();

        }

    }
);

// ==========================
// INACTIVITY DETECTION
// ==========================

let inactivityTimer;

function resetInactivity() {

    clearTimeout(
        inactivityTimer
    );

    inactivityTimer =
    setTimeout(() => {

        distractions++;

        focusScore =
        Math.max(
            0,
            focusScore - 5
        );

        localStorage.setItem(
            "focusScore",
            focusScore
        );

        updateScore();

        notify(
            "You seem inactive."
        );

        speak(
            "You seem distracted."
        );

    }, 60000);

}

document.addEventListener(
    "mousemove",
    resetInactivity
);

document.addEventListener(
    "keypress",
    resetInactivity
);

document.addEventListener(
    "click",
    resetInactivity
);

resetInactivity();

// ==========================
// TASK MANAGER
// ==========================

const taskInput =
document.getElementById(
    "taskInput"
);

const addTask =
document.getElementById(
    "addTask"
);

const taskList =
document.getElementById(
    "taskList"
);

let tasks =
JSON.parse(
    localStorage.getItem(
        "tasks"
    )
) || [];

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(
        (
            task,
            index
        ) => {

            const li =
            document.createElement(
                "li"
            );

            li.innerHTML = `
                ${task}
                <button onclick="deleteTask(${index})">
                    Delete
                </button>
            `;

            taskList.appendChild(
                li
            );

        }
    );

    localStorage.setItem(
        "tasks",
        JSON.stringify(
            tasks
        )
    );

}

function deleteTask(index) {

    tasks.splice(
        index,
        1
    );

    renderTasks();
}

window.deleteTask =
deleteTask;

addTask.addEventListener(
    "click",
    () => {

        const task =
        taskInput.value.trim();

        if (
            task === ""
        ) return;

        tasks.push(
            task
        );

        taskInput.value = "";

        renderTasks();

    }
);

renderTasks();

// ==========================
// DARK MODE
// ==========================

const themeBtn =
document.getElementById(
    "themeBtn"
);

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

    }
);

// ==========================
// INITIALIZE
// ==========================

updateScore();
updateGoal();

console.log(
    "FocusGuard AI Loaded Successfully"
);