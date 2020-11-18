class Tutorial extends Phaser.Scene {
  constructor(){
    super('Tutorial');
  }

  preload() {
    this.load.image('dummy', 'assets/tutorial_dummy.png')
    this.load.image('ground', 'assets/new_plat.png');
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');
    hasShot = false;

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    // Ground, ledges, and ceiling
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 450, 'ground');
    platforms.create(100, 300, 'ground');
    platforms.create(700, 220, 'ground');
    platforms.create(400, -75, 'ground').setScale(2).refreshBody(); //ceiling
    tutorialSong.play();

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    //Enemy
    enemy = this.physics.add.sprite(50 ,100,'dummy');
    enemy.body.allowGravity = false;
    enemy.body.immovable = true;

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
    var menuButton = this.add.text(16, 16, 'Menu', { fontSize: '20px', fill: '#000' });
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => this.scene.start('MainMenu'));

    //Game Over text
    gameOverText = this.add.text(200,300,'', { fontSize: '72px', fill: '#ff0000' });

    //You Win text
    youWinText = this.add.text(100,350,'', { fontSize: '50px', fill: '#0000ff' });

    //Tutorial text
    tutorialText = this.add.text(400,550,'Use WASD to move', { fontSize: '30px', fill: '#000000' });
    var moved = false;
    var firstShot = false;

    //Weapon text
    weaponText = this.add.text(50,550,'Weapon: single', { fontSize: '30px', fill: '#000000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemyBombs, platforms);
    this.physics.add.collider(bombs, platforms, bombExplode, null, this);
    this.physics.add.collider(player, enemyBombs, playerHitBomb, null, this);
    this.physics.add.collider(enemy, bombs, enemyHitBomb, null, this);

  }

  update(){
    if (youWin) {
      youWinText.setText("TUTORIAL COMPLETED");
      this.time.addEvent({delay: 5000, callback: () => this.scene.start('MainMenu')});
      this.time.addEvent({delay: 5000, callback: () => youWin = false});

    }
    if (keys.A.isDown || cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
        moved = true;
    }
    else if (keys.D.isDown || cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
        moved = true;
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
        player.setVelocityY(-400);
        jumpNoise.play();
        moved = true;
    }

    if (pointer.isDown && !hasShot){
        shotNoise.play();
        var bomb = bombs.create(player.x, player.y, 'bomb');
        var velocityX = (pointer.x - player.x)*4;
        var velocityY = (pointer.y - player.y)*4;
        bomb.setVelocity(velocityX, velocityY);
        bomb.allowGravity = false;
        hasShot = true;
        this.time.addEvent({delay: 150, callback: () => hasShot = false});

        firstShot = true;
    }

    if (moved){
      if (!firstShot){
        tutorialText.setText('Click to shoot');
      } else {
        tutorialText.setText('Hold to rapid fire');
      }
    }
  }

}
