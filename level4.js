class LevelFour extends Phaser.Scene {
  constructor(){
    super('LevelFour');
  }

  preload() {
    this.load.image('lvl4background', 'assets/lvl4background.png');
    this.load.image('lvl4boss', 'assets/lvl4boss.png')
    this.load.image('lvl4ground', 'assets/platform.png');
    this.load.image('lvl4projectile', 'assets/lvl4bossbullet.png');
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'lvl4background').setScale(2);
    youWin = false;
    hasShot = false;
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    // Ground, ledges, and ceiling
    platforms.create(400, 568, 'lvl4ground').setScale(2).refreshBody();
    platforms.create(400, -75, 'lvl4ground').setScale(2).refreshBody(); //ceiling

    var plat1 = this.physics.add.image(100, 100, 'lvl4ground')
      .setImmovable(true)
      .setAlpha(1)
      .setScale(0.5);
    var plat2 = this.physics.add.image(400, 200, 'lvl4ground')
      .setImmovable(true)
      .setAlpha(1)
      .setScale(0.5);
    var plat3 = this.physics.add.image(700, 100, 'lvl4ground')
      .setImmovable(true)
      .setAlpha(1)
      .setScale(0.5);
    var plat4 = this.physics.add.image(100, 300, 'lvl4ground')
      .setImmovable(true)
      .setAlpha(1)
      .setScale(0.5);
    var plat5 = this.physics.add.image(400, 600, 'lvl4ground')
      .setImmovable(true)
      .setAlpha(1)
      .setScale(0.5);
    var plat6 = this.physics.add.image(700, 300, 'lvl4ground')
      .setImmovable(true)
      .setAlpha(1)
      .setScale(0.5);
    var plat7 = this.physics.add.image(100, 400, 'lvl4ground')
      .setImmovable(true)
      .setAlpha(1)
      .setScale(0.5);
    var plat8 = this.physics.add.image(400, 400, 'lvl4ground')
      .setImmovable(true)
      .setAlpha(1)
      .setScale(0.5);
    var plat9 = this.physics.add.image(700, 400, 'lvl4ground')
      .setImmovable(true)
      .setAlpha(1)
      .setScale(0.5);

    plat1.body.allowGravity = false;
    plat2.body.allowGravity = false;
    plat3.body.allowGravity = false;
    plat4.body.allowGravity = false;
    plat5.body.allowGravity = false;
    plat6.body.allowGravity = false;
    plat7.body.allowGravity = false;
    plat8.body.allowGravity = false;
    plat9.body.allowGravity = false;

    //Storage for safe keeping
    plats = [plat1, plat2, plat3, plat4, plat5, plat6, plat7, plat8, plat9];

    //Music
    lv4Song.play();

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    //Enemy
    enemy = this.physics.add.sprite(750 ,500,'lvl4boss');
    enemy.body.allowGravity = false;
    enemy.body.immovable = true;
    enemyShot = false;
    this.time.addEvent({delay: 5000, callback: () => enemyShot = true});

    // Attacks
    attackList = ["single", "triple", "spread", "cannon"];
    attackNum = 0
    attack = attackList[attackNum];

    // Projectiles
    projectiles = this.physics.add.group();
    cannons = this.physics.add.group();
    enemyBombs = this.physics.add.group();

    // The hp
    hp = 100;
    hpText = this.add.text(600, 16, 'HP: ' + hp, { fontSize: '32px', fill: '#000' });

    // Enemy Health
    enemyHealth = 500;
    enemyHealthText = this.add.text(200, 16, 'Enemy Health: ' + enemyHealth, { fontSize: '32px', fill: '#000' });

    //Tutorial text
    if (!firstSwitch){
      tutorialText = this.add.text(350,550,'Press SPACE to swap weapons', { fontSize: '25px', fill: '#000000' });
    } else {
      tutorialText = this.add.text(350,550,'', { fontSize: '25px', fill: '#000000' });
    }

    //Weapon text
    weaponText = this.add.text(50,550,'Weapon: single', { fontSize: '30px', fill: '#000000' });

    //Back Button
    var menuButton = this.add.text(16, 16, 'Menu', { fontSize: '20px', fill: '#000' });
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => this.scene.start('MainMenu'));

    //Game Over text
    gameOverText = this.add.text(200,300,'', { fontSize: '72px', fill: '#ff0000' });

    //You Win text
    youWinText = this.add.text(100,300,'', { fontSize: '50px', fill: '#0000ff' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, plat1);
    this.physics.add.collider(player, plat2);
    this.physics.add.collider(player, plat3);
    this.physics.add.collider(player, plat4);
    this.physics.add.collider(player, plat5);
    this.physics.add.collider(player, plat6);
    this.physics.add.collider(player, plat7);
    this.physics.add.collider(player, plat8);
    this.physics.add.collider(player, plat9);
    this.physics.add.collider(enemyBombs, platforms, bombExplode, null, this);
    this.physics.add.collider(plat1, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat2, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat3, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat4, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat5, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat6, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat7, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat8, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat9, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(projectiles, platforms, bombExplode, null, this);
    this.physics.add.collider(plat1, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat2, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat3, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat4, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat5, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat6, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat7, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat8, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat9, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(enemy, projectiles, enemyHitBomb, null, this);
    this.physics.add.collider(cannons, platforms, bombExplode, null, this);
    this.physics.add.collider(plat1, cannons, this.movingBombExplode, null, this);
    this.physics.add.collider(plat2, cannons, this.movingBombExplode, null, this);
    this.physics.add.collider(plat3, cannons, this.movingBombExplode, null, this);
    this.physics.add.collider(plat4, cannons, this.movingBombExplode, null, this);
    this.physics.add.collider(plat5, cannons, this.movingBombExplode, null, this);
    this.physics.add.collider(plat6, cannons, this.movingBombExplode, null, this);
    this.physics.add.collider(plat7, cannons, this.movingBombExplode, null, this);
    this.physics.add.collider(plat8, cannons, this.movingBombExplode, null, this);
    this.physics.add.collider(plat9, cannons, this.movingBombExplode, null, this);
    this.physics.add.collider(enemy, cannons, enemyHitCannon, null, this);
    this.physics.add.collider(player, enemyBombs, playerHitBomb, null, this);

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
        this.time.addEvent({delay: 10000, callback: () => lv4Song.stop()});
        this.time.addEvent({delay: 10000, callback: () => this.scene.start('MainMenu')});
        progress = 1;
      }
      gameOver = false;
    }

    if (youWin) {
      youWin = false; //this makes it so it doesn't call this part of the code every frame
      this.time.addEvent({delay:    0, callback: () => youWinText.setText("\t\t\t\t\t\tY")});
      this.time.addEvent({delay:  100, callback: () => youWinText.setText("\t\t\t\t\t\tYO")});
      this.time.addEvent({delay:  200, callback: () => youWinText.setText("\t\t\t\t\t\tYOU")});
      this.time.addEvent({delay:  300, callback: () => youWinText.setText("\t\t\t\t\t\tYOU W")});
      this.time.addEvent({delay:  400, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WI")});
      this.time.addEvent({delay:  500, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN")});
      this.time.addEvent({delay:  600, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN!")});
      this.time.addEvent({delay: 1000, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN! \n\t\tCONGRATULATIONS!")});
      this.time.addEvent({delay: 1500, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN!")});
      this.time.addEvent({delay: 2000, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN! \n\t\tCONGRATULATIONS!")});
      this.time.addEvent({delay: 2500, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN!")});
      this.time.addEvent({delay: 3000, callback: () => youWinText.setText("\t\t\t\t\t\tYOU WIN! \n\t\tCONGRATULATIONS!")});
      this.time.addEvent({delay: 4000, callback: () => lv4Song.stop()});
      this.time.addEvent({delay: 4000, callback: () => this.scene.start('MainMenu')});
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

    // Switching Attacks
    if (keys.SPACE.isDown && !changeAttack){
      switchNoise.play();
      attackNum++;
      attackNum = attackNum%(attackList.length);
      attack = attackList[attackNum];
      changeAttack = true;
      firstSwitch = true;
      weaponText.setText('Weapon: ' + attack);

    }
    if (!keys.SPACE.isDown){
      changeAttack = false;
    }

    if (firstSwitch){
      tutorialText.setText('');
    }

    // Player Attack
    if (pointer.isDown && !hasShot){
      switch (attack){
        case "single":
        singleAttack();
        this.time.addEvent({delay: 150, callback: () => hasShot = false});
        break;
        case "triple":
        for (var i=0; i<3; i++){
          this.time.addEvent({delay: i*100, callback: () => tripleAttack()});
        }
        this.time.addEvent({delay: 400, callback: () => hasShot = false})
        break;
        case "spread":
        for (var i=0; i<15; i++){
          spreadAttack();
        }
        this.time.addEvent({delay: 1000, callback: () => hasShot = false})
        break;
        case "cannon":
        cannonAttack();
        this.time.addEvent({delay: 1500, callback: () => hasShot = false});
        break;
      }
      hasShot = true;
    }

    // Enemy Attack
    if(enemyHealth > 0 && enemyShot){
      enemyShot = false;
      for (var i=0; i<3; i++){
        timedEvent = this.time.delayedCall(i*250, this.enemySprayAttack, [], this);
      }
      if (enemyHealth < 300){
        this.enemyScatterAttack;
      }
      if (enemyHealth < 100){
        for (var i = 0; i < 3; i++){
          timedEvent = this.time.delayedCall(i*100, this.enemyShootAttack, [], this);
        }
      }
      this.enemyToggle(enemy);
    }

    //If player falls through the ground
    if (player.y > 514){
      player.y = 514;
    }

    //Platform Toggles
    this.platformToggle(Phaser.Math.Between(0,100), plats[Phaser.Math.Between(0,8)])

  }

<<<<<<< HEAD
  //Enemy Attacks
  enemyShootAttack(){ // Shoot at the player
    var enemyBomb = enemyBombs.create(enemy.x, enemy.y, 'lvl4projectile');
=======
  //Player Attacks
  singleAttack(){
    shotNoise.play();
    var projectile = projectiles.create(player.x, player.y, 'bullet');
    var velocityX = (pointer.x - player.x)*4;
    var velocityY = (pointer.y - player.y)*4;
    projectile.setVelocity(velocityX, velocityY);
  }

  tripleAttack(){
    shotNoise.play();
    var projectile = projectiles.create(player.x, player.y, 'bullet');
    var velocityX = (pointer.x - player.x)*3;
    var velocityY = (pointer.y - player.y)*3;
    projectile.setVelocity(velocityX, velocityY);
  }

  spreadAttack(){
    cannonNoise.play();
    var bomb = projectiles.create(player.x, player.y, 'bullet');
    var velocityX = ((pointer.x - player.x)*4) + Phaser.Math.Between(-100, 100);
    var velocityY = (pointer.y - player.y)*4 + Phaser.Math.Between(-100, 100);
    bomb.setVelocity(velocityX, velocityY);
  }

  cannonAttack(){
    cannonNoise.play();
    var cannon = cannons.create(player.x, player.y, 'bullet').setScale(2);
    var velocityX = (pointer.x - player.x)*6;
    var velocityY = (pointer.y - player.y)*6;
    cannon.setVelocity(velocityX, velocityY);
  }

  //Enemy Attacks
  enemyShootAttack(){ // Shoot at the player
    var enemyBomb = enemyBombs.create(enemy.x, enemy.y, 'level4projectile');
>>>>>>> 9cb03a3ded94040074613ac5bebc1d4b4974d4f6
    enemyBomb.setCollideWorldBounds(true);
    enemyBomb.setVelocity(Math.min(800,(player.x - enemy.x)*3), Math.min(800,(player.y - enemy.y)*3));
    enemyBomb.allowGravity = true;
  }

  enemyScatterAttack(){ // Scatters a bunch of bombs
    for (var i = 0; i < 10; i++){
<<<<<<< HEAD
      var enemyBomb = enemyBombs.create(enemy.x, enemy.y, 'lvl4projectile');
=======
      var enemyBomb = enemyBombs.create(enemy.x, enemy.y, 'level4projectile');
>>>>>>> 9cb03a3ded94040074613ac5bebc1d4b4974d4f6
      enemyBomb.setBounce(1);
      enemyBomb.setCollideWorldBounds(true);
      enemyBomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      enemyBomb.allowGravity = true;
    }
  }

  enemySprayAttack(){ // Sprays a bunch of bombs
    for (var i = 1; i <= 16; i++){
<<<<<<< HEAD
      var enemyBomb = enemyBombs.create(enemy.x, enemy.y, 'lvl4projectile');
=======
      var enemyBomb = enemyBombs.create(enemy.x, enemy.y, 'level4projectile');
>>>>>>> 9cb03a3ded94040074613ac5bebc1d4b4974d4f6
      enemyBomb.setVelocity(Math.cos(Math.PI * i/6)*500, Math.sin(Math.PI * i/6)*500);
      enemyBomb.allowGravity = true;
    }
  }

  movingBombExplode(platform, bomb){
    bomb.setTexture('explosion');
    bomb.setVelocity(0,0);
    this.time.addEvent({delay: 100, callback: () => bomb.destroy()});
    bombNoise.play();
  }

  platformToggle(odds, plat){
    if (odds < 3){
      if (plat.alpha == 1){
        plat.setAlpha(0.9);
        this.time.addEvent({delay:  100, callback: () => plat.setAlpha(0.8)});
        this.time.addEvent({delay:  200, callback: () => plat.setAlpha(0.7)});
        this.time.addEvent({delay:  300, callback: () => plat.setAlpha(0.6)});
        this.time.addEvent({delay:  400, callback: () => plat.setAlpha(0.5)});
        this.time.addEvent({delay:  500, callback: () => plat.setAlpha(0.4)});
        this.time.addEvent({delay:  600, callback: () => plat.setAlpha(0.3)});
        this.time.addEvent({delay:  700, callback: () => plat.setAlpha(0.2)});
        this.time.addEvent({delay:  800, callback: () => plat.setAlpha(0.1)});
        this.time.addEvent({delay:  900, callback: () => plat.setAlpha(0)});
        this.time.addEvent({delay: 1000, callback: () => plat.body.enable = false});
      } else if (plat.alpha == 0){
        plat.setAlpha(0.1);
        plat.body.enable = true;
        this.time.addEvent({delay:  100, callback: () => plat.setAlpha(0.2)});
        this.time.addEvent({delay:  200, callback: () => plat.setAlpha(0.3)});
        this.time.addEvent({delay:  300, callback: () => plat.setAlpha(0.4)});
        this.time.addEvent({delay:  400, callback: () => plat.setAlpha(0.5)});
        this.time.addEvent({delay:  500, callback: () => plat.setAlpha(0.6)});
        this.time.addEvent({delay:  600, callback: () => plat.setAlpha(0.7)});
        this.time.addEvent({delay:  700, callback: () => plat.setAlpha(0.8)});
        this.time.addEvent({delay:  800, callback: () => plat.setAlpha(0.9)});
        this.time.addEvent({delay:  900, callback: () => plat.setAlpha(1)});
        this.time.addEvent({delay:  100, callback: () => plat.body.enable = true});
        this.time.addEvent({delay:  200, callback: () => plat.body.enable = true});
        this.time.addEvent({delay:  300, callback: () => plat.body.enable = true});
        this.time.addEvent({delay:  400, callback: () => plat.body.enable = true});
        this.time.addEvent({delay:  500, callback: () => plat.body.enable = true});
        this.time.addEvent({delay:  600, callback: () => plat.body.enable = true});
        this.time.addEvent({delay:  700, callback: () => plat.body.enable = true});
        this.time.addEvent({delay:  800, callback: () => plat.body.enable = true});
        this.time.addEvent({delay:  900, callback: () => plat.body.enable = true});
      }
    }
  }

  enemyToggle(enemy){
    enemy.setAlpha(0.9);
    this.time.addEvent({delay:  100, callback: () => enemy.setAlpha(0.8)});
    this.time.addEvent({delay:  200, callback: () => enemy.setAlpha(0.7)});
    this.time.addEvent({delay:  300, callback: () => enemy.setAlpha(0.6)});
    this.time.addEvent({delay:  400, callback: () => enemy.setAlpha(0.5)});
    this.time.addEvent({delay:  500, callback: () => enemy.setAlpha(0.4)});
    this.time.addEvent({delay:  600, callback: () => enemy.setAlpha(0.3)});
    this.time.addEvent({delay:  700, callback: () => enemy.setAlpha(0.2)});
    this.time.addEvent({delay:  800, callback: () => enemy.setAlpha(0.1)});
    this.time.addEvent({delay:  900, callback: () => enemy.setAlpha(0)});
    this.time.addEvent({delay: 1000, callback: () => enemy.setPosition(Phaser.Math.Between(50,750), enemyHealth - (enemyHealth/10))});
    this.time.addEvent({delay: 3000, callback: () => enemy.setAlpha(0.1)});
    this.time.addEvent({delay: 3100, callback: () => enemy.setAlpha(0.2)});
    this.time.addEvent({delay: 3200, callback: () => enemy.setAlpha(0.3)});
    this.time.addEvent({delay: 3300, callback: () => enemy.setAlpha(0.4)});
    this.time.addEvent({delay: 3400, callback: () => enemy.setAlpha(0.5)});
    this.time.addEvent({delay: 3500, callback: () => enemy.setAlpha(0.6)});
    this.time.addEvent({delay: 3600, callback: () => enemy.setAlpha(0.7)});
    this.time.addEvent({delay: 3700, callback: () => enemy.setAlpha(0.8)});
    this.time.addEvent({delay: 3800, callback: () => enemy.setAlpha(0.9)});
    this.time.addEvent({delay: 3900, callback: () => enemy.setAlpha(1)});
    this.time.addEvent({delay: 4000, callback: () => enemyShot = true});
  }

}
