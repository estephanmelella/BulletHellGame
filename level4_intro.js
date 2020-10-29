class LevelFourIntro extends Phaser.Scene {
  constructor(){
    super('LevelFourIntro');
  }

  preload() {
    this.load.image('lvl4background', 'assets/sky.png');
    this.load.image('lvl4ground', 'assets/platform.png');
    this.load.image('explosion', 'assets/explosion.png');
    this.load.image('door', 'assets/door.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('lvl4projectile', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/main.png', { frameWidth: 56, frameHeight: 45 });

    this.load.audio('jump', ['assets/Jump.ogg', 'assets/Jump.mp3', 'assets/Jump.m4a']);
    this.load.audio('shot', ['assets/Shot.ogg', 'assets/Shot.mp3', 'assets/Shot.m4a']);
    this.load.audio('hit', ['assets/Player Hit.ogg', 'assets/Player Hit.mp3', 'assets/Player Hit.m4a']);
    this.load.audio('boom', ['assets/Shot Explode.ogg', 'assets/Shot Explode.mp3', 'assets/Shot Explode.m4a']);
    this.load.audio('key', ['assets/Key Get.ogg', 'assets/Key Get.mp3', 'assets/Key Get.m4a']);
    this.load.audio('win', ['assets/Enemy Die.ogg', 'assets/Enemy Die.mp3', 'assets/Enemy Die.m4a']);
    this.load.audio('switch', ['assets/Weapon Change.ogg', 'assets/Weapon Change.mp3', 'assets/Weapon Change.m4a']);
  	this.load.audio('cannon', ['assets/Cannon.ogg', 'assets/Cannon.mp3', 'assets/Cannon.m4a']);
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'lvl4background');
    youWin = false;
    hasShot = false;
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    // Ground, ledges, and ceiling
    platforms.create(400, 568, 'lvl4ground').setScale(2).refreshBody();
    platforms.create(400, -75, 'lvl4ground').setScale(2).refreshBody(); //ceiling
    platforms.create(700, 100, 'lvl4ground').setScale(0.5).refreshBody(); //ceiling

    var plat1 = this.physics.add.image(100, 175, 'lvl4ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat2 = this.physics.add.image(400, 175, 'lvl4ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat3 = this.physics.add.image(700, 175, 'lvl4ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat4 = this.physics.add.image(100, 300, 'lvl4ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat5 = this.physics.add.image(400, 300, 'lvl4ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat6 = this.physics.add.image(700, 300, 'lvl4ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat7 = this.physics.add.image(100, 450, 'lvl4ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat8 = this.physics.add.image(400, 450, 'lvl4ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat9 = this.physics.add.image(700, 450, 'lvl4ground')
      .setImmovable(true)
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

    //Sounds
    jumpNoise = game.sound.add('jump', {volume: .25});
    bombNoise = game.sound.add('boom', {volume: .25});
    hitNoise = game.sound.add('hit', {volume: .25});
    keyNoise = game.sound.add('key', {volume: .25});
    winNoise = game.sound.add('win', {volume: .25});
    shotNoise = game.sound.add('shot', {volume: .25});
    switchNoise = game.sound.add('switch', {volume: .25});
    cannonNoise = game.sound.add('cannon', {volume: .25});

    // The player and its settings
    player = this.physics.add.sprite(100, 500, 'dude');

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

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC');
    pointer = this.input.activePointer;

    // Attacks
    attackList = ["single", "triple", "spread", "cannon"];
    attackNum = 0
    attack = attackList[attackNum];

    // Projectiles
    projectiles = this.physics.add.group();
    cannons = this.physics.add.group();
    enemyBombs = this.physics.add.group();

    //Back Button
    var menuButton = this.add.text(16, 16, 'Menu', { fontSize: '20px', fill: '#000' });
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => this.scene.start('MainMenu'));

    //Level Door
    levelDoor = this.physics.add.sprite(700, 50, 'door');
    this.physics.add.collider(platforms, levelDoor);
    this.physics.add.collider(plat1, levelDoor);
    this.physics.add.collider(plat2, levelDoor);
    this.physics.add.collider(plat3, levelDoor);
    this.physics.add.collider(plat4, levelDoor);
    this.physics.add.collider(player, levelDoor, enterDoor, null, this);

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

  }

  update(){
    // Win Condition
    if (youWin){
      this.scene.start('LevelFour');
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
    }
    if (!keys.SPACE.isDown){
      changeAttack = false;
    }

    // Player Attack
    if (pointer.isDown && !hasShot){
      switch (attack){
        case "single":
        this.singleAttack();
        this.time.addEvent({delay: 150, callback: () => hasShot = false});
        break;
        case "triple":
        for (var i=0; i<3; i++){
          this.time.addEvent({delay: i*100, callback: () => this.tripleAttack()});
        }
        this.time.addEvent({delay: 400, callback: () => hasShot = false})
        break;
        case "spread":
        for (var i=0; i<15; i++){
          this.spreadAttack();
        }
        this.time.addEvent({delay: 1000, callback: () => hasShot = false})
        break;
        case "cannon":
        this.cannonAttack();
        this.time.addEvent({delay: 1500, callback: () => hasShot = false});
        break;
      }
      hasShot = true;
    }
    /* if(!pointer.isDown){
      hasShot = false;
    } */

    //Platform Toggles
    this.platformToggle(Phaser.Math.Between(0,100), plats[Phaser.Math.Between(0,8)])
  }

  //Player Attacks
  singleAttack(){
    shotNoise.play();
    var projectile = projectiles.create(player.x, player.y, 'lvl4projectile');
    var velocityX = (pointer.x - player.x)*4;
    var velocityY = (pointer.y - player.y)*4;
    projectile.setVelocity(velocityX, velocityY);
  }

  tripleAttack(){
    shotNoise.play();
    var projectile = projectiles.create(player.x, player.y, 'lvl4projectile');
    var velocityX = (pointer.x - player.x)*3;
    var velocityY = (pointer.y - player.y)*3;
    projectile.setVelocity(velocityX, velocityY);
  }

  spreadAttack(){
    cannonNoise.play();
    var bomb = projectiles.create(player.x, player.y, 'lvl4projectile');
    var velocityX = ((pointer.x - player.x)*4) + Phaser.Math.Between(-100, 100);
    var velocityY = (pointer.y - player.y)*4 + Phaser.Math.Between(-100, 100);
    bomb.setVelocity(velocityX, velocityY);

  }

  cannonAttack(){
    cannonNoise.play();
    var cannon = cannons.create(player.x, player.y, 'lvl4projectile');
    var velocityX = (pointer.x - player.x)*6;
    var velocityY = (pointer.y - player.y)*6;
    cannon.setVelocity(velocityX, velocityY);
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
      }
    }
  }

}
