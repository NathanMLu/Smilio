import document from "document";
import { display } from "display";
import { vibration } from "haptics";

const STARTINGTIME = 5;
const NUMFACES = 9;
const GAPBETWEEN = 55;
const faces = [];
const dark_faces = [];
const colors = ["fb-aqua", "fb-blue", "fb-cerulean", "fb-cyan", "fb-dark-gray", "fb-green", "fb-green-press", "fb-indigo", "fb-lavender", "fb-light-gray", "fb-lime", "fb-magenta", "fb-mint", "fb-orange", "fb-peach", "fb-pink", "fb-plum", "fb-purple", "fb-red", "fb-slate", "fb-violet", "fb-yellow", "fb-yellow-press"];

let innertimer, background, background_transparent, score;
let running = false;
let timer = STARTINGTIME;
let level = 0;

// Handles auto-shutoff of display
display.addEventListener("change", () => {
    if (display.on) {
        running = true;
    } else {
        running = false;
    }
});

// Min and max are inclusive
function getRandomInt(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Adds time when you go to next level
function addTime(){
    if(innertimer.width < 300){
        timer += 1;
        innertimer.width += (300/STARTINGTIME);
    }
}

// Decreases timer and handles loss
function timerHandler(){
    const countdown = setInterval(function () {
        if (running) {
            // Updates timer every 0.1 secs
            timer -= 0.1;
            innertimer.width -= (300/STARTINGTIME) * 0.1;

            if (timer <= 1){
                // Timer is almost out
                vibration.start("nudge-max");
            }
            if (timer <= 0){
                // Calls end menu
                playerLost();
                clearInterval(countdown);
            }
        }
    }, 100);
}

// Handles all clicks for the faces
function clickHandler(){
    for (let i = 0; i<NUMFACES; i++) (function(i) {
        faces[i].onclick = function (event) {
            if (running) {
                if(faces[i].id == "smiley"){
                    vibration.start("bump");
                    level++;

                    addTime();
                    loadLevel(level);
                } else {
                    vibration.start("nudge");
                }
            }
        }
    })(i);
}

// Handles restarting upon death
function startButtonHandler() {
    background_transparent.onclick = function (event) {
        if (!running) {
            resetToStart();
        }
    }
}

// Randomly changes background
function setBackgroundColor(){
    background.style.fill = colors[getRandomInt(0, colors.length-1)];
}

// Loads the next level
function loadLevel(difficulty){

    if (difficulty > 5){
        setBackgroundColor();
    }

    // Stores old positions of faces
    const x = [];
    const y = [];

    for (let i = 0; i<NUMFACES; i++){
        const generated_x = getRandomInt(0,225);
        const generated_y = getRandomInt(20,225);
        const random_width = getRandomInt(60, 100);

        let success = true;

        // Loops through all previous positions to avoid overlaps
        for (let j = 0; j < x.length; j++){
            if (Math.abs(x[j] - generated_x) <= GAPBETWEEN && Math.abs(y[j] - generated_y) <= GAPBETWEEN) {
                success = false;
                faces[i].style.display = "none";
            }
        }

        // If there is no overlap
        if (success) {
            faces[i].style.display = "inline";

            faces[i].x = generated_x;
            faces[i].y = generated_y;

            faces[i].width = random_width;
            faces[i].height = random_width;

            x.push(generated_x);
            y.push(generated_y);
        }
    }
}

// Shows end screen upon loss
function playerLost(){

    // Shows transparent background
    background_transparent.style.display = "inline";
    background_transparent.style.opacity = 0.6;

    // Shows scoreboard
    score.style.display = "inline";
    score.text = "Score: " + level;

    // Waits for user to click screen (startButtonHandler)
    vibration.start("ping");
    running = false;
}

// Resets screen when user wants to restart
function resetToStart(){
    timer = STARTINGTIME;
    innertimer.width = 300;

    background_transparent.style.display = "none";
    score.style.display = "none";

    running = true;
    level = 0;

    // Hides all faces
    for (let i = 0; i<NUMFACES; i++){
        faces[i].style.display = "none";
    }

    // Starts all listeners and handlers
    timerHandler();
    clickHandler();
    startButtonHandler();

    loadLevel(level);
}

// Initialization from index.gui
function initializeVariables(){
    faces[0] = document.getElementById("smiley");
    faces[1] = document.getElementById("cool");
    faces[2] = document.getElementById("frown1");
    faces[3] = document.getElementById("frown2");
    faces[4] = document.getElementById("neutral");
    faces[5] = document.getElementById("sad");
    faces[6] = document.getElementById("smile1");
    faces[7] = document.getElementById("smile2");
    faces[8] = document.getElementById("smile3");

    dark_faces[0] = document.getElementById("smiley_dark");
    dark_faces[1] = document.getElementById("cool_dark");
    dark_faces[2] = document.getElementById("frown1_dark");
    dark_faces[3] = document.getElementById("frown2_dark");
    dark_faces[4] = document.getElementById("neutral_dark");
    dark_faces[5] = document.getElementById("sad_dark");
    dark_faces[6] = document.getElementById("smile1_dark");
    dark_faces[7] = document.getElementById("smile2_dark");
    dark_faces[8] = document.getElementById("smile3_dark");

    innertimer = document.getElementById("innertimer");
    background = document.getElementById("background");
    background_transparent = document.getElementById("background_transparent");
    score = document.getElementById("score");

    resetToStart();
}

// Only called once, at the start of the game
function start(){
    // TODO: add instructions menu, cache if user has seen before
    // TODO: add leaderboard

    initializeVariables();
}

start();



