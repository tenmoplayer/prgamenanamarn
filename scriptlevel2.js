const items = document.querySelectorAll('.box');
const inventory = document.getElementById('inventory');
const sortingBoxes = document.querySelectorAll('.sorting-box');
let audio; // Declare audio in a global scope
let lives = 3;
let timer = 55; 
let timerInterval;
let totalTime; 
let starsAwarded = 0; 
const livesDisplay = document.getElementById('lives');
const water = document.getElementById('water');
const watertwo = document.getElementById('watertwo');
const timerDisplay = document.getElementById('timer');
const incorrectDropSound = new Audio('buzz.mp3');
const correctDropSound = new Audio('correct.mp3');
const maxTime = 55; 

const hiddenItemsCount = 6; 
const visibleItems = []; 
const itemToBox = {
    'item1': 'sorting-box-1',
    'item2': 'sorting-box-1',
    'item3': 'sorting-box-1',
    'item4': 'sorting-box-1',
    

    'item7': 'sorting-box-2',
    'item8': 'sorting-box-2',
    'item9': 'sorting-box-2',
    'item10': 'sorting-box-2',

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
};

let gamePaused = true;  // Keeps track of whether the game is paused or not

function initGame() {
    document.getElementById('startModal').style.display = 'block'; 
    lives = 3;
    timer = 55; 
    livesDisplay.textContent = lives;
    gamePaused = true;
    resetSortingBoxes();
    // Set the game as not paused and start the timer
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
            updateWaterLevel();
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

function startGame() {
    resetSortingBoxes();
    startTimer();
    updateWaterLevel();
    water.style.height = '0%';
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



function dragOver(e) {
    if (gamePaused) return;
    e.preventDefault();
}

function dragStart(e) {
    if (gamePaused) return;
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    if (gamePaused) return;
    e.target.classList.remove('dragging');
}


function dropInBox(e) {
    e.preventDefault();

    const itemID = e.dataTransfer.getData('text/plain');
    const draggingElement = document.getElementById(itemID);

    if (!draggingElement) return;

    const correctBox = itemToBox[itemID] === e.currentTarget.id;

    if (correctBox) {
        playCorrectSound();
        e.currentTarget.querySelector('.sorting-items').appendChild(draggingElement);
        timer = Math.min(timer + 3, maxTime);
        showEffect('add');
        updateTimerDisplay();
        updateWaterLevel();
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
        playWrongSound();
        displayErrorImage(e.clientX, e.clientY);
        updateTimerDisplay();
        updateWaterLevel();
    }
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


function showPopup1() {
    const popup = document.getElementById('popup1');
    const img = document.getElementById('item22-img');

   
    const rect = img.getBoundingClientRect();
    
    
    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 330) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 10) + 'px'; 

    popup.classList.add('visible');
}

function hidePopup1() {
    const popup = document.getElementById('popup1');
    popup.classList.remove('visible');
}

function showPopup3() {
    const popup = document.getElementById('popup3');
    const item = document.getElementById('item16');
    
    const rect = item.getBoundingClientRect();

   
    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 410) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 50) + 'px'; 
    
   
    popup.classList.add('visible');
}

function hidePopup3() {
    const popup = document.getElementById('popup3');
    popup.classList.remove('visible');
}

function showPopup5() {
    const popup = document.getElementById('popup5');
    const item = document.getElementById('item7'); 

    
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 270) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 50) + 'px'; 
    
   
    popup.classList.add('visible');
}

function hidePopup5() {
    const popup = document.getElementById('popup5');
    popup.classList.remove('visible');
}

function showPopup4() {
    const popup = document.getElementById('popup4');
    const item = document.getElementById('item13');

    
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 330) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 40) + 'px'; 
    

    popup.classList.add('visible');
}

function hidePopup4() {
    const popup = document.getElementById('popup4');
    popup.classList.remove('visible');
}

function showPopup6() {
    const popup = document.getElementById('popup6');
    const item = document.getElementById('item9');

    
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 310) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 50) + 'px'; 
    
    
    popup.classList.add('visible');
}

function hidePopup6() {
    const popup = document.getElementById('popup6');
    popup.classList.remove('visible');
}

function showPopup2() {
    const popup = document.getElementById('popup2');
    const item = document.getElementById('item4'); 

    
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 350) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 50) + 'px'; 
    
    
    popup.classList.add('visible');
}

function hidePopup2() {
    const popup = document.getElementById('popup2');
    popup.classList.remove('visible');
}

function showPopup7() {
    const popup = document.getElementById('popup7');
    const item = document.getElementById('item19'); 

   
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 350) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 50) + 'px'; 
    
    
    popup.classList.add('visible');
}

function hidePopup7() {
    const popup = document.getElementById('popup7');
    popup.classList.remove('visible');
}

function showPopup8() {
    const popup = document.getElementById('popup8');
    const item = document.getElementById('item20');

    
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 400) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 50) + 'px'; 
    
    
    popup.classList.add('visible');
}

function hidePopup8() {
    const popup = document.getElementById('popup8');
    popup.classList.remove('visible');
}

function stopTimer() {
    clearInterval(timerInterval); // Stops the timer
}

function updateWaterLevel() {
    const waterLevel = ((maxTime - timer) / maxTime) * 100;
    const cappedHeight = `${Math.min(waterLevel, 100)}%`;
    water.style.height = cappedHeight;
    if (watertwo) watertwo.style.height = cappedHeight;
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
window.onload = initGame;
