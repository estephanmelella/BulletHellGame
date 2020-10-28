class LevelOneIntro extends Phaser.Scene {
  constructor(){
    super('LevelOneIntro');
  }

  preload() {
    this.load.image('lvl1background_bigger', 'assets/lvl1background_bigger.png');
    this.load.image('lvl1ground', 'assets/moonrock.png');
    this.load.image('lvl1ground_breaking', 'assets/cracked_moonrock.png');
    this.load.image('lvl1ground_broken', 'assets/broken_moonrock.png');
    this.load.image('explosion', 'assets/explosion.png');
    this.load.image('win', 'assets/star.png');
    this.load.image('lvl1projectile', 'assets/bomb.png');
    this.load.image('door', 'assets/door.png');
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

    //Sounds
    jumpNoise = game.sound.add('jump', {volume: .25});
    bombNoise = game.sound.add('boom', {volume: .25});
    hitNoise = game.sound.add('hit', {volume: .25});
    keyNoise = game.sound.add('key', {volume: .25});
    winNoise = game.sound.add('win', {volume: .25});
    shotNoise = game.sound.add('shot', {volume: .25});

    // The player
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

    // projectiles
    projectiles = this.physics.add.group();

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
      this.singleAttack();
      this.time.addEvent({delay: 150, callback: () => hasShot = false});
      hasShot = true;
    }
    /* if(!pointer.isDown){
      hasShot = false;
    } */
  }

  //Player Attacks
  singleAttack(){
    shotNoise.play();
    var projectile = projectiles.create(player.x, player.y, 'lvl1projectile');
    var velocityX = (pointer.x - player.x)*4;
    var velocityY = (pointer.y - player.y)*4;
    projectile.setVelocity(velocityX, velocityY);
  }

  movingBombExplode(platform, bomb){
    bomb.setTexture('explosion');
    bomb.setVelocity(0,0);
    this.time.addEvent({delay: 100, callback: () => bomb.destroy()});
    bombNoise.play();
  }

}
