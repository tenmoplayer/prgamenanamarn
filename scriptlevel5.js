const items = document.querySelectorAll('.box');
const inventory = document.getElementById('inventory');
const sortingBoxes = document.querySelectorAll('.sorting-box');
let lives = 1;
let timer = 45; // Set initial timer to the desired countdown time
let audio;
let gamePaused = true;
const maxTime = 45;
let timerInterval;
let totalTime; 
let starsAwarded = 0; 
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');

// New feature: hidden items
const hiddenItemsCount = 6; // Number of items visible at once
const visibleItems = []; // Array to hold visible items
const itemToBox = {
    'item11': 'sorting-box-1',
    'item12': 'sorting-box-1',
    'item13': 'sorting-box-1',
    'item14': 'sorting-box-1',
    'item15': 'sorting-box-1',
    'item16': 'sorting-box-1',
    

    'item17': 'sorting-box-2',
    'item18': 'sorting-box-2',
    'item19': 'sorting-box-2',
    'item20': 'sorting-box-2',
    'item21': 'sorting-box-2',
    'item22': 'sorting-box-2',
    'item25': 'sorting-box-2',


    'item6': 'sorting-box-3',
    'item7': 'sorting-box-3',
    'item8': 'sorting-box-3',
    'item9': 'sorting-box-3',
    'item10': 'sorting-box-3',
    'item24': 'sorting-box-3',

    
    'item1': 'sorting-box-4',
    'item2': 'sorting-box-4',
    'item3': 'sorting-box-4',
    'item4': 'sorting-box-4',
    'item5': 'sorting-box-4',
    'item23': 'sorting-box-4',
    'item26': 'sorting-box-4',
};

function initGame() {
    document.getElementById('startModal').style.display = 'block'; 
    resetSortingBoxes();
    startTimer();
    audio = new Audio('lvl1bgm.mp3');  // Initialize the audio object
    audio.loop = true; // Ensure the BGM loops
    audio.play();
}
function startGame() {
    resetSortingBoxes();
    startTimer();
}
function startTimer() {
    if (gamePaused) return;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (gamePaused) return;
        if (timer > 0) {
            timer--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            checkLevelFail();
        }
    }, 1000);
}

function resetSortingBoxes() {
    sortingBoxes.forEach(box => {
        const itemsContainer = box.querySelector('.sorting-items');
        itemsContainer.innerHTML = ''; 
    });
    items.forEach(item => {
        inventory.appendChild(item); 
        item.classList.add('hidden'); // Hide all items initially
    });
}

// New feature: reveal a limited number of items
function revealItems() {
    const randomIndices = new Set(); // Set to avoid duplicates
    while (randomIndices.size < hiddenItemsCount) {
        randomIndices.add(Math.floor(Math.random() * items.length));
    }
    randomIndices.forEach(index => {
        items[index].classList.remove('hidden'); // Show the selected items
        visibleItems.push(items[index]); // Store visible items
    });
}

items.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
});

sortingBoxes.forEach(box => {
    box.addEventListener('dragover', dragOver);
    box.addEventListener('drop', dropInBox);
});

inventory.addEventListener('dragover', dragOver);
inventory.addEventListener('drop', dropInInventory);

function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
}


function dropInBox(e) {
    e.preventDefault();

    const itemID = e.dataTransfer.getData('text/plain');
    const draggingElement = document.getElementById(itemID);

    if (!draggingElement) return;

    const correctBox = itemToBox[itemID] === e.currentTarget.id;

    if (correctBox) {
        // Remove any attached rock
        const attachedRock = draggingElement.querySelector('.rockk');
        if (attachedRock) {
            attachedRock.remove();
            rocksPresent--;
        }

        playCorrectSound();
        e.currentTarget.querySelector('.sorting-items').appendChild(draggingElement);
        timer = Math.min(timer + 3, maxTime);
        showEffect('add');
        updateTimerDisplay();
        checkLevelCompletion();
    } else {
        timer = Math.max(timer - 10, 0);
        lives = Math.max(lives - 1, 0);
        livesDisplay.textContent = lives;
        showEffect('minus');
        if (lives === 0) {
            clearInterval(timerInterval);
            checkLevelFail();
            water.style.height = '100%';
            watertwo.style.height = '100%';
            return;
        }
        if (lives === 1) {
            const tao = document.getElementById('avatar');
            if (tao) tao.src = 'CSS_Folder/lvl1-2.gif';
        }
        playWrongSoundrock();
        displayErrorImage(e.clientX, e.clientY);
        updateTimerDisplay();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const inventory = document.getElementById("inventory");
    const rockImages = [
        "miscimages/rocksthree.png", // Image for 0 clicks
        "miscimages/rockstwo.png", // Image for 1 click
        "miscimages/rocks1.png", // Image for 2 clicks
    ];

    // Function to change the cursor when a rock is clicked and revert after a delay
    function changeCursorTemporary(imageUrl, revertDelay) {
        // Change the cursor to the chosen image
        document.body.style.cursor = `url(${imageUrl}), auto`;

        // Set a timeout to revert the cursor back to default after the delay
        setTimeout(() => {
            document.body.style.cursor = `url(cursorup.png), auto`;
        }, revertDelay);
    }

    // Function to randomly place a rock over an item in the inventory
    function dropRock() {
        const inventoryItems = inventory.querySelectorAll('.box');
        const randomItem = inventoryItems[Math.floor(Math.random() * inventoryItems.length)];
    
        // Ensure rocks are only added to items in the inventory
        if (randomItem.closest('.sorting-box')) return;
    
        // Create a rock element
        const rock = document.createElement("div");
        rock.classList.add("rockk");
        const rockImage = document.createElement("img");
        rockImage.src = "miscimages/rocksthree.png"; // Replace with your rock image path
        rockImage.alt = "Rock"; // Alt text for accessibility
    
        // Append the image to the rock div
        rock.appendChild(rockImage);
    
        // Set initial click count to 0
        rock.dataset.clicks = 0;
    
        // Add click event to the rock
        rock.addEventListener("click", () => {
            // Increment click count
            rock.dataset.clicks++;
            
            // Change image based on click count
            if (rock.dataset.clicks < rockImages.length) {
                rockImage.src = rockImages[rock.dataset.clicks]; // Change the image
            }
            if (rock.dataset.clicks == 1) {
                playSound("rockimpact2.mp3");
            }
            if (rock.dataset.clicks == 2) {
                playSound("rockimpact.mp3")
            }
            // Remove rock after 3 clicks
            if (rock.dataset.clicks >= 3) {
                randomItem.removeChild(rock);
                playSound("rockimpact3.mp3");
    
                rocksPresent--; 
                if (rocksPresent === 0) {
                    enableDragging();
                }
            }
        });
    
        // Ensure no duplicate rocks are added
        if (!randomItem.querySelector(".rockk")) { 
            randomItem.appendChild(rock);
    
            // Animate the rock placement
            setTimeout(() => {
                rock.style.top = '0'; 
            }, 10); 
    
            rocksPresent++; 
            disableDragging(); 
        }
    }
    
    // Disable dragging on inventory items
    function disableDragging() {
        const inventoryItems = inventory.querySelectorAll('.box');
        inventoryItems.forEach(item => {
            item.setAttribute('draggable', 'false');
        });
    }

    // Enable dragging on inventory items
    function enableDragging() {
        const inventoryItems = inventory.querySelectorAll('.box');
        inventoryItems.forEach(item => {
            item.setAttribute('draggable', 'true');
        });
    }

    // Periodically drop a rock
    setInterval(dropRock, 800); // Adjust the interval time as needed
});


function playSound(src) {
    // Create a new audio instance each time
    const audio = new Audio(src);
    audio.play();
  }

function displayErrorImage(x, y) {
    const errorImage = document.createElement('img');
    errorImage.src = 'miscimages/ekis.png'; 
    errorImage.style.position = 'absolute';
    errorImage.style.left = `${x}px`;
    errorImage.style.top = `${y}px`;
    errorImage.style.width = '30px'; 
    errorImage.style.height = '30px'; 
    errorImage.style.zIndex = '1000'; 

    document.body.appendChild(errorImage);
    
    setTimeout(() => {
        errorImage.remove();
    }, 1000); 
}

function dropInInventory(e) {
    e.preventDefault();
    const itemID = e.dataTransfer.getData('text/plain');
    const draggingElement = document.getElementById(itemID);
    inventory.appendChild(draggingElement);
}


function countCorrectItemsInBox(boxId) {
    const correctItems = Object.keys(itemToBox).filter(itemID => itemToBox[itemID] === boxId);
    const boxElement = document.getElementById(boxId).querySelector('.sorting-items');
    const placedItems = Array.from(boxElement.children);
    const correctCount = placedItems.filter(item => correctItems.includes(item.id)).length;
    
    return correctCount === correctItems.length;
}
function shakeWebsite() {
    const body = document.body;
    // Add shake class
    body.classList.add('shake');
    
    // Remove shake class after animation ends
    setTimeout(() => {
      body.classList.remove('shake');
    }, 500); // Match this to the animation duration
  }
  
const inventoryContainer = document.querySelector('.inventory'); 
const overlay = document.getElementById('dark-overlay');

inventoryContainer.addEventListener('mousemove', (e) => {
  
    const x = e.clientX - inventoryContainer.getBoundingClientRect().left + inventoryContainer.scrollLeft;
    const y = e.clientY - inventoryContainer.getBoundingClientRect().top + inventoryContainer.scrollTop;


    overlay.style.mask = `radial-gradient(circle at ${x}px ${y}px, transparent 10px, black 150px)`;
});

function connectPopups() {
    // Get all items with the class 'box'
    const boxes = document.querySelectorAll('.box');

    boxes.forEach((box) => {
        const img = box.querySelector('img'); // Find the image inside the box
        const popupId = img.id.replace('img', 'popup'); // Replace 'img' with 'popup' to get popup ID
        const popup = document.getElementById(popupId); // Find the popup using the generated ID

        // Ensure the popup exists before assigning events
        if (popup) {
            img.addEventListener('mouseover', () => {
                // Show the popup
                popup.style.display = 'block';
                popup.style.position = 'absolute';
                
                const imgRight = img.offsetLeft + img.offsetWidth;
                const popupWidth = popup.offsetWidth;
                const containerWidth = img.closest('.inventory').offsetWidth;
                
                // Check if the popup overflows to the right
                if (imgRight + popupWidth + 10 > containerWidth) {
                    // If it does, position the popup on the left side of the image
                    popup.style.left = `${img.offsetLeft - popupWidth - 10}px`;
                } else {
                    // Otherwise, position it to the right of the image
                    popup.style.left = `${imgRight + 10}px`;
                }

                popup.style.top = `${img.offsetTop}px`; // Align with image top
            });

            img.addEventListener('mouseout', () => {
                popup.style.display = 'none'; // Hide popup when not hovering
            });
        }
    });
}
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
// Run the function to connect all popups after the DOM content is loaded
document.addEventListener('DOMContentLoaded', connectPopups);

initGame();
