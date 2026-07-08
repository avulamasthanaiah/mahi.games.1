/* =====================================================
   Tiny Chaos
   script.js (Part 1 - Game Engine)
===================================================== */

// ============================
// DOM Elements
// ============================

const background = document.getElementById("background");
const floatingContainer = document.getElementById("floatingContainer");
const mouseEffects = document.getElementById("mouseEffects");

const startScreen = document.getElementById("startScreen");
const reportScreen = document.getElementById("reportScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const shareButton = document.getElementById("shareButton");

const keyCount = document.getElementById("keyCount");
const chaosLevel = document.getElementById("chaosLevel");
const timer = document.getElementById("timer");

const reportKeys = document.getElementById("reportKeys");
const reportTime = document.getElementById("reportTime");
const reportChaos = document.getElementById("reportChaos");
const exitFullscreen = document.getElementById("exitFullscreen");

// ============================
// Game Variables
// ============================

let gameRunning = false;
let totalKeys = 0;
let startTime = 0;
let timerInterval = null;

// Special-key emojis
const emojis = [
    "😀","🚀","🎉","✨","🔥","💥",
    "🐸","🌈","⚡","🎈","🍀","🎵",
    "😎","👾","❤️","⭐","🍕","🎮"
];

// ============================
// Create Background Bubbles
// ============================

function createBackgroundBubbles() {

    background.innerHTML = "";

    for (let i = 0; i < 180; i++) {

        const bubble = document.createElement("div");

        bubble.className = "bubble";

        const size = Math.random() * 7 + 2;

        bubble.style.width = size + "px";
        bubble.style.height = size + "px";

        bubble.style.left = Math.random() * 100 + "vw";

        bubble.style.top = (-Math.random() * 120) + "vh";

        bubble.style.animationDuration =
            (6 + Math.random() * 10) + "s";

        bubble.style.animationDelay =
            (-Math.random() * 15) + "s";

        background.appendChild(bubble);
    }

}

// ============================
// Timer
// ============================

function startTimer() {

    timerInterval = setInterval(() => {

        const seconds =
            Math.floor((Date.now() - startTime) / 1000);

        const mins =
            String(Math.floor(seconds / 60)).padStart(2, "0");

        const secs =
            String(seconds % 60).padStart(2, "0");

        timer.textContent = mins + ":" + secs;

    }, 1000);

}

function stopTimer() {

    clearInterval(timerInterval);

}

// ============================
// Chaos Level
// ============================

function updateChaosLevel() {

    keyCount.textContent = totalKeys;

    chaosLevel.classList.remove(
        "tiny",
        "serious",
        "chaos"
    );

    if (totalKeys < 50) {

        chaosLevel.textContent = "TINY CHAOS";
        chaosLevel.classList.add("tiny");

    }

    else if (totalKeys <= 150) {

        chaosLevel.textContent = "GETTING SERIOUS";
        chaosLevel.classList.add("serious");

    }

    else {

        chaosLevel.textContent = "CHAOS MODE";
        chaosLevel.classList.add("chaos");

    }

}

// ============================
// Start Game
// ============================

async function startGame() {

    exitFullscreen.style.display = "block";

    try {

        await document.documentElement.requestFullscreen();

    } catch (e) {

        console.log("Fullscreen blocked.");

    }

    startScreen.style.display = "none";

    totalKeys = 0;

    updateChaosLevel();

    startTime = Date.now();

    startTimer();

    gameRunning = true;

}

// ============================
// End Game
// ============================

function endGame() {

    exitFullscreen.style.display = "none";

    if (!gameRunning)
        return;

    gameRunning = false;

    stopTimer();

    reportScreen.style.display = "flex";

    reportKeys.textContent = totalKeys;

    reportTime.textContent =
        timer.textContent;

    reportChaos.textContent =
        chaosLevel.textContent;

}

// ============================
// Button Events
// ============================

startButton.addEventListener(
    "click",
    startGame
);

restartButton.addEventListener(
    "click",
    () => {

        location.reload();

    }
);

shareButton.addEventListener(
    "click",
    () => {

        const text =
            `I smashed ${totalKeys} keys in ${timer.textContent}! (${chaosLevel.textContent})`;

        navigator.clipboard.writeText(text);

        alert("Result copied to clipboard!");

    }
);

// ============================
// Fullscreen Exit
// ============================

document.addEventListener(
    "fullscreenchange",
    () => {

        if (
            gameRunning &&
            !document.fullscreenElement
        ) {

            endGame();

        }

    }
);



/* =====================================================
   Tiny Chaos
   script.js (Part 2 - Keyboard & Mouse Engine)
===================================================== */

// ============================
// Floating Character
// ============================

function createFloatingItem(text, isEmoji = false) {

    const item = document.createElement("div");

    item.className = "floatItem";

    item.innerText = text;

    item.style.position = "fixed";
    item.style.left = Math.random() * (window.innerWidth - 100) + "px";
    item.style.bottom = "0px";
    item.style.fontSize = isEmoji ? "60px" : "70px";
    item.style.zIndex = "9999";

    if (isEmoji) {
        item.classList.add("floatEmoji");
    }

    floatingContainer.appendChild(item);

    item.addEventListener("animationend", () => item.remove());
    console.log("Created:", text);
}

// ============================
// Random Emoji
// ============================

function randomEmoji() {

    return emojis[
        Math.floor(Math.random() * emojis.length)
    ];

}

// ============================
// Keyboard Events
// ============================

document.addEventListener("keydown", (event) => {

    if (!gameRunning)
        return;

    totalKeys++;

    updateChaosLevel();

    const key = event.key;

    // Letters & Numbers
    if (/^[a-zA-Z0-9]$/.test(key)) {

        createFloatingItem(
            key.toUpperCase(),
            false
        );

    }

    // Everything else
    else {

        createFloatingItem(
            randomEmoji(),
            true
        );

    }

});

// ============================
// Mouse Ripple
// ============================

function createRipple(x, y) {

    if (mouseEffects.children.length > 25) {
        mouseEffects.firstChild.remove();
    }
    
    const ripple =
        document.createElement("div");

    ripple.className = "mouseRipple";

    ripple.style.left =
        (x - 10) + "px";

    ripple.style.top =
        (y - 10) + "px";

    mouseEffects.appendChild(ripple);

    setTimeout(() => {

        ripple.remove();

    }, 500);

}

let lastRipple = 0;

document.addEventListener("mousemove", (e) => {

    if (!gameRunning)
        return;

    const now = Date.now();

    // Only create one ripple every 40ms (~25 FPS)
    if (now - lastRipple < 40)
        return;

    lastRipple = now;

    createRipple(e.clientX, e.clientY);

});

// ============================
// Touch Support
// ============================

document.addEventListener("touchmove", (e) => {

    if (!gameRunning)
        return;

    const touch =
        e.touches[0];

    createRipple(
        touch.clientX,
        touch.clientY
    );

});

// ============================
// Prevent Browser Shortcuts
// ============================

document.addEventListener("keydown", (e) => {

    if (!gameRunning)
        return;

    // Prevent scrolling with space
    if (e.code === "Space") {

        e.preventDefault();

    }

});
window.addEventListener("load", () => {
    createBackgroundBubbles();
    console.log(background.children.length);
});




let gameStarted = false;

async function startGameFromUserInteraction() {

    if (gameStarted) return;

    gameStarted = true;

    await startGame();
}

// Desktop
document.addEventListener("keydown", startGameFromUserInteraction);

// Mouse
document.addEventListener("click", startGameFromUserInteraction);

// Mobile
document.addEventListener("touchstart", startGameFromUserInteraction);





exitFullscreen.addEventListener("click", async () => {

    if (document.fullscreenElement) {
        await document.exitFullscreen();
    }

    endGame();

});
