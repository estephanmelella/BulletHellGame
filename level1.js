class LevelOne extends Phaser.Scene {
  constructor(){
    super('LevelOne');
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

    // Ground, ledges, and ceiling
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    platforms.create(400, -75, 'ground').setScale(2).refreshBody(); //ceiling

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties
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

    //Enemy's movement around the screen
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
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('W,A,S,D,SPACE');
    pointer = this.input.activePointer;

    // Attack
    attack = "single";

    // Bombs
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
    this.physics.add.collider(player, bombs, playerHitBomb, null, this);
    this.physics.add.collider(enemy, bombs, enemyHitBomb, null, this);

    // Enemy Attack
    function enemyAttack(){ // Scatters a bunch of bombs
      console.log("Starting Enemy Attack...");
      for (var i = 0; i < 10; i++){
        var bomb = bombs.create(enemy.x, enemy.y, 'bomb');
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = true;
      }
    }

    // // Loop attack every 3 seconds
    // timer = this.time.addEvent({
    //   delay: 3000,
    //   callback: enemyAttack(),
    //   callbackScope: this,
    //   loop: true
    // });
  }

  update(){
    if (gameOver)
    {
      gameOverText.setText('GAME OVER');
    }

    if (youWin) {
      youWinText.setText('YOU WIN! ONTO LVL 2');

      this.time.addEvent({
        delay: 2000, callback: () => this.scene.start('LevelTwo')
      });

    }

    if (keys.A.isDown || cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (keys.D.isDown || cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else if (keys.S.isDown || cursors.down.isDown)
    {
      player.setVelocityY(300);
      player.setVelocityX(0);

      player.anims.play('turn');

    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if ((keys.W.isDown || keys.SPACE.isDown || cursors.up.isDown) && player.body.touching.down)
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

    // // Enemy attacks every 3 seconds
    // seconds = date.getTime();
    // if (seconds%3000 === 0){enemyAttack();}
  }
}
