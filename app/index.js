import document from "document";
import { display } from "display";

const STARTINGTIME = 15;

let smiley, cool, frown1, frown2, neutral, sad, smile1, smile2, smile3;
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

function Start(){
    smiley = document.getElementById("smiley");
    cool = document.getElementById("cool");
    frown1 = document.getElementById("frown1");
    frown2 = document.getElementById("frown2");
    neutral = document.getElementById("neutral");
    sad = document.getElementById("sad");
    smile1 = document.getElementById("smile1");
    smile2 = document.getElementById("smile2");
    smile3 = document.getElementById("smile3");

    innertimer = document.getElementById("innertimer");
    outertimer = document.getElementById("outertimer");

    //smiley.style.display = "none";
    cool.style.display = "none";
    frown1.style.display = "none";
    frown2.style.display = "none";
    neutral.style.display = "none";
    sad.style.display = "none";
    smile1.style.display = "none";
    smile2.style.display = "none";
    smile3.style.display = "none";

    timerHandler();
    running = true;
}

function timerHandler(){
    const countdown = setInterval(function () {
        if (running) {
            timer -= 0.1;
            innertimer.x -= (300/STARTINGTIME) * 0.1;
            if (timer <= 0){
                // Stops the timer
                clearInterval(countdown);

                console.log("Timer ended!");
                running = false;
            }
        }
    }, 100);
}

Start();



