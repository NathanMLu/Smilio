import document from "document";
import { display } from "display";
import { vibration } from "haptics";

const STARTINGTIME = 15;
const NUMFACES = 9;
const GAPBETWEEN = 70;
const faces = [];

let innertimer, outertimer;
let running = false;
let timer = STARTINGTIME;


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
            if (timer <= 0){
                // Stops the timer
                clearInterval(countdown);
                vibration.start("ping");

                console.log("Timer ended!");
                running = false;
            }
        }
    }, 100);
}

function addTime(){

    if(innertimer.width < 300){
        timer += 2;
        innertimer.width += (300/STARTINGTIME) * 2;
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

function newLevel(){
    const x = [];
    const y = [];
    for (let i = 0; i<NUMFACES; i++){
        const generated_x = getRandomInt(0,255);
        const generated_y = getRandomInt(0,255);

        let success = true;

        // Loops through all previous positions to avoid overlaps
        for (let j = 0; j < x.length; j++){
            if (Math.abs(x[j] - generated_x) <= GAPBETWEEN && Math.abs(y[j] - generated_y) <= GAPBETWEEN) {
                success = false;
            }
        }

        if (success) {
            faces[i].style.display = "inline";

            faces[i].x = generated_x;
            faces[i].y = generated_y;

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

    refresh();
    newLevel();
    timerHandler();
    clickHandler();

    running = true;
}

start();



