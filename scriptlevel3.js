const items = document.querySelectorAll('.box');
const inventory = document.getElementById('inventory');
const sortingBoxes = document.querySelectorAll('.sorting-box');
let lives = 3;
let timer = 50; 
const maxTime = 50; 
let timerInterval;
let totalTime;
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');
let audio; // Declare audio in a global scope
const hiddenItemsCount = 6; 
const visibleItems = []; 
const itemToBox = {
    'item1': 'sorting-box-1',
    'item2': 'sorting-box-1',
    'item3': 'sorting-box-1',
    'item4': 'sorting-box-1',
    'item5': 'sorting-box-1',

    'item7': 'sorting-box-2',
    'item8': 'sorting-box-2',
    'item9': 'sorting-box-2',
    'item10': 'sorting-box-2',
    'item11': 'sorting-box-2',
    'item12': 'sorting-box-2',

    'item13': 'sorting-box-3',
    'item14': 'sorting-box-3',
    'item15': 'sorting-box-3',
    'item16': 'sorting-box-3',
    'item17': 'sorting-box-3',

    
    'item19': 'sorting-box-4',
    'item20': 'sorting-box-4',
    'item21': 'sorting-box-4',
    'item22': 'sorting-box-4',
    'item23': 'sorting-box-4',
    'item24': 'sorting-box-4',
};
let gamePaused = true; 

function initGame() {
    document.getElementById('startModal').style.display = 'block'; 
    lives = 3;
    timer = 55; 
    livesDisplay.textContent = lives;
    gamePaused = true;
    resetSortingBoxes();
    audio = new Audio('lvl1bgm.mp3');  // Initialize the audio object
    audio.loop = true; // Ensure the BGM loops
    audio.play();
    startTimer();
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
function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function resetSortingBoxes() {
    if (gamePaused) return;
    sortingBoxes.forEach(box => {
        const itemsContainer = box.querySelector('.sorting-items');
        itemsContainer.innerHTML = '';
    });
    items.forEach(item => {
        inventory.appendChild(item);
    });
}


function revealItems() {
    const randomIndices = new Set(); 
    while (randomIndices.size < hiddenItemsCount) {
        randomIndices.add(Math.floor(Math.random() * items.length));
    }
    randomIndices.forEach(index => {
        items[index].classList.remove('hidden'); 
        visibleItems.push(items[index]); 
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
        shakeScreen();
        dropMassiveRocks();
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
    // Function to randomly place a rock over an item in the inventory
    function dropRock() {
        const inventoryItems = inventory.querySelectorAll('.box');
        const randomItem = inventoryItems[Math.floor(Math.random() * inventoryItems.length)];
    
        // Ensure rocks are only added to items in the inventory
        if (randomItem.closest('.sorting-box')) return;
        disableDragging();
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
    
    function disableDragging() {
        const inventoryItems = inventory.querySelectorAll('.box');
        inventoryItems.forEach(item => {
            item.setAttribute('draggable', 'false');
        });
    }

   
    function enableDragging() {
        const inventoryItems = inventory.querySelectorAll('.box');
        inventoryItems.forEach(item => {
            item.setAttribute('draggable', 'true');
        });
    }

    
    setInterval(dropRock, 3000); 
});


function playSound(src) {
    
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



function showPopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('visible');
}

function hidePopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('visible');
}

function shakeWebsite() {
    const body = document.body;
    
    body.classList.add('shake');
    
    
    setTimeout(() => {
      body.classList.remove('shake');
    }, 500); 
  }

function showPopup2() {
    const popup = document.getElementById('popup2');
    const item = document.getElementById('item5'); 

   
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 350) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 50) + 'px'; 
    
    
    popup.classList.add('visible');
}

function hidePopup2() {
    const popup = document.getElementById('popup2');
    popup.classList.remove('visible');
}

function showPopup3() {
    const popup = document.getElementById('popup3');
    const item = document.getElementById('item12'); 

   
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 350) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 50) + 'px'; 
    
    
    popup.classList.add('visible');
}

function hidePopup3() {
    const popup = document.getElementById('popup3');
    popup.classList.remove('visible');
}

function showPopup1() {
    const popup = document.getElementById('popup1');
    const item = document.getElementById('item24'); 

   
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 350) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 50) + 'px'; 
    
    
    popup.classList.add('visible');
}

function hidePopup1() {
    const popup = document.getElementById('popup1');
    popup.classList.remove('visible');
}
function shakeScreen(duration = 500) {
    const body = document.body;
  
    // Add the shaking class
    body.classList.add("screen-shake");
  
    // Remove the shaking class after the specified duration
    setTimeout(() => {
      body.classList.remove("screen-shake");
    }, duration);
  }
  function displayCompletionModal() {
    const timeTaken = maxTime - timer; 
    const completionModal = document.getElementById('completionModal');
    const timeDisplay = document.createElement('p');
    timeDisplay.textContent = ``;
    completionModal.querySelector('.modal-content').appendChild(timeDisplay);
    localStorage.setItem('completedLevel', '3');
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
initGame();
