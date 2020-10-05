class LevelSelect extends Phaser.Scene {
  constructor(){
    super('LevelSelect');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('star', 'assets/star.png');
    this.load.audio('select', ['assets/Select.ogg', 'assets/Select.mp3', 'assets/Select.m4a']);
    this.load.audio('error', ['assets/Error.ogg', 'assets/Error.mp3', 'assets/Error.m4a'])
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');
    selectNoise = game.sound.add('select');
    errNoise = game.sound.add('error')


    //Menu text
    var titleText = this.add.text(200,100,'Level Select', { fontSize: '60px', fill: '#505000' });
    var errorText = this.add.text(300,170,'', { fontSize: '30px', fill: '#ff0000' });

    //FIXME: POLISH
    var level1Button = this.add.text(300,200,'Level 1', { fontSize: '50px', fill: '#ff0000' });
    var level2Button = this.add.text(300,300,'Level 2', { fontSize: '50px', fill: '#ff0000' });
    var level3Button = this.add.text(300,400,'Level 3', { fontSize: '50px', fill: '#ff0000' });
    var level4Button = this.add.text(300,500,'Level 4', { fontSize: '50px', fill: '#ff0000' });
    var backButton = this.add.text(10,10,'Back', { fontSize: '30px', fill: '#ff0000' });

    level1Button.setInteractive();
    level1Button.on('pointerdown', () => this.level1(errorText));
    level2Button.setInteractive();
    level2Button.on('pointerdown', () => this.level2(errorText));
    level3Button.setInteractive();
    level3Button.on('pointerdown', () => this.level3(errorText));
    level4Button.setInteractive();
    level4Button.on('pointerdown', () => this.level4(errorText));
    backButton.setInteractive();
    backButton.on('pointerdown', () => this.back());
  }

  update(){}

  level1(errorText){
    selectNoise.play();
    this.scene.start('LevelOne');
  }

  level2(errorText){
    if (progress >= 2){
      selectNoise.play();
      this.scene.start('LevelTwo');
    } else {
      errNoise.play();
      errorText.setText('Level 2 Locked');
    }
  }

  level3(errorText){
    if (progress >= 3){
      selectNoise.play();
      this.scene.start('LevelThree');
    } else {
      errNoise.play();
      errorText.setText("Level 3 Locked");
    }
  }

  level4(errorText){
    if (progress === 4){
      selectNoise.play();
      this.scene.start('LevelFour');
    } else {
      errNoise.play();
      errorText.setText('Level 4 Locked');
    }
  }

  back(){
    selectNoise.play();
    this.scene.start('MainMenu');
  }

}
