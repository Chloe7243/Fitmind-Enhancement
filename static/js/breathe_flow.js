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

let fillProgress = 0;          
let actualFill = 0;  
let fillAnimationFrame = null;
const FILL_SPEED = 0.01;     // Adjust this to control how fast it fills


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

    startFillingBar();

    countdownInterval = setInterval(() => {
      const heldTime = Date.now() - breathStartTime;
      if (!exhalePromptShown && heldTime >= MIN_HOLD_TIME) {
        exhalePromptShown = true;
        feedback.textContent = "Exhale now (release spacebar)";
      }
    }, 100);
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space" && isBreathing) {
    isBreathing = false;
    orb.classList.remove("breathing");
    clearInterval(countdownInterval);
    cancelAnimationFrame(fillAnimationFrame);

    const breathDuration = Date.now() - breathStartTime;

    if (breathDuration >= MIN_HOLD_TIME) {
      calmPoints += SCORE_VALUE;
      feedback.textContent = "✅ Great job! Calm points earned.";

      // Update actual fill based on points
      actualFill = calmPoints / MAX_POINTS;
      calmFill.style.width = `${actualFill * 100}%`;
    } else {
      feedback.textContent = "⚠️ Too quick! Wait for the exhale signal.";
      reverseBar();
    }

    updateUI();
  }
});

// start filling the bar
function startFillingBar() {
  targetFill = 1; // Fill to 100% visually

  function animate() {
    if (!isBreathing) return;

    // Smoothly animate toward full width
    actualFill += FILL_SPEED;
    if (actualFill > 1) actualFill = 1;

    calmFill.style.width = `${actualFill * 100}%`;
    fillAnimationFrame = requestAnimationFrame(animate);
  }

  animate();
}


// Reverse the bar animation if the user releases spacebar too early
function reverseBar() {
  function animate() {
    fillProgress -= FILL_SPEED * 2; // faster fallback
    if (fillProgress < (calmPoints / MAX_POINTS)) {
      fillProgress = (calmPoints / MAX_POINTS); // return to last earned point
      calmFill.style.width = `${fillProgress * 100}%`;
      return;
    }

    calmFill.style.width = `${fillProgress * 100}%`;
    requestAnimationFrame(animate);
  }

  animate();
}

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
