class LevelOneIntro extends Phaser.Scene {
  constructor(){
    super('LevelOneIntro');
  }

  preload() {
    this.load.image('lvl1background_bigger', 'assets/lvl1background_bigger.png');
    this.load.image('lvl1ground', 'assets/moonrock.png');
    this.load.image('lvl1ground_breaking', 'assets/cracked_moonrock.png');
    this.load.image('lvl1ground_broken', 'assets/broken_moonrock.png');
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'lvl1background_bigger');
    youWin = false;
    hasShot = false;

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    // Ground, ledges, and ceiling
    platforms.create(400, 568, 'lvl1ground').setScale(2).refreshBody();
    platforms.create(400, -75, 'lvl1ground').setScale(2).refreshBody(); //ceiling

    var plat1 = this.physics.add.image(550, 400, 'lvl1ground')
      .setImmovable(true)
      .setFrictionX(100)
      .setScale(0.5);
    var plat2 = this.physics.add.image(400, 250, 'lvl1ground')
      .setImmovable(true)
      .setFrictionX(100)
      .setScale(0.5);
    var plat3 = this.physics.add.image(100, 100, 'lvl1ground')
      .setImmovable(true)
      .setFrictionX(100)
      .setScale(0.5);
    var plat4 = this.physics.add.image(700, 100, 'lvl1ground')
      .setImmovable(true)
      .setFrictionX(100)
      .setScale(0.5);

      plat1.body.allowGravity = false;
      plat2.body.allowGravity = false;
      plat3.body.allowGravity = false;
      plat4.body.allowGravity = false;

    // Music
    lv1ISong.play();

    // The player
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    // projectiles
    projectiles = this.physics.add.group();

    //Weapon text
    weaponText = this.add.text(50,550,'Weapon: single', { fontSize: '30px', fill: '#000000' });

    //Back Button
    var menuButton = this.add.text(16, 16, 'Menu', { fontSize: '20px', fill: '#fff' });
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => this.scene.start('MainMenu'));

    //Level Door
    levelDoor = this.physics.add.sprite(100, 40, 'door');
    this.physics.add.collider(platforms, levelDoor);
    this.physics.add.collider(plat1, levelDoor);
    this.physics.add.collider(plat2, levelDoor);
    this.physics.add.collider(plat3, levelDoor);
    this.physics.add.collider(plat4, levelDoor);
    this.physics.add.collider(player, levelDoor, enterDoor, null, this);

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, plat1, platformBreak, null, this);
    this.physics.add.collider(player, plat2, platformBreak, null, this);
    this.physics.add.collider(player, plat3, platformBreak, null, this);
    this.physics.add.collider(player, plat4, platformBreak, null, this);
    this.physics.add.collider(projectiles, platforms, bombExplode, null, this);
    this.physics.add.collider(plat1, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat2, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat3, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat4, projectiles, this.movingBombExplode, null, this);

  }

  update(){
    // Win Condition
    if (youWin){
      lv1ISong.stop();
      this.scene.start('LevelOne');
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
  }

  movingBombExplode(platform, bomb){
    bomb.setTexture('explosion');
    bomb.setVelocity(0,0);
    this.time.addEvent({delay: 100, callback: () => bomb.destroy()});
    bombNoise.play();
  }

}
