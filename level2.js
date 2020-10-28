class LevelTwo extends Phaser.Scene {
  constructor(){
    super('LevelTwo');
  }

  preload() {
    this.load.image('lvl2background', 'assets/bigger_background.png');
    this.load.image('lvl2villain', 'assets/lvl2villain.png')
    this.load.image('lvl2ground', 'assets/new_plat.png');
    this.load.image('explosion', 'assets/explosion.png');
    this.load.image('door', 'assets/door.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('lvl2projectile', 'assets/new_lvl2_proj.png');
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
    this.add.image(400, 300, 'lvl2background');
    youWin = false;
    hasShot = false;
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    // Ground, ledges, and ceiling
    platforms.create(400, 568, 'lvl2ground').setScale(2).refreshBody();
    platforms.create(400, -75, 'lvl2ground').setScale(2).refreshBody(); //ceiling

    var plat1 = this.physics.add.image(200, 200, 'lvl2ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat2 = this.physics.add.image(600, 200, 'lvl2ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat3 = this.physics.add.image(200, 400, 'lvl2ground')
      .setImmovable(true)
      .setScale(0.5);
    var plat4 = this.physics.add.image(600, 400, 'lvl2ground')
      .setImmovable(true)
      .setScale(0.5);

      plat1.body.allowGravity = false;
      plat2.body.allowGravity = false;
      plat3.body.allowGravity = false;
      plat4.body.allowGravity = false;

    //Platform's movement around the screen
    this.tweens.timeline({
    targets: plat1.body.velocity,
    loop: -1,
    tweens: [
      { x:  200, y:    0, duration: 2000, ease: 'Stepped' },
      { x:    0, y:  100, duration: 2000, ease: 'Stepped' },
      { x: -200, y:    0, duration: 2000, ease: 'Stepped' },
      { x:    0, y: -100, duration: 2000, ease: 'Stepped' },
      { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      ]
    });
    this.tweens.timeline({
    targets: plat2.body.velocity,
    loop: -1,
    tweens: [
      { x:    0, y:  100, duration: 2000, ease: 'Stepped' },
      { x: -200, y:    0, duration: 2000, ease: 'Stepped' },
      { x:    0, y: -100, duration: 2000, ease: 'Stepped' },
      { x:  200, y:    0, duration: 2000, ease: 'Stepped' },
      { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      ]
    });
    this.tweens.timeline({
    targets: plat3.body.velocity,
    loop: -1,
    tweens: [
      { x:    0, y: -100, duration: 2000, ease: 'Stepped' },
      { x:  200, y:    0, duration: 2000, ease: 'Stepped' },
      { x:    0, y:  100, duration: 2000, ease: 'Stepped' },
      { x: -200, y:    0, duration: 2000, ease: 'Stepped' },
      { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
      ]
    });
    this.tweens.timeline({
    targets: plat4.body.velocity,
    loop: -1,
    tweens: [
      { x: -200, y:    0, duration: 2000, ease: 'Stepped' },
      { x:    0, y: -100, duration: 2000, ease: 'Stepped' },
      { x:  200, y:    0, duration: 2000, ease: 'Stepped' },
      { x:    0, y:  100, duration: 2000, ease: 'Stepped' },
      { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
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

    //Enemy
    enemy = this.physics.add.sprite(750 ,50,'lvl2villain');
    enemy.body.allowGravity = false;
    enemy.body.immovable = true;
    enemyShot = false;
    this.time.addEvent({delay: 5000, callback: () => enemyShot = true});

    //Enemy's movement around the screen
    this.tweens.timeline({
    targets: enemy.body.velocity,
    loop: -1,
    tweens: [
      { x: -140, y:    0, duration: 5000, ease: 'Stepped' },
      { x:  140, y:    0, duration: 5000, ease: 'Stepped' },
    ]
  });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC');
    pointer = this.input.activePointer;

    // Attack
    attackList = ["single", "triple"];
    attackNum = 0
    attack = attackList[attackNum];

    // projectiles
    projectiles = this.physics.add.group();
    enemyBombs = this.physics.add.group();
    cannonball = this.physics.add.group();

    // The hp
    hp = 10;
    hpText = this.add.text(600, 16, 'HP: ' + hp, { fontSize: '32px', fill: '#fff' });

    // Enemy Health
    enemyHealth = 300;
    enemyHealthText = this.add.text(200, 16, 'Enemy Health: ' + enemyHealth, { fontSize: '32px', fill: '#fff' });
    enemyShot = true;

    //Back Button
    var menuButton = this.add.text(16, 16, 'Menu', { fontSize: '20px', fill: '#fff' });
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => this.scene.start('MainMenu'));

    //Game Over text
    gameOverText = this.add.text(200,300,'', { fontSize: '72px', fill: '#ff0000' });

    //You Win text
    youWinText = this.add.text(100,300,'', { fontSize: '50px', fill: '#0000ff' });

    //  Colliders
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, plat1);
    this.physics.add.collider(player, plat2);
    this.physics.add.collider(player, plat3);
    this.physics.add.collider(player, plat4);
    this.physics.add.collider(enemyBombs, platforms, bombExplode, null, this);
    this.physics.add.collider(plat1, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat2, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat3, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(plat4, enemyBombs, this.movingBombExplode, null, this);
    this.physics.add.collider(projectiles, platforms, bombExplode, null, this);
    this.physics.add.collider(plat1, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat2, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat3, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(plat4, projectiles, this.movingBombExplode, null, this);
    this.physics.add.collider(player, enemyBombs, playerHitBomb, null, this);
    this.physics.add.collider(enemy, projectiles, enemyHitBomb, null, this);
    this.physics.add.collider(cannonball, platforms, bombExplode, null, this);
    this.physics.add.collider(enemy, cannonball, enemyHitCannon, null, this);

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
        this.time.addEvent({delay: 10000, callback: () => this.scene.start('MainMenu')});
        progress = 1;
      }
      gameOver = false;
    }

    if (youWin) {
      youWin = false; //this makes it so it doesn't call this part of the code every frame
      this.time.addEvent({delay:    0, callback: () => youWinText.setText("Y")});
      this.time.addEvent({delay:  250, callback: () => youWinText.setText("YO")});
      this.time.addEvent({delay:  500, callback: () => youWinText.setText("YOU")});
      this.time.addEvent({delay:  750, callback: () => youWinText.setText("YOU W")});
      this.time.addEvent({delay: 1000, callback: () => youWinText.setText("YOU WI")});
      this.time.addEvent({delay: 1250, callback: () => youWinText.setText("YOU WIN")});
      this.time.addEvent({delay: 1500, callback: () => youWinText.setText("YOU WIN!")});
      this.time.addEvent({delay: 2000, callback: () => this.scene.start('LevelThreeIntro')});
      //this.time.addEvent({delay: 2000, callback: () => youWin = false});
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
      }
      hasShot = true;
    }
    /*if(!pointer.isDown){
      hasShot = false;
    }*/

    // Enemy Attack
    if(enemyHealth > 0 && enemyShot == true){
      enemyShot = false;
      timedEvent = this.time.delayedCall(2500, this.enemyScatterAttack, [], this);
      if (enemyHealth < 100){
        for (var i = 0; i < 3; i++){
          timedEvent = this.time.delayedCall(i*100, this.enemyShootAttack, [], this);
        }
      }
      this.time.addEvent({delay: 3000, callback: () => enemyShot = true});

    }

    //If player falls through the ground
    if (player.y > 514){
      player.y = 514;
    }

  }
  //Player Attacks
  singleAttack(){
    shotNoise.play();
    var projectile = projectiles.create(player.x, player.y, 'lvl2projectile');
    var velocityX = (pointer.x - player.x)*4;
    var velocityY = (pointer.y - player.y)*4;
    projectile.setVelocity(velocityX, velocityY);
  }

  tripleAttack(){
    shotNoise.play();
    var projectile = projectiles.create(player.x, player.y, 'lvl2projectile');
    var velocityX = (pointer.x - player.x)*3;
    var velocityY = (pointer.y - player.y)*3;
    projectile.setVelocity(velocityX, velocityY);
  }

  //Enemy Attacks
  enemyShootAttack(){ // Shoot at the player
    var enemyBomb = enemyBombs.create(enemy.x, enemy.y, 'bomb');
    enemyBomb.setCollideWorldBounds(true);
    enemyBomb.setVelocity(Math.min(800,(player.x - enemy.x)*3), Math.min(800,(player.y - enemy.y)*3));
    enemyBomb.allowGravity = true;
  }

  enemyScatterAttack(){ // Scatters a bunch of bombs
    for (var i = 0; i < 10; i++){
      var enemyBomb = enemyBombs.create(enemy.x, enemy.y, 'bomb');
      enemyBomb.setBounce(1);
      enemyBomb.setCollideWorldBounds(true);
      enemyBomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      enemyBomb.allowGravity = true;
    }
  }

  movingBombExplode(platform, bomb){
    bomb.setTexture('explosion');
    bomb.setVelocity(0,0);
    this.time.addEvent({delay: 100, callback: () => bomb.destroy()});
    bombNoise.play();
  }

}
