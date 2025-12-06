// 获取Canvas和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置Canvas大小
canvas.width = 800;
canvas.height = 600;

// 游戏状态
let gameState = {
    score: 0,
    lives: 3,
    enemiesRemaining: 5,
    gameOver: false,
    paused: false
};

// 玩家坦克
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    speed: 2,
    direction: 0, // 0: 上, 1: 右, 2: 下, 3: 左
    color: '#4CAF50',
    bullets: [],
    canShoot: true,
    shootCooldown: 0
};

// 敌人坦克数组
let enemies = [];

// 墙壁数组
const walls = [];

// 键盘状态
const keys = {};

// 找到一个不与墙壁重叠的位置
function findValidPosition(width, height, excludePositions = []) {
    let x, y;
    let validPosition = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!validPosition && attempts < maxAttempts) {
        x = Math.random() * (canvas.width - width - 40) + 20;
        y = Math.random() * (canvas.height - height - 40) + 20;
        
        // 创建临时对象用于碰撞检测
        const tempObj = { x, y, width, height };
        
        // 检查是否与墙壁碰撞
        if (!checkWallCollision(tempObj)) {
            // 检查是否与排除位置重叠
            let tooClose = false;
            for (let pos of excludePositions) {
                const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                if (dist < 100) {
                    tooClose = true;
                    break;
                }
            }
            if (!tooClose) {
                validPosition = true;
            }
        }
        attempts++;
    }
    
    // 如果找不到有效位置，返回默认位置（中心）
    if (!validPosition) {
        return { x: canvas.width / 2, y: canvas.height / 2 };
    }
    
    return { x, y };
}

// 初始化游戏
function initGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.enemiesRemaining = 5;
    gameState.gameOver = false;
    
    player.bullets = [];
    player.direction = 0;
    
    enemies = [];
    // 先创建墙壁
    createWalls();
    
    // 找到玩家有效位置
    const playerPos = findValidPosition(player.width, player.height);
    player.x = playerPos.x;
    player.y = playerPos.y;
    
    spawnEnemies(5);
    updateUI();
}

// 创建墙壁
function createWalls() {
    walls.length = 0;
    // 边界墙
    walls.push({ x: 0, y: 0, width: canvas.width, height: 20 });
    walls.push({ x: 0, y: 0, width: 20, height: canvas.height });
    walls.push({ x: canvas.width - 20, y: 0, width: 20, height: canvas.height });
    walls.push({ x: 0, y: canvas.height - 20, width: canvas.width, height: 20 });
    
    // 内部障碍物
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * (canvas.width - 100) + 50;
        const y = Math.random() * (canvas.height - 100) + 50;
        const size = 40 + Math.random() * 40;
        walls.push({ x, y, width: size, height: size });
    }
}

// 生成敌人
function spawnEnemies(count) {
    enemies = [];
    const enemySize = 30;
    const excludePositions = [{ x: player.x, y: player.y }];
    
    for (let i = 0; i < count; i++) {
        // 使用findValidPosition找到有效位置
        const enemyPos = findValidPosition(enemySize, enemySize, excludePositions);
        
        // 将新位置添加到排除列表，避免敌人之间重叠
        excludePositions.push({ x: enemyPos.x, y: enemyPos.y });
        
        enemies.push({
            x: enemyPos.x,
            y: enemyPos.y,
            width: enemySize,
            height: enemySize,
            speed: 1.5 + Math.random() * 1,
            direction: Math.floor(Math.random() * 4),
            color: '#e74c3c',
            bullets: [],
            canShoot: true,
            shootCooldown: 0,
            moveTimer: 0,
            changeDirectionTimer: Math.random() * 60 + 30
        });
    }
}

// 绘制坦克
function drawTank(tank) {
    ctx.save();
    ctx.translate(tank.x + tank.width / 2, tank.y + tank.height / 2);
    ctx.rotate((tank.direction * Math.PI) / 2);
    
    // 坦克主体
    ctx.fillStyle = tank.color;
    ctx.fillRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
    
    // 坦克炮管
    ctx.fillStyle = '#333';
    ctx.fillRect(-3, -tank.height / 2 - 15, 6, 15);
    
    // 坦克细节
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(-tank.width / 2 + 5, -tank.height / 2 + 5, tank.width - 10, tank.height - 10);
    
    ctx.restore();
}

// 绘制墙壁
function drawWalls() {
    ctx.fillStyle = '#7f8c8d';
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        // 墙壁边框
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 2;
        ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
    });
}

// 检测碰撞
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 检测墙壁碰撞
function checkWallCollision(tank) {
    for (let wall of walls) {
        if (checkCollision(tank, wall)) {
            return true;
        }
    }
    return false;
}

// 移动玩家
function movePlayer() {
    const oldX = player.x;
    const oldY = player.y;
    
    if (keys['w'] || keys['W'] || keys['ArrowUp']) {
        player.direction = 0;
        player.y -= player.speed;
    }
    if (keys['s'] || keys['S'] || keys['ArrowDown']) {
        player.direction = 2;
        player.y += player.speed;
    }
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) {
        player.direction = 3;
        player.x -= player.speed;
    }
    if (keys['d'] || keys['D'] || keys['ArrowRight']) {
        player.direction = 1;
        player.x += player.speed;
    }
    
    // 边界检测
    if (player.x < 20) player.x = 20;
    if (player.x + player.width > canvas.width - 20) player.x = canvas.width - 20 - player.width;
    if (player.y < 20) player.y = 20;
    if (player.y + player.height > canvas.height - 20) player.y = canvas.height - 20 - player.height;
    
    // 墙壁碰撞检测
    if (checkWallCollision(player)) {
        player.x = oldX;
        player.y = oldY;
    }
}

// 移动敌人
function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.moveTimer++;
        enemy.changeDirectionTimer--;
        
        if (enemy.changeDirectionTimer <= 0) {
            enemy.direction = Math.floor(Math.random() * 4);
            enemy.changeDirectionTimer = Math.random() * 60 + 30;
        }
        
        const oldX = enemy.x;
        const oldY = enemy.y;
        
        switch (enemy.direction) {
            case 0: enemy.y -= enemy.speed; break;
            case 1: enemy.x += enemy.speed; break;
            case 2: enemy.y += enemy.speed; break;
            case 3: enemy.x -= enemy.speed; break;
        }
        
        // 边界检测
        if (enemy.x < 20) {
            enemy.x = 20;
            enemy.direction = 1;
        }
        if (enemy.x + enemy.width > canvas.width - 20) {
            enemy.x = canvas.width - 20 - enemy.width;
            enemy.direction = 3;
        }
        if (enemy.y < 20) {
            enemy.y = 20;
            enemy.direction = 2;
        }
        if (enemy.y + enemy.height > canvas.height - 20) {
            enemy.y = canvas.height - 20 - enemy.height;
            enemy.direction = 0;
        }
        
        // 墙壁碰撞检测
        if (checkWallCollision(enemy)) {
            enemy.x = oldX;
            enemy.y = oldY;
            enemy.direction = Math.floor(Math.random() * 4);
        }
    });
}

// 根据目标位置计算方向
function calculateDirection(tank, targetX, targetY) {
    const dx = targetX - (tank.x + tank.width / 2);
    const dy = targetY - (tank.y + tank.height / 2);
    
    // 计算角度，然后转换为4个方向
    if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? 1 : 3; // 右或左
    } else {
        return dy > 0 ? 2 : 0; // 下或上
    }
}

// 发射子弹
function shootBullet(tank, isPlayer = false, direction = null) {
    if (!tank.canShoot) return;
    
    // 如果指定了方向，使用指定方向；否则使用坦克当前方向
    const shootDirection = direction !== null ? direction : tank.direction;
    
    let bulletX = tank.x + tank.width / 2;
    let bulletY = tank.y + tank.height / 2;
    let vx = 0, vy = 0;
    
    switch (shootDirection) {
        case 0: vy = -5; break; // 上
        case 1: vx = 5; break;  // 右
        case 2: vy = 5; break;  // 下
        case 3: vx = -5; break; // 左
    }
    
    const bullet = {
        x: bulletX,
        y: bulletY,
        vx: vx,
        vy: vy,
        width: 6,
        height: 6,
        owner: isPlayer ? 'player' : 'enemy'
    };
    
    if (isPlayer) {
        player.bullets.push(bullet);
        player.canShoot = false;
        player.shootCooldown = 20;
    } else {
        tank.bullets.push(bullet);
        tank.canShoot = false;
        tank.shootCooldown = 60 + Math.random() * 40;
    }
}

// 更新子弹
function updateBullets() {
    // 玩家子弹
    player.bullets = player.bullets.filter(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        
        // 边界检测
        if (bullet.x < 0 || bullet.x > canvas.width || 
            bullet.y < 0 || bullet.y > canvas.height) {
            return false;
        }
        
        // 墙壁碰撞
        for (let wall of walls) {
            if (checkCollision(bullet, wall)) {
                return false;
            }
        }
        
        // 敌人碰撞
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (checkCollision(bullet, enemies[i])) {
                enemies.splice(i, 1);
                gameState.score += 100;
                gameState.enemiesRemaining--;
                updateUI();
                return false;
            }
        }
        
        return true;
    });
    
    // 敌人子弹
    enemies.forEach(enemy => {
        enemy.bullets = enemy.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // 边界检测
            if (bullet.x < 0 || bullet.x > canvas.width || 
                bullet.y < 0 || bullet.y > canvas.height) {
                return false;
            }
            
            // 墙壁碰撞
            for (let wall of walls) {
                if (checkCollision(bullet, wall)) {
                    return false;
                }
            }
            
            // 玩家碰撞
            if (checkCollision(bullet, player)) {
                gameState.lives--;
                updateUI();
                if (gameState.lives <= 0) {
                    endGame(false);
                }
                return false;
            }
            
            return true;
        });
    });
}

// 绘制子弹
function drawBullets() {
    // 玩家子弹
    player.bullets.forEach(bullet => {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
    
    // 敌人子弹
    enemies.forEach(enemy => {
        enemy.bullets.forEach(bullet => {
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#C92A2A';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    });
}

// 敌人AI射击
function enemyShoot() {
    enemies.forEach(enemy => {
        enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0) {
            enemy.canShoot = true;
            
            // 简单的AI：如果玩家在射程内，就射击
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 300 && Math.random() < 0.02) {
                // 确定方向
                if (Math.abs(dx) > Math.abs(dy)) {
                    enemy.direction = dx > 0 ? 1 : 3;
                } else {
                    enemy.direction = dy > 0 ? 2 : 0;
                }
                shootBullet(enemy, false);
            }
        }
    });
}

// 更新UI
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('enemies').textContent = gameState.enemiesRemaining;
}

// 游戏结束
function endGame(won) {
    gameState.gameOver = true;
    const gameOverDiv = document.getElementById('gameOver');
    const gameOverText = document.getElementById('gameOverText');
    const finalScore = document.getElementById('finalScore');
    
    gameOverDiv.classList.remove('hidden');
    gameOverText.textContent = won ? '你赢了！' : '游戏结束';
    gameOverText.style.color = won ? '#27ae60' : '#e74c3c';
    finalScore.textContent = `最终得分: ${gameState.score}`;
}

// 游戏主循环
function gameLoop() {
    if (gameState.gameOver) return;
    
    // 清空画布
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制墙壁
    drawWalls();
    
    // 更新玩家
    if (player.shootCooldown > 0) {
        player.shootCooldown--;
    } else {
        player.canShoot = true;
    }
    
    movePlayer();
    drawTank(player);
    
    // 更新敌人
    moveEnemies();
    enemies.forEach(enemy => {
        if (enemy.shootCooldown > 0) {
            enemy.shootCooldown--;
        } else {
            enemy.canShoot = true;
        }
        drawTank(enemy);
    });
    
    // 敌人AI射击
    enemyShoot();
    
    // 更新和绘制子弹
    updateBullets();
    drawBullets();
    
    // 检查胜利条件
    if (enemies.length === 0 && gameState.enemiesRemaining === 0) {
        endGame(true);
    }
    
    requestAnimationFrame(gameLoop);
}

// 事件监听
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === ' ' && player.canShoot && !gameState.gameOver) {
        e.preventDefault();
        shootBullet(player, true);
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 鼠标点击事件 - 发射子弹
canvas.addEventListener('click', (e) => {
    if (gameState.gameOver || !player.canShoot) return;
    
    // 获取鼠标在canvas上的坐标
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 计算方向并让坦克朝向鼠标
    const direction = calculateDirection(player, mouseX, mouseY);
    player.direction = direction;
    
    // 发射子弹
    shootBullet(player, true, direction);
});

// 重新开始按钮
document.getElementById('restartBtn').addEventListener('click', () => {
    document.getElementById('gameOver').classList.add('hidden');
    initGame();
    gameLoop();
});

// 再玩一次按钮
document.getElementById('playAgainBtn').addEventListener('click', () => {
    document.getElementById('gameOver').classList.add('hidden');
    initGame();
    gameLoop();
});

// 初始化并开始游戏
initGame();
gameLoop();

