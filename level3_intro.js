class LevelThreeIntro extends Phaser.Scene {
  constructor(){
    super('LevelThreeIntro');
  }

  preload() {
    this.load.image('lvl3background', 'assets/lvl3background.png');
    this.load.image('lvl3ground', 'assets/platform.png');
    this.load.image('explosion', 'assets/explosion.png');
    this.load.image('bomb', 'assets/magmabullet.png');
    this.load.image('lvl3projectile', 'assets/bomb.png');
    this.load.image('door', 'assets/door.png')
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
    this.add.image(400, 300, 'lvl3background').setScale(2);
    youWin = false;
    hasShot = false;
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    // Ground, ledges, and ceiling
    platforms.create(400, 568, 'lvl3ground').setScale(2).refreshBody();
    platforms.create(400, -75, 'lvl3ground').setScale(2).refreshBody(); //ceiling
    platforms.create(100, 500, 'lvl3ground').setScale(0.5).refreshBody(); //ceiling
    platforms.create(700, 100, 'lvl3ground').setScale(0.5).refreshBody(); //ceiling

    var plat1 = this.physics.add.image(700, 400, 'lvl3ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat2 = this.physics.add.image(700, 400, 'lvl3ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat3 = this.physics.add.image(700, 400, 'lvl3ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat4 = this.physics.add.image(700, 400, 'lvl3ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat5 = this.physics.add.image(100, 250, 'lvl3ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat6 = this.physics.add.image(100, 250, 'lvl3ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat7 = this.physics.add.image(100, 250, 'lvl3ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat8 = this.physics.add.image(100, 250, 'lvl3ground')
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

    //Platform's movement around the screen
    this.tweens.timeline({
    targets: plat1.body.velocity,
    loop: -1,
    tweens: [
      { x: -150, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      { x:  150, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      ]
    });
    this.tweens.timeline({
    targets: plat2.body.velocity,
    loop: -1,
    tweens: [
      { x: -100, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      { x:  100, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      ]
    });
    this.tweens.timeline({
    targets: plat3.body.velocity,
    loop: -1,
    tweens: [
      { x:  -50, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      { x:   50, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      ]
    });
    this.tweens.timeline({
    targets: plat4.body.velocity,
    loop: -1,
    tweens: [
      { x:    0, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      ]
    });
    this.tweens.timeline({
    targets: plat5.body.velocity,
    loop: -1,
    tweens: [
      { x:  150, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      { x: -150, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      ]
    });
    this.tweens.timeline({
    targets: plat6.body.velocity,
    loop: -1,
    tweens: [
      { x:  100, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      { x: -100, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      ]
    });
    this.tweens.timeline({
    targets: plat7.body.velocity,
    loop: -1,
    tweens: [
      { x:   50, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      { x:  -50, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      ]
    });
    this.tweens.timeline({
    targets: plat8.body.velocity,
    loop: -1,
    tweens: [
      { x:    0, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 3000, ease: 'Cubic' },
      { x:    0, y:    0, duration: 5000, ease: 'Cubic' },
      ]
    });

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

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC');
    pointer = this.input.activePointer;

    // Attack
    attackList = ["single", "triple", "spread"];
    attackNum = 0
    attack = attackList[attackNum];

    // projectiles
    projectiles = this.physics.add.group();

    //Weapon text
    weaponText = this.add.text(50,550,'Weapon: single', { fontSize: '30px', fill: '#000000' });

    //Back Button
    var menuButton = this.add.text(16, 16, 'Menu', { fontSize: '20px', fill: '#000' });
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => this.scene.start('MainMenu'));

    //Level Door
    levelDoor = this.physics.add.sprite(750, 40, 'door');
    this.physics.add.collider(platforms, levelDoor);
    this.physics.add.collider(plat1, levelDoor);
    this.physics.add.collider(plat2, levelDoor);
    this.physics.add.collider(plat3, levelDoor);
    this.physics.add.collider(plat4, levelDoor);
    this.physics.add.collider(player, levelDoor, enterDoor, null, this);

    //  Colliders
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, plat1);
    this.physics.add.collider(player, plat2);
    this.physics.add.collider(player, plat3);
    this.physics.add.collider(player, plat4);
    this.physics.add.collider(player, plat5);
    this.physics.add.collider(player, plat6);
    this.physics.add.collider(player, plat7);
    this.physics.add.collider(player, plat8);
    this.physics.add.collider(projectiles, platforms, bombExplode, null, this);
    this.physics.add.collider(plat1, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat2, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat3, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat4, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat5, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat6, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat7, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat8, projectiles, this.movingBombExplode, null, this);

  }

  update(){

    // Win Condition
    if (youWin){
      this.scene.start('LevelThree');
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
      weaponText.setText('Weapon: ' + attack);

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
      }
      hasShot = true;
    }
    /* if(!pointer.isDown){
      hasShot = false;
    } */

  }

  //Player Attacks
  singleAttack(){
    shotNoise.play();
    var projectile = projectiles.create(player.x, player.y, 'lvl3projectile');
    var velocityX = (pointer.x - player.x)*4;
    var velocityY = (pointer.y - player.y)*4;
    projectile.setVelocity(velocityX, velocityY);
  }

  tripleAttack(){
    shotNoise.play();
    var projectile = projectiles.create(player.x, player.y, 'lvl3projectile');
    var velocityX = (pointer.x - player.x)*3;
    var velocityY = (pointer.y - player.y)*3;
    projectile.setVelocity(velocityX, velocityY);
  }

  spreadAttack(){
    cannonNoise.play();
    var bomb = projectiles.create(player.x, player.y, 'lvl3projectile');
    var velocityX = ((pointer.x - player.x)*4) + Phaser.Math.Between(-100, 100);
    var velocityY = (pointer.y - player.y)*4 + Phaser.Math.Between(-100, 100);
    bomb.setVelocity(velocityX, velocityY);

  }

  movingBombExplode(platform, bomb){
    bomb.setTexture('explosion');
    bomb.setVelocity(0,0);
    this.time.addEvent({delay: 100, callback: () => bomb.destroy()});
    bombNoise.play();
  }


}
