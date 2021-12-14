import document from "document";
import { display } from "display";
import { vibration } from "haptics";

const STARTINGTIME = 5;
const NUMFACES = 9;
const GAPBETWEEN = 65;
const faces = [];
const colors = ["fb-aqua", "fb-black", "fb-blue", "fb-cerulean", "fb-cyan", "fb-dark-gray", "fb-extra-dark-gray", "fb-green", "fb-green-press", "fb-indigo", "fb-lavender", "fb-light-gray", "fb-lime", "fb-magenta", "fb-mint", "fb-orange", "fb-peach", "fb-pink", "fb-plum", "fb-purple", "fb-red", "fb-slate", "fb-slate-press", "fb-violet", "fb-yellow", "fb-yellow-press"];

let innertimer, outertimer, background, background_transparent;
let running = false;
let timer = STARTINGTIME;
let level = 0;

display.addEventListener("change", () => {
    if (display.on) {
        running = true;
    } else {
        running = false;
    }
});

function getRandomInt(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function timerHandler(){
    const countdown = setInterval(function () {
        if (running) {
            timer -= 0.1;
            innertimer.width -= (300/STARTINGTIME) * 0.1;
            if (timer <= 1){
                vibration.start("nudge-max");
            }
            if (timer <= 0){
                // Player lost
                clearInterval(countdown);
                background_transparent.style.display = "inline";
                background_transparent.style.opacity = 0.6;
                vibration.start("ping");

                console.log("Timer ended!");
                running = false;
            }
        }
    }, 100);
}

function addTime(){
    if(innertimer.width < 300){
        timer ++;
        innertimer.width += (300/STARTINGTIME);
    }
}

function clickHandler(){
    for (let i = 0; i<NUMFACES; i++) (function(i) {
        faces[i].onclick = function (event) {
            if (running) {
                if(faces[i].id == "smiley"){
                    vibration.start("nudge");
                    addTime();
                    newLevel();
                } else {
                    vibration.start("bump");
                }
            }
        }
    })(i);
}

function startHandler() {
    background_transparent.onclick = function (event) {
        if (!running) {
            restart();
        }
    }
}

function setBackgroundColor(){
    console.log("trying to set color");
    background.style.fill = colors[getRandomInt(0, colors.length-1)];
}

function newLevel(){
    const x = [];
    const y = [];

    setBackgroundColor();
    for (let i = 0; i<NUMFACES; i++){
        const generated_x = getRandomInt(0,225);
        const generated_y = getRandomInt(20,225);

        let success = true;

        // Loops through all previous positions to avoid overlaps
        for (let j = 0; j < x.length; j++){
            if (Math.abs(x[j] - generated_x) <= GAPBETWEEN && Math.abs(y[j] - generated_y) <= GAPBETWEEN) {
                success = false;
                faces[i].style.display = "none";
            }
        }

        if (success) {
            faces[i].style.display = "inline";

            faces[i].x = generated_x;
            faces[i].y = generated_y;

            faces[i].width = getRandomInt(60, 100);
            faces[i].height = faces[i].width;

            x.push(generated_x);
            y.push(generated_y);
        }
    }
}

function refresh(){
    for (let i = 0; i<NUMFACES; i++){
        faces[i].style.display = "none";
    }
}

function restart(){
    timer = STARTINGTIME;
    background_transparent.style.display = "none";
    innertimer.width = 300;
    running = true;
    refresh();
    newLevel();
    timerHandler();
    clickHandler();
    startHandler();
}

function start(){
    faces[0] = document.getElementById("smiley");
    faces[1] = document.getElementById("cool");
    faces[2] = document.getElementById("frown1");
    faces[3] = document.getElementById("frown2");
    faces[4] = document.getElementById("neutral");
    faces[5] = document.getElementById("sad");
    faces[6] = document.getElementById("smile1");
    faces[7] = document.getElementById("smile2");
    faces[8] = document.getElementById("smile3");

    innertimer = document.getElementById("innertimer");
    outertimer = document.getElementById("outertimer");
    background = document.getElementById("background");
    background_transparent = document.getElementById("background_transparent");

    restart();
}

start();



