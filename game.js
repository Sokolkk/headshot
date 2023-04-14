var config = {
    type: Phaser.AUTO,
    width: 1236,
    height: 670,
    title: 'headshot',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var player;
var cursors;
var bullets;
var lives;
var enemies;
var gameOver = false;
var livesText;
function preload() {
    // загрузка изображения для фона
    this.load.image('background', 'assets/backgr/l1.png');
    this.load.image('player', 'assets/char/man.png');
    this.load.image('bullet', 'assets/enemy/head_0.png');
    this.load.image('enemy', 'assets/char/man.png');

}


function create() {
    // добавление фона
    var background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    
    this.physics.world.setBounds(0, 0, 768, 670);
    //жизни
    lives = 3;
    livesText = this.add.text(16, 16, 'Lives: ' + lives, { fontSize: '32px', fill: '#FFF' });
    //текст про управление 
    var controlText = this.add.text(1213, 538, 'Маштаб экрана: ctrl-\n Управление: <- -> \nВыстрел на Пробел', { fontSize: '32px', fill: '#FFF' });
    controlText.setOrigin(1, 0);
    // добавление игрока
    player = this.physics.add.sprite(400, 550, 'player').setScale(0.2);
    player.body.collideWorldBounds = true; // Игрок не может выходить за границы экрана

    // добавление стрелкового объекта
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 11000000
    });

    // добавление врагов
    enemies = this.physics.add.group({
        defaultKey: 'enemy',
        maxSize: 10000000
    });

    // добавление управления с клавиатуры
    cursors = this.input.keyboard.createCursorKeys();

    // добавление столкновения игрока и врагов
    this.physics.add.overlap(player, enemies, gameOverHandler, null, this);


    // добавление столкновения пуль и врагов
    this.physics.add.overlap(bullets, enemies, bulletHitEnemy, null, this);
}


function update() {
    // движение игрока
    if (cursors.left.isDown) {
        player.setVelocityX(-400);
    } else if (cursors.right.isDown) {
        player.setVelocityX(400);
    } else {
        player.setVelocityX(0);
    }

    // стрельба пулями
    if (cursors.space.isDown) {
        fireBullet();
    }
    livesText.setText('Lives: ' + lives);
    // генерация врагов
    if (Math.random() < 0.01) {
        spawnEnemy();
    }
        // Проверяем каждую активную пулю
        bullets.getChildren().forEach(function(bullet) {
            // Удаляем пулю, если она ушла за верхний край экрана
            if (bullet.active && bullet.y > game.config.height) {
                bullet.destroy();
            }
        });
    
        
             // Проверяем каждого активного врага
        enemies.getChildren().forEach(function(enemy) {
            // Удаляем врага, если он ушел за нижний край экрана
            if (enemy.active && enemy.y > game.config.height) {
                enemy.destroy(); 
                lives --;

            }
        });
}
// функция выстрела
function fireBullet() {
    var bullet = bullets.get(player.x, player.y - 50).setScale(0.2);
    if (bullet) {
        bullet.setActive(true).setVisible(true);
        bullet.setVelocityY(-600);
    }
}

// функция генерации врагов
function spawnEnemy() {
    var enemy = enemies.get(Phaser.Math.Between(50, 750), 0);
    if (enemy) {
        enemy.setActive(true).setVisible(true).setScale(0.2);
        ;
        enemy.setVelocityY(Phaser.Math.Between(100, 300));

    }
}

// функция столкновения пули и врага
function bulletHitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    score=0;
    score += 10;
    }
// функция столкновения игрока и врага
function gameOverHandler(player, enemy) {
    enemy.destroy();
    lives --;
    gameOver = true;
}
