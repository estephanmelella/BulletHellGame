class Tutorial extends Phaser.Scene {
  constructor(){
    super('Tutorial');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('dummy', 'assets/tutorial_dummy.png')
    this.load.image('ground', 'assets/new_plat.png');
    this.load.image('star', 'assets/explosion.png');
    this.load.image('win', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/main.png', { frameWidth: 56, frameHeight: 45 });
    this.load.audio('jump', ['assets/Jump.ogg', 'assets/Jump.mp3', 'assets/Jump.m4a']);
    this.load.audio('shot', ['assets/Shot.ogg', 'assets/Shot.mp3', 'assets/Shot.m4a']);
    this.load.audio('hit', ['assets/Player Hit.ogg', 'assets/Player Hit.mp3', 'assets/Player Hit.m4a']);
    this.load.audio('boom', ['assets/Shot Explode.ogg', 'assets/Shot Explode.mp3', 'assets/Shot Explode.m4a']);
    this.load.audio('key', ['assets/Key Get.ogg', 'assets/Key Get.mp3', 'assets/Key Get.m4a']);
    this.load.audio('win', ['assets/Enemy Die.ogg', 'assets/Enemy Die.mp3', 'assets/Enemy Die.m4a']);
    //this.load.audio('tutorial song', ['assets/Tutorial Song.ogg', 'assets/Tutorial Song.mp3', 'assets/Tutorial Song.m4a'])
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
    jumpNoise = game.sound.add('jump');
    bombNoise = game.sound.add('boom');
    hitNoise = game.sound.add('hit');
    keyNoise = game.sound.add('key');
    winNoise = game.sound.add('win');
    shotNoise = game.sound.add('shot');
    //tutorialSong = game.sound.add('tutorial song');
    //tutorialSong.setLoop(true);
    tutorialSong.play();

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
    enemy = this.physics.add.sprite(50 ,100,'dummy');
    enemy.body.allowGravity = false;
    enemy.body.immovable = true;

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC');
    pointer = this.input.activePointer;

    // Bombs
    bombs = this.physics.add.group();
    enemyBombs = this.physics.add.group();

    // The hp
    hp = 100;
    hpText = this.add.text(600, 16, 'HP: ' + hp, { fontSize: '32px', fill: '#000' });

    // Enemy Health
    enemyHealth = 10;
    enemyHealthText = this.add.text(200, 16, 'Enemy Health: ' + enemyHealth, { fontSize: '32px', fill: '#000' });

    //Back Button
    menuButton = this.add.text(16, 16, 'Menu', { fontSize: '20px', fill: '#000' });
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => this.scene.start('MainMenu'));

    //Game Over text
    gameOverText = this.add.text(200,300,'', { fontSize: '72px', fill: '#ff0000' });

    //You Win text
    youWinText = this.add.text(100,300,'', { fontSize: '50px', fill: '#0000ff' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    //this.physics.add.collider(bombs, platforms, bombExplode, null, this);
    this.physics.add.collider(enemyBombs, platforms);
    this.physics.add.collider(bombs, platforms, bombExplode, null, this);
    this.physics.add.collider(player, enemyBombs, playerHitBomb, null, this);
    this.physics.add.collider(enemy, bombs, enemyHitBomb, null, this);

  }

  update(){
    if (gameOver)
    {
      this.physics.pause();
      gameOverText.setText('GAME OVER');
    }

    if (youWin) {
      youWinText.setText("TUTORIAL COMPLETED");
      this.time.addEvent({delay: 5000, callback: () => this.scene.start('MainMenu')});
      this.time.addEvent({delay: 5000, callback: () => youWin = false});

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

    if ((keys.W.isDown || cursors.up.isDown) && player.body.touching.down)
    {
        player.setVelocityY(-330);
        jumpNoise.play();
    }

    if (pointer.isDown && !hasShot){
        shotNoise.play();
        var bomb = bombs.create(player.x, player.y, 'bomb');
        var velocityX = (pointer.x - player.x)*4;
        var velocityY = (pointer.y - player.y)*4;
        bomb.setVelocity(velocityX, velocityY);
        bomb.allowGravity = false;
        hasShot = true;

    }
    if(!pointer.isDown){
      hasShot = false;
    }
  }

  playerAttack(){
    for (var i = 0; i < 1; i++){
      var bomb = bombs.create(player.x, player.y, 'bomb');
      var velocityX = (pointer.x - player.x)*4;
      var velocityY = (pointer.y - player.y)*4;
      bomb.setVelocity(velocityX, velocityY);
      bomb.allowGravity = false;
    }
  }
}
