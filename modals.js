

function closeStartModal() {
    const content = document.querySelector('.startcontent');
    const modal = document.getElementById('startModal');
    content.classList.add('slide-up');
    setTimeout(() => {
        modal.style.display = 'none';
        gamePaused = false;
        startGame();
    }, 500); 
}
function toggleSettingsMenu() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        const isVisible = settingsModal.style.display === 'block';
        settingsModal.style.display = isVisible ? 'none' : 'block';
        gamePaused = !isVisible;

        if (isVisible) {
            startTimer(); // Resume the timer
        } else {
            stopTimer(); // Pause the timer
        }
    }
}
function closeSettingsMenu() {
    const contentset = document.querySelector('.setmodal');
    const settingsModal = document.getElementById('settingsModal');
    
    if (contentset && settingsModal) {
        // Add the slide-up class to trigger the animation
        contentset.classList.add('slide-up');
        
        // Wait for the animation to finish before hiding the modal
        setTimeout(() => {
            settingsModal.style.display = 'none';
            contentset.classList.remove('slide-up'); // Reset the class for future use
            gamePaused = false; // Resume the game state
            
            if (timer > 0) {
                startTimer(); // Restart the timer if necessary
            }
        }, 500); // Ensure this matches the duration of the slide-up animation
    }
}
function checkLevelFail() {
    if (gamePaused) return;
    
    // Mute the audio when level fails
    if (audio) {
        audio.muted = true;
    }

    // Play the failure sound
    const failSound = new Audio('failsfx.mp3'); // Replace with the path to your audio file
    failSound.play();

    // Show the failure modal
    const modal = document.getElementById('failedModal');
    if (modal) modal.style.display = 'block';
}
function checkLevelCompletion() {
    let allCorrect = true;

    for (const [itemID, boxID] of Object.entries(itemToBox)) {
        const itemElement = document.getElementById(itemID);
        const correctBox = document.getElementById(boxID).querySelector('.sorting-items');
        if (!correctBox.contains(itemElement)) {
            allCorrect = false;
            break;
        }
    }
    
    if (allCorrect) {
        clearInterval(timerInterval);
        displayCompletionModal();
        
    }
}
function dropRock() {
    const container = document.getElementById("rock-container");

    // Create a new rock image
    const rock = document.createElement("img");
    rock.src = "miscimages/rocks1.png"; // Replace with your rock image URL
    rock.alt = "Rock";
    rock.classList.add("rock");

    // Randomize rock size, rotation, and horizontal position
    const size = Math.random() * 40 + 20; // Random size between 20px and 60px
    const rotation = Math.random() * 360; // Random rotation angle
    const left = Math.random() * (container.offsetWidth - size); // Random horizontal position

    // Apply random transformations
    rock.style.width = `${size}px`;
    rock.style.height = `${size}px`;
    rock.style.transform = `rotate(${rotation}deg)`;
    rock.style.left = `${left}px`;

    // Append the rock to the container
    container.appendChild(rock);

    // Trigger the falling animation
    setTimeout(() => {
      rock.style.transform = `translateY(${container.offsetHeight + 100}px) rotate(${rotation + 360}deg)`;
    }, 50);

    // Remove the rock after it falls
    setTimeout(() => {
      rock.remove();
    }, 2000);
  }
  function dropMassiveRocks() {
    // Drop a massive number of rocks (e.g., 50 rocks) at once
    const numberOfRocks = 50;

    for (let i = 0; i < numberOfRocks; i++) {
      dropRock(); // Call dropRock() function for each rock
    }
  }
  // Drop a rock every second
  setInterval(dropRock, 1000);

