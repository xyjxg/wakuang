// 游戏状态
let gameState = {
    gold: 0,
    ore: 0,
    pickaxes: 0,
    autoMining: false
};

// 手动挖矿
function mine() {
    gameState.ore += 1 + gameState.pickaxes;
    updateDisplay();
}

// 购买铁镐
function buyPickaxe() {
    if (gameState.gold >= 10) {
        gameState.gold -= 10;
        gameState.pickaxes++;
        updateDisplay();
    }
}

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
