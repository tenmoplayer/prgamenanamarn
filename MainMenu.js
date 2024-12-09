function spawnFallingImages() {
    const imageContainer = document.querySelector('.image-container');
    const images = [
        'level3pics/COSMETICS/LVL 3 - MAGNESIUM.png', // Replace with your image paths
        'level3pics/FOOD ADDITIVES/LVL 3 - HYDROGEN.png',
        'level1pics/FOOD ADDITIVES/SILVER SWAN SOY SAUCE.png',
        'level5pics/CLEANING AGENTS/CONSUMER PRODUCT (66).png',
        'level2pics/CLEANING AGENT/CONSUMER PRODUCT (48).png',
        'level1pics/ACTIVE INGREDIENTS/CONSUMER PRODUCT (64).png',
        'level5pics/FOOD ADDITIVES/CONSUMER PRODUCT (66).png',
        'level3pics/ACTIVE INGREDIENT/ACTIVE INGREDIENTS 32.png'
    ];

    // Create a new image element
    const img = document.createElement('img');
    img.src = images[Math.floor(Math.random() * images.length)];
    img.classList.add('falling-image');

    // Set a random horizontal position
    img.style.left = Math.random() * (window.innerWidth - 50) + 'px'; // Adjust for image width

    // Set a random rotation angle between -30 and 30 degrees
    const randomAngle = Math.random() * 60 - 30; // Generates a value between -30 and 30
    img.style.transform = `rotate(${randomAngle}deg)`;

    // Append the image to the container
    imageContainer.appendChild(img);

    // Remove the image after it falls
    setTimeout(() => {
        img.remove();
    }, 5000); // Match the animation duration
}

// Call the function at intervals to keep spawning images
setInterval(spawnFallingImages, 1000); // Spawns an image every second

const question = document.getElementById('question');
function showquestion() {
    question.style.display = 'block';

}
function removequestion() {
    question.style.display = 'none';
}