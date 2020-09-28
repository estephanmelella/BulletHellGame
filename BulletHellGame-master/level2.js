class LevelTwo extends Phaser.Scene {
  constructor(){
    super('LevelTwo');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    platforms.create(400, -75, 'ground').setScale(2).refreshBody(); //ceiling

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //Enemy
    enemy = this.physics.add.sprite(800,500,'platform');
    enemy.body.allowGravity = false;
    enemy.body.immovable = true;

    this.tweens.timeline({
    targets: enemy.body.velocity,
    loop: -1,
    tweens: [
      { x:    0, y: -100, duration: 5000, ease: 'Stepped' },
      { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      { x: -160, y:    0, duration: 5000, ease: 'Stepped' },
      { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      { x:    0, y:  100, duration: 5000, ease: 'Stepped' },
      { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      { x:    0, y: -100, duration: 5000, ease: 'Stepped' },
      { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      { x:  160, y:    0, duration: 5000, ease: 'Stepped' },
      { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      { x:    0, y:  100, duration: 5000, ease: 'Stepped' },
      { x:    0, y:    0, duration: 1000, ease: 'Stepped' }
    ]
  });

    //  Input Events
    keys = this.input.keyboard.addKeys('W,A,S,D,SPACE');
    pointer = this.input.activePointer;

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    // stars = this.physics.add.group({
    //     key: 'star',
    //     repeat: 9,
    //     setXY: { x: 12, y: 0, stepX: 80 }
    // });
    //
    // stars.children.iterate(function (child) {
    //
    //     //  Give each star a slightly different bounce
    //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    //
    // });

    attack = "single";

    bombs = this.physics.add.group();

    // The hp
    hp = 300;
    hpText = this.add.text(600, 16, 'HP: ' + hp, { fontSize: '32px', fill: '#000' });

    // Enemy Health
    enemyHealth = 1000;
    enemyHealthText = this.add.text(16, 16, 'Enemy Health: ' + enemyHealth, { fontSize: '32px', fill: '#000' });

    //Game Over text
    gameOverText = this.add.text(200,300,'', { fontSize: '72px', fill: '#ff0000' });

    //You Win text
    youWinText = this.add.text(100,300,'', { fontSize: '50px', fill: '#0000ff' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(bombs, platforms, bombExplode, null, this);
    this.physics.add.collider(player, levelKey, collectKey, null, this);


    this.physics.add.collider(player, bombs, playerHitBomb, null, this);
    this.physics.add.collider(enemy, bombs, enemyHitBomb, null, this);
  }

  update(){
    if (gameOver)
    {
      gameOverText.setText('GAME OVER');
    }

    if (youWin) {
      youWinText.setText('YOU WIN! ONTO LVL 2');


    }

    if (keys.A.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (keys.D.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else if (keys.S.isDown){
      player.setVelocityY(300);
      player.setVelocityX(0);

      player.anims.play('turn');

    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (keys.W.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }

    if (pointer.isDown && attack === "single"){
      var bomb = bombs.create(player.x, player.y, 'bomb');
      var velocityX = (pointer.x - player.x)*5;
      var velocityY = (pointer.y - player.y)*5;
      bomb.setVelocity(velocityX, velocityY);
      bomb.allowGravity = false;

    }
  }
}
