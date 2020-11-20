class LevelOne extends Phaser.Scene {
  constructor(){
    super('LevelOne');
  }

  preload() {
    this.load.image('lvl1boss', 'assets/boss.png')
    this.load.image('lvl1ground', 'assets/moonrock.png');
    this.load.image('lvl1projectile', 'assets/bossbullet.png');
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'lvl1background');
    youWin = false;
    hasShot = false;
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    // Ground, ledges, and ceiling
    platforms.create(400, 568, 'lvl1ground').setScale(2).refreshBody();
    platforms.create(400, -75, 'lvl1ground').setScale(2).refreshBody(); //ceiling

    var plat1 = this.physics.add.image(200, 200, 'lvl1ground')
      .setImmovable(true)
      .setFrictionX(100)
      .setScale(0.5);
    var plat2 = this.physics.add.image(600, 200, 'lvl1ground')
      .setImmovable(true)
      .setFrictionX(100)
      .setScale(0.5);
    var plat3 = this.physics.add.image(200, 400, 'lvl1ground')
      .setImmovable(true)
      .setFrictionX(100)
      .setScale(0.5);
    var plat4 = this.physics.add.image(600, 400, 'lvl1ground')
      .setImmovable(true)
      .setFrictionX(100)
      .setScale(0.5);
    var plat5 = this.physics.add.image(400, 300, 'lvl1ground')
      .setImmovable(true)
      .setFrictionX(100)
      .setScale(0.5);

      plat1.body.allowGravity = false;
      plat2.body.allowGravity = false;
      plat3.body.allowGravity = false;
      plat4.body.allowGravity = false;
      plat5.body.allowGravity = false;

    //Music
    lv1Song.play();

    // The player
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    //Enemy
    enemy = this.physics.add.sprite(750 ,500,'lvl1boss');
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
      { x: -140, y:    0, duration: 5000, ease: 'Stepped' },
      { x:    0, y:   90, duration: 5000, ease: 'Stepped' },
      { x:    0, y:  -90, duration: 5000, ease: 'Stepped' },
      { x:  140, y:    0, duration: 5000, ease: 'Stepped' },
      { x:    0, y:   90, duration: 5000, ease: 'Stepped' },
    ]
  });

    // projectiles
    projectiles = this.physics.add.group();
    enemyBombs = this.physics.add.group();

    // The hp
    hp = 10;
    hpText = this.add.text(600, 16, 'HP: ' + hp, { fontSize: '32px', fill: '#fff' });

    // Enemy Health
    enemyHealth = 100;
    enemyHealthText = this.add.text(200, 16, 'Enemy Health: ' + enemyHealth, { fontSize: '32px', fill: '#fff' });

    //Weapon text
    weaponText = this.add.text(50,550,'Weapon: single', { fontSize: '30px', fill: '#000000' });

    //Back Button
    var menuButton = this.add.text(16, 16, 'Menu', { fontSize: '20px', fill: '#fff' });
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => this.scene.start('MainMenu'));

    //Game Over text
    gameOverText = this.add.text(200,300,'', { fontSize: '72px', fill: '#ff0000' });

    //You Win text
    youWinText = this.add.text(100,300,'', { fontSize: '50px', fill: '#0000ff' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, plat1, platformBreak, null, this);
    this.physics.add.collider(player, plat2, platformBreak, null, this);
    this.physics.add.collider(player, plat3, platformBreak, null, this);
    this.physics.add.collider(player, plat4, platformBreak, null, this);
    this.physics.add.collider(player, plat5, platformBreak, null, this);
    this.physics.add.collider(enemyBombs, platforms, bombExplode, null, this);
    this.physics.add.collider(plat1, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat2, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat3, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat4, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat5, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(projectiles, platforms, bombExplode, null, this);
    this.physics.add.collider(plat1, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat2, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat3, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat4, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(player, enemyBombs, playerHitBomb, null, this);
    this.physics.add.collider(enemy, projectiles, enemyHitBomb, null, this);

  }

  update(){
    if (gameOver){
      if (!youWin){ //If you got killed after killing the boss
        this.physics.pause();
        this.time.addEvent({delay: 1000, callback: () => gameOverText.setText("G")});
        this.time.addEvent({delay: 1250, callback: () => gameOverText.setText("GA")});
        this.time.addEvent({delay: 1500, callback: () => gameOverText.setText("GAM")});
        this.time.addEvent({delay: 1750, callback: () => gameOverText.setText("GAME")});
        this.time.addEvent({delay: 2500, callback: () => gameOverText.setText("GAME O")});
        this.time.addEvent({delay: 2750, callback: () => gameOverText.setText("GAME OV")});
        this.time.addEvent({delay: 3000, callback: () => gameOverText.setText("GAME OVE")});
        this.time.addEvent({delay: 3250, callback: () => gameOverText.setText("GAME OVER")});
        this.time.addEvent({delay: 10000, callback: () => lv1Song.stop()});
        this.time.addEvent({delay: 10000, callback: () => this.scene.start('MainMenu')});
        progress = 1;
      }
      gameOver = false;
    }

    if (youWin) {
      progress = 2;
      youWin = false; //this makes it so it doesn't call this part of the code every frame
      this.time.addEvent({delay:    0, callback: () => youWinText.setText("\t\t\t\t\t\tY")});
      this.time.addEvent({delay:  100, callback: () => youWinText.setText("\t\t\t\t\t\tYO")});
      this.time.addEvent({delay:  200, callback: () => youWinText.setText("\t\t\t\t\t\tYOU")});
      this.time.addEvent({delay:  300, callback: () => youWinText.setText("\t\t\t\t\t\tYOU W")});
      this.time.addEvent({delay:  400, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WI")});
      this.time.addEvent({delay:  500, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN")});
      this.time.addEvent({delay:  600, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN!")});
      this.time.addEvent({delay: 1000, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN! \nNEW WEAPON UNLOCKED!")});
      this.time.addEvent({delay: 1500, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN!")});
      this.time.addEvent({delay: 2000, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN! \nNEW WEAPON UNLOCKED!")});
      this.time.addEvent({delay: 2500, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN!")});
      this.time.addEvent({delay: 3000, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN! \nNEW WEAPON UNLOCKED!")});
      this.time.addEvent({delay: 4000, callback: () => lv1Song.stop()});
      this.time.addEvent({delay: 4000, callback: () => this.scene.start('LevelTwoIntro')});
    }

    // Movement
    if (keys.A.isDown || cursors.left.isDown){
        player.setVelocityX(-160);

        player.anims.play('left', true);
    } else if (keys.D.isDown || cursors.right.isDown){
        player.setVelocityX(160);

        player.anims.play('right', true);
    } else if (keys.S.isDown || cursors.down.isDown){
      player.setVelocityY(300);
      player.setVelocityX(0);

      player.anims.play('turn');
    } else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }
    if ((keys.W.isDown || cursors.up.isDown) && player.body.touching.down){
        player.setVelocityY(-400);
        jumpNoise.play();
    }

    // Player Attack
    if (pointer.isDown && !hasShot){
      singleAttack();
      this.time.addEvent({delay: 150, callback: () => hasShot = false});
      hasShot = true;
    }

    // Enemy Attack
    if(enemyHealth > 0 && enemyShot == true){
      enemyShot = false;
      for (var i = 0; i < 3; i++){
        timedEvent = this.time.delayedCall(i*100, this.enemyShootAttack, [], this);
      }
      this.time.addEvent({delay: 3000, callback: () => enemyShot = true});
    }

    //If player falls through the ground
    if (player.y > 514){
      player.y = 514;
    }
  }

  //Enemy Attacks
  enemyShootAttack(){ // Shoot at the player
    var enemyBomb = enemyBombs.create(enemy.x, enemy.y, 'lvl1projectile');
    enemyBomb.setCollideWorldBounds(true);
    enemyBomb.setVelocity(Math.min(800,(player.x - enemy.x)*2), Math.min(800,(player.y - enemy.y)*2));
    enemyBomb.allowGravity = true;
  }

  movingBombExplode(platform, bomb){
    bomb.setTexture('explosion');
    bomb.setVelocity(0,0);
    this.time.addEvent({delay: 100, callback: () => bomb.destroy()});
    bombNoise.play();
  }

}
