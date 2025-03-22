// main.js

// Utility function to load a script dynamically with error handling.
function loadScript(url, callback) {
  const script = document.createElement("script");
  script.src = url;
  script.defer = true;
  script.onload = callback;
  script.onerror = function () {
    console.error(`Failed to load script: ${url}`);
  };
  document.body.appendChild(script);
}

// Function to play sound (by element ID).
function playSound(soundId) {
  const sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

// Global variable to store the selected game mode. Default is "duo".
let gameMode = "duo";

// Function to update UI for Duo mode.
function selectDuoMode() {
  gameMode = "duo";
  // Show both name inputs.
  const nameContainer = document.getElementById("nameContainer");
  if (nameContainer) {
    nameContainer.style.display = "block";
    const p1Input = document.getElementById("p1Name");
    const p2Input = document.getElementById("p2Name");
    if (p1Input) {
      p1Input.placeholder = "Enter 🟦 Player 1 Name";
      p1Input.style.display = "inline-block";
    }
    if (p2Input) {
      p2Input.placeholder = "Enter 🟥 Player 2 Name";
      p2Input.style.display = "inline-block";
    }
  }
  // Show both control boxes and space them out.
  const controls = document.getElementById("playerControls");
  if (controls && controls.children.length > 1) {
    controls.children[0].style.display = "block"; // Player 1 controls.
    controls.children[1].style.display = "block"; // Player 2 controls.
    controls.style.justifyContent = "space-between";
  }
  // Animate Start button and play a mode-selection sound.
  animateStartButton();
  playSound("shootSound"); // example sound.
}

// Function to update UI for Survival mode.
function selectSurvivalMode() {
  gameMode = "survival";
  // Show only one name input; hide second input.
  const nameContainer = document.getElementById("nameContainer");
  if (nameContainer) {
    nameContainer.style.display = "block";
    const p1Input = document.getElementById("p1Name");
    const p2Input = document.getElementById("p2Name");
    if (p1Input) {
      p1Input.placeholder = "Enter Your Name";
      p1Input.style.display = "inline-block";
    }
    if (p2Input) {
      p2Input.style.display = "none";
    }
  }
  // Update player controls: hide Player 2 control box and center the single control.
  const controls = document.getElementById("playerControls");
  if (controls) {
    if (controls.children.length > 1) {
      controls.children[1].style.display = "none"; // Hide Player 2 controls.
    }
    controls.style.justifyContent = "center";
  }
  // Animate Start button and play sound.
  animateStartButton();
  playSound("shootSound");
}

// Adds a pulsing animation effect to the Start button.
function animateStartButton() {
  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.classList.add("animate-button");
    // Remove the animation class after a few seconds so it doesn't loop forever.
    setTimeout(() => {
      startButton.classList.remove("animate-button");
    }, 3000);
  }
}

// Start game function that loads the appropriate script based on the selected game mode.
function startGame() {
  // Play background music when starting.
  playSound("bgMusic");
  // Animate the Start button.
  animateStartButton();

  // For Survival mode, update the displayed player name in the control box.
  if (gameMode === "survival") {
    const p1Input = document.getElementById("p1Name");
    const playerControls = document.getElementById("playerControls");
    if (p1Input && playerControls && playerControls.children.length > 0) {
      const player1Control = playerControls.children[0];
      const header = player1Control.querySelector("h3");
      if (header) {
        header.textContent = (p1Input.value || "Player") + " 🎮:";
      }
    }
  }

  // Hide the start screen overlay.
  const startScreen = document.getElementById("startScreen");
  if (startScreen) {
    startScreen.classList.add("hidden");
  }

  // Load the appropriate game mode script.
  if (gameMode === "duo") {
    loadScript("duoMode.js", function () {
      if (typeof duoStartGame === "function") {
        duoStartGame();
      } else {
        console.error("Function duoStartGame not found.");
      }
    });
  } else if (gameMode === "survival") {
    loadScript("survival.js", function () {
      if (typeof survivalStartGame === "function") {
        survivalStartGame();
      } else {
        console.error("Function survivalStartGame not found.");
      }
    });
  } else {
    console.error("Unknown game mode: " + gameMode);
  }
}

// Global function to handle Game Over and enable the "Play Again!" button.
function playAgain() {
  // Option 1: Reload the page.
  location.reload();
  // Option 2: Reset UI elements and game state (if your mode scripts support a reset function).
  // For simplicity, reloading the page works similarly to Duo mode.
}

// Expose functions globally.
window.startGame = startGame;
window.selectDuoMode = selectDuoMode;
window.selectSurvivalMode = selectSurvivalMode;
window.playAgain = playAgain;
