
function displayCompletionModal() {
    const timeTaken = maxTime - timer; 
    const completionModal = document.getElementById('completionModal');
    const timeDisplay = document.createElement('p');
    timeDisplay.textContent = ``;
    completionModal.querySelector('.modal-content').appendChild(timeDisplay);

    const rewardImage = completionModal.querySelector('#treasureimg');
    const duplicationCount = Math.max(1, Math.floor((maxTime - timeTaken) / 9)); 

    for (let i = 1; i < duplicationCount; i++) { 
        const duplicateImage = rewardImage.cloneNode(true);
        completionModal.querySelector('.treasurecontainer').appendChild(duplicateImage);
    }

    completionModal.style.display = 'block';
    audio = new Audio('congrats.mp3');  // Initialize the audio object
    audio.play();
    stopTimer();
}
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
