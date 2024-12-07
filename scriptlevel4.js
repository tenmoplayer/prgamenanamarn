const items = document.querySelectorAll('.box');
const inventory = document.getElementById('inventory');
const sortingBoxes = document.querySelectorAll('.sorting-box');
let lives = 3;
let timer = 45; 
const maxTime = 45; 
let timerInterval;
let totalTime;
let audio; // Declare audio in a global scope
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');
let gamePaused = true;

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


    'item13': 'sorting-box-3',
    'item14': 'sorting-box-3',
    'item15': 'sorting-box-3',
    'item16': 'sorting-box-3',
    'item17': 'sorting-box-3',
    'item18': 'sorting-box-3',


    
    'item19': 'sorting-box-4',
    'item20': 'sorting-box-4',
    'item21': 'sorting-box-4',
    'item22': 'sorting-box-4',
    'item23': 'sorting-box-4',
    'item24': 'sorting-box-4',

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
            updateWaterLevel();
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
        item.classList.add('hidden'); 
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
        playWrongSound();
        displayErrorImage(e.clientX, e.clientY);
        updateTimerDisplay();
    }
}

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

const inventoryContainer = document.querySelector('.inventory'); 
const overlay = document.getElementById('dark-overlay');

inventoryContainer.addEventListener('mousemove', (e) => {
    const x = e.clientX - inventoryContainer.getBoundingClientRect().left + inventoryContainer.scrollLeft;
    const y = e.clientY - inventoryContainer.getBoundingClientRect().top + inventoryContainer.scrollTop;

    overlay.style.mask = `radial-gradient(circle at ${x}px ${y}px, transparent 10px, black 150px)`;
});
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
    const item = document.getElementById('item18'); 

   
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 350) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 50) + 'px'; 
    
    
    popup.classList.add('visible');
}

function hidePopup3() {
    const popup = document.getElementById('popup3');
    popup.classList.remove('visible');
}

function showPopup4() {
    const popup = document.getElementById('popup4');
    const item = document.getElementById('item11'); 

   
    const rect = item.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX - popup.offsetWidth + 500) + 'px'; 
    popup.style.top = (rect.top + window.scrollY - 100) + 'px'; 
    
    
    popup.classList.add('visible');
}

function hidePopup4() {
    const popup = document.getElementById('popup4');
    popup.classList.remove('visible');
}

initGame();
