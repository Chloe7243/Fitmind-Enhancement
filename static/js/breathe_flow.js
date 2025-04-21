let calmPoints = 0;
let isBreathing = false;
let breathStartTime = 0;
let exhalePromptShown = false;
let countdownInterval = null;

const MIN_HOLD_TIME = 10000; // 4 seconds before exhale prompt
const SCORE_VALUE = 10;
const MAX_POINTS = 50;

let calmFill = document.getElementById("calm-fill");
let scoreText = document.getElementById("score");
let feedback = document.getElementById("feedback");
let gameOver = document.getElementById("game-over");
let finalScore = document.getElementById("final-score");
let orb = document.getElementById("orb");

// Prevent spacebar from scrolling
window.addEventListener("keydown", function (e) {
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault();
  }
});

// Handle keydown: Start inhaling when spacebar is pressed
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isBreathing) {
    isBreathing = true;
    breathStartTime = Date.now();
    exhalePromptShown = false;
    orb.classList.add("breathing"); // Grows the orb
    feedback.textContent = "Inhale... Hold it...";

    countdownInterval = setInterval(() => {
      const heldTime = Date.now() - breathStartTime;
      if (!exhalePromptShown && heldTime >= MIN_HOLD_TIME) {
        exhalePromptShown = true;
        feedback.textContent = "🌬️ Exhale now (release spacebar)";
      }
    }, 100);
  }
});

// Handle keyup: End inhaling when spacebar is released
document.addEventListener("keyup", (e) => {
  if (e.code === "Space" && isBreathing) {
    isBreathing = false;
    orb.classList.remove("breathing"); // Shrinks the orb
    clearInterval(countdownInterval);

    const breathDuration = Date.now() - breathStartTime;

    if (breathDuration >= MIN_HOLD_TIME) {
      calmPoints += SCORE_VALUE;
      feedback.textContent = "✅ Great job! Calm points earned.";
    } else {
      feedback.textContent = "⚠️ Too quick! Wait for the exhale signal.";
    }

    updateUI();
  }
});

// Update the calm points UI and check for game over
function updateUI() {
  scoreText.textContent = `Calm Points: ${calmPoints}`;
  calmFill.style.width = `${(calmPoints / MAX_POINTS) * 100}%`;

  if (calmPoints >= MAX_POINTS) {
    endGame();
  }
}

// Show the game over screen with final score
function endGame() {
  gameOver.style.display = "block";
  finalScore.textContent = calmPoints;
}

// Restart the game and reset everything
function restartGame() {
  calmPoints = 0;
  calmFill.style.width = "0%";
  scoreText.textContent = "Calm Points: 0";
  feedback.textContent = "Press & hold Spacebar to breathe in…";
  gameOver.style.display = "none";
}
