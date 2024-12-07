const items = document.querySelectorAll('.box');
const inventory = document.getElementById('inventory');
const sortingBoxes = document.querySelectorAll('.sorting-box');
let lives = 3;
let timer = 60; 
let timerInterval;
let totalTime;
let audio; // Declare audio in a global scope

const livesDisplay = document.getElementById('lives');
const water = document.getElementById('water');
const watertwo = document.getElementById('watertwo'); 
const timerDisplay = document.getElementById('timer');

const maxTime = 60;



const itemToBox = {
    'item1': 'sorting-box-1', 'item2': 'sorting-box-1', 'item3': 'sorting-box-1', 'item4': 'sorting-box-1',
    'item7': 'sorting-box-2', 'item8': 'sorting-box-2', 'item9': 'sorting-box-2', 'item10': 'sorting-box-2',
    'item13': 'sorting-box-3', 'item14': 'sorting-box-3', 'item15': 'sorting-box-3', 'item16': 'sorting-box-3',
    'item19': 'sorting-box-4', 'item20': 'sorting-box-4', 'item21': 'sorting-box-4', 'item22': 'sorting-box-4',
};

let gamePaused = true; 

function initGame() {
    document.getElementById('startModal').style.display = 'block'; 
    resetSortingBoxes();
    startTimer();
    audio = new Audio('lvl1bgm.mp3');  // Initialize the audio object
    audio.loop = true; // Ensure the BGM loops
    audio.play();
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

function updateWaterLevel() {
    const waterLevel = ((maxTime - timer) / maxTime) * 100;
    const cappedHeight = `${Math.min(waterLevel, 100)}%`;
    water.style.height = cappedHeight;
    if (watertwo) watertwo.style.height = cappedHeight;
}

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
    if (gamePaused) return;
    e.preventDefault();
    const itemID = e.dataTransfer.getData('text/plain');
    const draggingElement = document.getElementById(itemID);
    if (draggingElement) inventory.appendChild(draggingElement);
}





window.onload = initGame;

function retryLevel() {
    location.reload();
}

function openLevelMenu() {
    location.href = 'levelsection.html';
}
