// 游戏状态
let gameState = {
    gold: 0,
    ore: 0,
    pickaxes: 0,
    autoMining: false
};

<script>
let isMining = false;
let sliderSpeed = 10;
let currentDirection = 1; // 1=向右，-1=向左
let sliderPosition = 0;
let animationFrame;

// 新的挖矿游戏逻辑
function startMiningGame() {
    if (isMining) return;
    
    // 重置状态
    document.getElementById('minigame-container').style.display = 'block';
    document.getElementById('mining-result').textContent = '';
    isMining = true;
    
    // 开始滑块动画
    animateSlider();
}

function stopSlider() {
    if (!isMining) return;
    
    cancelAnimationFrame(animationFrame);
    isMining = false;
    
    // 判断是否在目标区域
    const targetArea = document.getElementById('target-area');
    const targetStart = targetArea.offsetLeft;
    const targetEnd = targetStart + targetArea.offsetWidth;
    
    if (sliderPosition >= targetStart && sliderPosition <= targetEnd) {
        const baseOre = 1 + gameState.pickaxes;
        gameState.ore += baseOre * 2; // 成功奖励翻倍
        document.getElementById('mining-result').textContent = `成功挖到 ${baseOre * 2} 块矿石！`;
    } else {
        const baseOre = 1 + gameState.pickaxes;
        gameState.ore += Math.floor(baseOre * 0.5); // 失败获得一半
        document.getElementById('mining-result').textContent = `挖矿失败，只获得 ${Math.floor(baseOre * 0.5)} 块矿石`;
    }
    
    updateDisplay();
    document.getElementById('minigame-container').style.display = 'none';
}

function animateSlider() {
    const trackWidth = document.getElementById('slider-track').offsetWidth - 20;
    
    // 更新滑块位置
    sliderPosition += sliderSpeed * currentDirection;
    
    // 边界检测
    if (sliderPosition >= trackWidth) {
        currentDirection = -1;
        sliderPosition = trackWidth;
    } else if (sliderPosition <= 0) {
        currentDirection = 1;
        sliderPosition = 0;
    }
    
    // 更新滑块位置
    document.getElementById('slider').style.left = sliderPosition + 'px';
    
    // 继续动画
    animationFrame = requestAnimationFrame(animateSlider);
    
    // 随机变速增加难度
    if (Math.random() < 0.02) {
        sliderSpeed = 8 + Math.random() * 8;
    }
}

// 添加点击事件监听
document.getElementById('slider').addEventListener('click', stopSlider);
</script>

// 更新显示
function updateDisplay() {
    document.getElementById('gold').textContent = gameState.gold;
    document.getElementById('ore').textContent = gameState.ore;
    document.getElementById('pickaxe').textContent = gameState.pickaxes;
}

// 自动挖矿系统
function startAutoMining() {
    setInterval(() => {
        if (gameState.autoMining) {
            mine();
        }
    }, 1000); // 每秒自动挖矿一次
}

// 初始化
function init() {
    // 加载保存的游戏进度
    const saved = localStorage.getItem('miningGame');
    if (saved) {
        gameState = JSON.parse(saved);
    }
    
    updateDisplay();
    startAutoMining();
}

// 保存游戏进度
function saveGame() {
    localStorage.setItem('miningGame', JSON.stringify(gameState));
}

// 每5秒自动保存一次
setInterval(saveGame, 5000);

// 启动游戏
init();
