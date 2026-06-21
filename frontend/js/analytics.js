// Demo analytics data

const focusData = [92, 88, 95, 85, 98, 90, 96];

const labels = [
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat",
"Sun"
];

// Chart

new Chart(
document.getElementById("focusChart"),
{
type:"line",

data:{
labels:labels,

datasets:[
{
label:"Focus Score",

data:focusData,

borderWidth:3,

fill:false
}
]
},

options:{
responsive:true
}
}
);

// --------------------
// STUDY STREAK
// --------------------

let streak =
localStorage.getItem("streak") || 5;

document.getElementById(
"streak"
).textContent =
"🔥 " + streak + " Days";

// --------------------
// AI INSIGHTS
// --------------------

const insights = [

"Your best focus day was Friday.",

"You are most productive in the morning.",

"Focus improved by 8% this week.",

"Try reducing distractions during afternoon sessions."

];

const insightList =
document.getElementById(
"insights"
);

insights.forEach(text=>{

let li =
document.createElement("li");

li.textContent = text;

li.style.margin =
"10px 0";

insightList.appendChild(li);

});

// --------------------
// BADGES
// --------------------

const badges = [];

let score =
localStorage.getItem(
"focusScore"
) || 100;

let sessions =
localStorage.getItem(
"sessions"
) || 3;

if(score >= 90){

badges.push(
"🎯 Focus Master"
);

}

if(sessions >= 3){

badges.push(
"🏅 Study Warrior"
);

}

if(streak >= 7){

badges.push(
"🔥 Consistency Champion"
);

}

if(score === 100){

badges.push(
"💯 Perfect Focus"
);

}

const badgeDiv =
document.getElementById(
"badges"
);

if(badges.length === 0){

badgeDiv.innerHTML =
"No badges yet.";

}else{

badges.forEach(badge=>{

const p =
document.createElement("p");

p.textContent =
badge;

p.style.fontSize =
"20px";

p.style.margin =
"10px 0";

badgeDiv.appendChild(p);

});

}