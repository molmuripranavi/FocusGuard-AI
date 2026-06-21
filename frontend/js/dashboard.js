let timer;
let timeLeft = 1500;

let focusScore = 100;
let distractions = 0;
let sessionsCompleted = 0;

// Elements
const timerDisplay =
document.getElementById("timer");

const scoreDisplay =
document.getElementById("score");

const distractionDisplay =
document.getElementById("distractions");

const startBtn =
document.getElementById("startBtn");

const resetBtn =
document.getElementById("resetBtn");

const modeSelect =
document.getElementById("mode");

// --------------------
// TIMER
// --------------------

function updateTimer(){

    const minutes =
    Math.floor(timeLeft / 60);

    const seconds =
    timeLeft % 60;

    timerDisplay.textContent =
    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

updateTimer();

startBtn.addEventListener("click",()=>{

    clearInterval(timer);

    timer = setInterval(()=>{

        if(timeLeft > 0){

            timeLeft--;
            updateTimer();

        }else{

            clearInterval(timer);

            sessionsCompleted++;
            localStorage.setItem(
                "sessions",
                sessionsCompleted
            );
            localStorage.setItem(
                "focusScore",
                focusScore
            );
        }

    },1000);

});

resetBtn.addEventListener("click",()=>{

    clearInterval(timer);

    timeLeft =
    Number(modeSelect.value);

    updateTimer();

});

modeSelect.addEventListener("change",()=>{

    timeLeft =
    Number(modeSelect.value);

    updateTimer();

});

// --------------------
// SCORE
// --------------------

function updateScore(){

    scoreDisplay.textContent =
    focusScore + "%";

    distractionDisplay.textContent =
    distractions;
}

// --------------------
// NOTIFICATIONS
// --------------------

if("Notification" in window){

    Notification.requestPermission();
}

function notify(message){

    if(Notification.permission === "granted"){

        new Notification(
            "FocusGuard AI",
            {
                body:message
            }
        );
    }
}

// --------------------
// VOICE
// --------------------

function speak(text){

    let speech =
    new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speechSynthesis.speak(speech);
}

// --------------------
// DISTRACTION DETECTION
// --------------------

document.addEventListener(
"visibilitychange",
()=>{

    if(document.hidden){

        distractions++;

        focusScore =
        Math.max(
            0,
            focusScore - 10
        );

        updateScore();

        notify(
        "Distraction detected!"
        );

        speak(
        "Please return to your study session."
        );
    }
});

// --------------------
// INACTIVITY DETECTION
// --------------------

let inactivityTimer;

function resetInactivity(){

    clearTimeout(
    inactivityTimer
    );

    inactivityTimer =
    setTimeout(()=>{

        distractions++;

        focusScore =
        Math.max(
            0,
            focusScore - 5
        );

        updateScore();

        notify(
        "You seem inactive."
        );

        speak(
        "You seem distracted."
        );

    },60000);

}

document.addEventListener(
"mousemove",
resetInactivity
);

document.addEventListener(
"keypress",
resetInactivity
);

resetInactivity();

// --------------------
// TASK MANAGER
// --------------------

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

function renderTasks(){

    taskList.innerHTML = "";

    tasks.forEach(
    (task,index)=>{

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

        taskList.appendChild(li);
    });

    localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
    );
}

function deleteTask(index){

    tasks.splice(index,1);

    renderTasks();
}

addTask.addEventListener(
"click",
()=>{

    const task =
    taskInput.value.trim();

    if(task === "")
    return;

    tasks.push(task);

    taskInput.value = "";

    renderTasks();
});

renderTasks();

// --------------------
// THEME TOGGLE
// --------------------

const themeBtn =
document.getElementById(
"themeBtn"
);

themeBtn.addEventListener(
"click",
()=>{

    document.body.classList.toggle(
    "dark"
    );

});