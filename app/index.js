import document from "document";
import { display } from "display";
import { vibration } from "haptics";

const STARTINGTIME = 5;
const NUMFACES = 9;
const GAPBETWEEN = 60;
const faces = [];
const dark_faces = [];
const colors = ["fb-aqua", "fb-blue", "fb-cerulean", "fb-cyan", "fb-dark-gray", "fb-green", "fb-green-press", "fb-indigo", "fb-lavender", "fb-light-gray", "fb-lime", "fb-magenta", "fb-mint", "fb-orange", "fb-peach", "fb-pink", "fb-plum", "fb-purple", "fb-red", "fb-slate", "fb-violet", "fb-yellow", "fb-yellow-press"];

let innertimer, background, background_transparent, score, all_faces;
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

// Decreases time when you mess up
function decreaseTime(){
    if(innertimer.width > 0){
        timer -= 1;
        innertimer.width -= (300/STARTINGTIME);
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
                if(faces[i].id == "smiley" || faces[i].id == "smiley_red"){
                    vibration.start("bump");
                    level++;

                    addTime();
                    loadLevel(level);
                } else {
                    decreaseTime();
                    vibration.start("nudge");
                }
            }
        }
    })(i);
}

// Handles all clicks for the dark faces
function darkClickHandler(){
    for (let i = 0; i<NUMFACES; i++) (function(i) {
        dark_faces[i].onclick = function (event) {
            if (running) {
                if(dark_faces[i].id == "smiley_dark" || faces[i].id == "smiley_red"){
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

    // Level 2 (technically)
    if (difficulty >= 5){
        faces[0].style.display = "none";
        faces[0] = document.getElementById("smiley");
        faces[0].style.display = "inline";
        setBackgroundColor();
        clickHandler();
        darkClickHandler();
    }

    // Hides all faces
    for (let i = 0; i<NUMFACES; i++){
        faces[i].style.display = "none";
        dark_faces[i].style.display = "none";
    }

    // Stores old positions of faces
    const x = [];
    const y = [];

    for (let i = 0; i<NUMFACES; i++) {
        const generated_x = getRandomInt(-150, 70);
        const generated_y = getRandomInt(-130, 70);
        const random_width = getRandomInt(65, 100);

        let success = true;
        let light = true;

        // Loops through all previous positions to avoid overlaps
        for (let j = 0; j < x.length; j++) {
            if (Math.abs(x[j] - generated_x) <= GAPBETWEEN && Math.abs(y[j] - generated_y) <= GAPBETWEEN) {
                success = false;
            }
        }

        // Level 3
        if (difficulty >= 15) {
            all_faces.animate("activate");
        }

        // Level 4
        if (difficulty >= 20) {
            all_faces.animate("enable");
        }

        // Level 5
        if (difficulty >= 25) {
            all_faces.animate("disable");
        }

        // Level 6
        if (difficulty >= 30){
            console.log("going in here");
            let choice = getRandomInt(0,2);
            if (choice == 0) {
                all_faces.animate("activate");
            } else if (choice == 1) {
                all_faces.animate("enable");
            } else if (choice == 2){
                all_faces.animate("disable");
            }
        }

        // If there is no overlap
        if (success) {
            if(difficulty >= 10){
                // Level 3
                if(getRandomInt(0,1) == 0){
                    dark_faces[i].style.display = "inline";

                    dark_faces[i].x = generated_x;
                    dark_faces[i].y = generated_y;

                    dark_faces[i].width = random_width;
                    dark_faces[i].height = random_width;

                    x.push(generated_x);
                    y.push(generated_y);

                    light = false;
                }
            }

            // Level 1
            if (light == true){
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
}

// Shows end screen upon loss
function playerLost(){

    // Shows transparent background
    background_transparent.style.display = "inline";
    background_transparent.style.opacity = 0.75;

    // Shows scoreboard
    score.style.display = "inline";
    score.text = "Score: " + level;

    // Waits for user to click screen (startButtonHandler)
    vibration.start("ping");
    all_faces.animate("load");
    running = false;
}

// Resets screen when user wants to restart
function resetToStart(){
    timer = STARTINGTIME;
    innertimer.width = 300;

    background.style.fill = "black";
    background_transparent.style.display = "none";
    score.style.display = "none";

    running = true;
    level = 0;

    // Hides all faces
    for (let i = 0; i<NUMFACES; i++){
        faces[i].style.display = "none";
        dark_faces[i].style.display = "none";
    }

    // Starts all listeners and handlers
    timerHandler();
    clickHandler();
    darkClickHandler();
    startButtonHandler();

    loadLevel(level);
}

// Initialization from index.gui
function initializeVariables(){
    faces[0] = document.getElementById("smiley");
    faces[0].style.display = "none";
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
    all_faces = document.getElementById("faces");
    faces[0] = document.getElementById("smiley_red");

    resetToStart();
}

// Only called once, at the start of the game
function start(){
    // TODO: add instructions menu, cache if user has seen before
    // TODO: add leaderboard

    initializeVariables();
}

start();



