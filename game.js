// game.js
let gameState = {
    gold: 0,
    ore: 0,
    pickaxes: 0,
    autoMining: false
};

let isMining = false;
let sliderSpeed = 10;
let currentDirection = 1;
let sliderPosition = 0;
let animationFrame;

function startMiningGame() {
    if (isMining) return;
    
    document.getElementById('minigame-container').style.display = 'block';
    document.getElementById('mining-result').textContent = '';
    isMining = true;
    
    // 初始化滑块位置
    sliderPosition = 0;
    document.getElementById('slider').style.left = '0px';
    animateSlider();
}

function stopSlider() {
    if (!isMining) return;
    
    cancelAnimationFrame(animationFrame);
    isMining = false;
    
    const targetArea = document.getElementById('target-area');
    const targetStart = targetArea.offsetLeft;
    const targetEnd = targetStart + targetArea.offsetWidth;
    
    let baseOre = 1 + gameState.pickaxes;
    if (sliderPosition >= targetStart && sliderPosition <= targetEnd) {
        gameState.ore += baseOre * 2;
        document.getElementById('mining-result').textContent = `🎉 成功挖到 ${baseOre * 2} 块矿石！`;
    } else {
        const gained = Math.floor(baseOre * 0.5);
        gameState.ore += gained;
        document.getElementById('mining-result').textContent = `😢 挖矿失败，获得 ${gained} 块矿石`;
    }
    
    updateDisplay();
    document.getElementById('minigame-container').style.display = 'none';
}

function animateSlider() {
    const trackWidth = document.getElementById('slider-track').offsetWidth - 20;
    
    sliderPosition += sliderSpeed * currentDirection;
    
    if (sliderPosition >= trackWidth) {
        currentDirection = -1;
        sliderPosition = trackWidth;
    } else if (sliderPosition <= 0) {
        currentDirection = 1;
        sliderPosition = 0;
    }
    
    document.getElementById('slider').style.left = sliderPosition + 'px';
    
    animationFrame = requestAnimationFrame(animateSlider);
    
    // 随机速度变化
    if (Math.random() < 0.02) {
        sliderSpeed = 8 + Math.random() * 8;
    }
}

function buyPickaxe() {
    if (gameState.gold >= 10) {
        gameState.gold -= 10;
        gameState.pickaxes++;
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById('gold').textContent = gameState.gold;
    document.getElementById('ore').textContent = gameState.ore;
    document.getElementById('pickaxe').textContent = gameState.pickaxes;
}

// 初始化滑块点击事件
document.getElementById('slider').addEventListener('click', stopSlider);

// 自动挖矿和保存系统
function init() {
    const saved = localStorage.getItem('miningGame');
    if (saved) {
        gameState = JSON.parse(saved);
        // 恢复目标区域宽度
        document.getElementById('target-area').style.width = 
            Math.min(100, 60 + Math.floor(gameState.pickaxes/5)*2) + 'px';
    }
    
    setInterval(() => {
        if (gameState.autoMining) {
            gameState.ore += gameState.pickaxes;
            updateDisplay();
        }
    }, 1000);
    
    updateDisplay();
}

function saveGame() {
    localStorage.setItem('miningGame', JSON.stringify(gameState));
}

setInterval(saveGame, 5000);
init();
