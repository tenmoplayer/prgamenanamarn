function toggleMuteBGM() {
    const muteButton = document.getElementById('mutebgm');
    
    if (audio.muted) {
        // Unmute the audio
        audio.muted = false;

        muteButton.style.filter = ''; // Reset the filter when unmuted
        console.log("BGM unmuted");
    } else {
        // Mute the audio
        audio.muted = true;

        muteButton.style.filter = 'invert(1)'; // Apply the filter to turn it white when muted
        console.log("BGM muted");
    }
}
function toggleMuteSFX() {
    const muteButton = document.getElementById('mutesfx');
    
    if (incorrectDropSound.muted) {
        // Unmute the audio

        incorrectDropSound.muted = false;  // Unmute the incorrect drop sound
        correctDropSound.muted = false;    // Unmute the correct drop sound
        muteButton.style.filter = ''; // Reset the filter when unmuted
        console.log("SFX unmuted");
    } else {
        // Mute the audio

        incorrectDropSound.muted = true;  // Mute the incorrect drop sound
        correctDropSound.muted = true;    // Mute the correct drop sound

        muteButton.style.filter = 'invert(1)'; // Apply the filter to turn it white when muted
        console.log("SFX muted");
    }
}

function stopTimer() {
    clearInterval(timerInterval); // Stops the timer
}
function playWrongSound() {
    const audio = new Audio('buzz.mp3');
    audio.play();
}
function playCorrectSound() {
    const audio = new Audio('correct.mp3');
    audio.play();
}


function showEffect(type) {
    const addSecs = document.querySelector('.addsecs');
    const minusSecs = document.querySelector('.minussecs');
    
    // Determine which element to show
    let elementToShow;
    if (type === 'add') {
        elementToShow = addSecs;
    } else if (type === 'minus') {
        elementToShow = minusSecs;
    } else {
        console.error('Invalid type. Use "add" or "minus".');
        return;
    }

    // Show the element
    elementToShow.style.display = 'block';

    // Hide the element after 1 second
    setTimeout(() => {
        elementToShow.style.display = 'none';
    }, 1000);
}
