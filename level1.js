class LevelOne extends Phaser.Scene {
  constructor(){
    super('LevelOne');
  }

  preload() {
    this.load.image('lvl1background_bigger', 'assets/lvl1background_bigger.png');
    this.load.image('boss', 'assets/boss.png')
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/main.png', { frameWidth: 56, frameHeight: 45 });
    this.load.audio('jump', ['assets/Jump.ogg', 'assets/Jump.mp3', 'assets/Jump.m4a']);
    this.load.audio('shot', ['assets/Shot.ogg', 'assets/Shot.mp3', 'assets/Shot.m4a']);
    this.load.audio('hit', ['assets/Player Hit.ogg', 'assets/Player Hit.mp3', 'assets/Player Hit.m4a']);
    this.load.audio('boom', ['assets/Shot Explode.ogg', 'assets/Shot Explode.mp3', 'assets/Shot Explode.m4a']);
    this.load.audio('key', ['assets/Key Get.ogg', 'assets/Key Get.mp3', 'assets/Key Get.m4a']);
    this.load.audio('win', ['assets/Enemy Die.ogg', 'assets/Enemy Die.mp3', 'assets/Enemy Die.m4a']);
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'lvl1background_bigger');
    youWin = false;
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    // Ground, ledges, and ceiling
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(400, 400, 'ground');
    platforms.create(200, 250, 'ground').setScale(0.5).refreshBody();
    platforms.create(600, 250, 'ground').setScale(0.5).refreshBody();
    platforms.create(400, -75, 'ground').setScale(2).refreshBody(); //ceiling
    jumpNoise = game.sound.add('jump');
    bombNoise = game.sound.add('boom');
    hitNoise = game.sound.add('hit');
    keyNoise = game.sound.add('key');
    winNoise = game.sound.add('win');
    shotNoise = game.sound.add('shot');

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
    enemy = this.physics.add.sprite(750 ,500,'boss');
    enemy.body.allowGravity = false;
    enemy.body.immovable = true;
    enemyShot = false;
    this.time.addEvent({delay: 5000, callback: () => enemyShot = true});

    //Enemy's movement around the screen
    this.tweens.timeline({
    targets: enemy.body.velocity,
    loop: -1,
    tweens: [
      { x:    0, y:  -90, duration: 5000, ease: 'Stepped' },
      //{ x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      { x: -140, y:    0, duration: 5000, ease: 'Stepped' },
      //{ x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      { x:    0, y:   90, duration: 5000, ease: 'Stepped' },
      //{ x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      { x:    0, y:  -90, duration: 5000, ease: 'Stepped' },
    //  { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      { x:  140, y:    0, duration: 5000, ease: 'Stepped' },
    //  { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      { x:    0, y:   90, duration: 5000, ease: 'Stepped' },
      //{ x:    0, y:    0, duration: 1000, ease: 'Stepped' }
    ]
  });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC');
    pointer = this.input.activePointer;

    // projectiles
    projectiles = this.physics.add.group();
    enemyBombs = this.physics.add.group();

    // The hp
    hp = 100;
    hpText = this.add.text(600, 16, 'HP: ' + hp, { fontSize: '32px', fill: '#fff' });

    // Enemy Health
    enemyHealth = 100;
    enemyHealthText = this.add.text(200, 16, 'Enemy Health: ' + enemyHealth, { fontSize: '32px', fill: '#fff' });

    //Back Button
    menuButton = this.add.text(16, 16, 'Menu', { fontSize: '20px', fill: '#fff' });
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => this.scene.start('MainMenu'));

    //Game Over text
    gameOverText = this.add.text(200,300,'', { fontSize: '72px', fill: '#ff0000' });

    //You Win text
    youWinText = this.add.text(100,300,'', { fontSize: '50px', fill: '#0000ff' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemyBombs, platforms, bombExplode, null, this);
    this.physics.add.collider(projectiles, platforms, bombExplode, null, this);
    this.physics.add.collider(player, enemyBombs, playerHitBomb, null, this);
    this.physics.add.collider(enemy, projectiles, enemyHitBomb, null, this);

  }

  update(){
    if (gameOver)
    {
      if (!youWin){ //If you got killed before winning
        this.physics.pause();
        gameOverText.setText('GAME OVER');
        this.time.addEvent({
          delay: 5000, callback: () => this.scene.start('MainMenu')
        });
        progress = 1;
      }
      gameOver = false;
    }

    if (youWin) {
      youWinText.setText('YOU WIN! ONTO LVL 2');
      if (progress === 1){
        progress = 2;
      }
      this.time.addEvent({delay: 5000, callback: () => this.scene.start('LevelTwo')});
      this.time.addEvent({delay: 5000, callback: () => youWin = false});

    }
    if(enemyHealth > 0 && enemyShot == true){
      enemyShot = false;
      for (var i = 0; i < 3; i++){
        timedEvent = this.time.delayedCall(i*100, this.enemyAttack, [], this);
      }
      this.time.addEvent({delay: 4000, callback: () => enemyShot = true});
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
        jumpNoise.play();
    }

    if (pointer.isDown && !hasShot){
        shotNoise.play();
        var projectile = projectiles.create(player.x, player.y, 'bomb');
        var velocityX = (pointer.x - player.x)*4;
        var velocityY = (pointer.y - player.y)*4;
        projectile.setVelocity(velocityX, velocityY);
        projectile.allowGravity = false;
        hasShot = true;

    }
    if(!pointer.isDown){
      hasShot = false;
    }
  }

  playerAttack(){
    for (var i = 0; i < 1; i++){
      var projectile = projectiles.create(player.x, player.y, 'bomb');
      var velocityX = (pointer.x - player.x)*4;
      var velocityY = (pointer.y - player.y)*4;
      projectile.setVelocity(velocityX, velocityY);
      projectile.allowGravity = false;
    }
  }
  enemyAttack(){ // Shoot at the player
    var enemyBomb = enemyBombs.create(enemy.x, enemy.y, 'bomb');
    enemyBomb.setCollideWorldBounds(true);
    enemyBomb.setVelocity((player.x - enemy.x)*2, (player.y - enemy.y)*2);
    enemyBomb.allowGravity = true;
  }

}
