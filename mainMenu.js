class MainMenu extends Phaser.Scene {
  constructor(){
    super('MainMenu');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('star', 'assets/star.png');
    this.load.audio('shot', ['assets/Shot.ogg', 'assets/Shot.mp3', 'assets/Shot.m4a']);
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');
    shotNoise = game.sound.add('shot');


    //Menu text
    var titleText = this.add.text(50,100,'BLASTER MASTER', { fontSize: '80px', fill: '#505000' });

    //FIXME: POLISH
    var newGameButton = this.add.text(200,250,'New Game', { fontSize: '50px', fill: '#ff0000' });
    var continueGameButton = this.add.text(200,350,'Continue Game', { fontSize: '50px', fill: '#ff0000' });
    var levelSelectButton = this.add.text(200,450,'Level Select', { fontSize: '50px', fill: '#ff0000' });
    var tutorialButton = this.add.text(200,550,'Tutorial', { fontSize: '50px', fill: '#ff0000' });

    newGameButton.setInteractive();
    newGameButton.on('pointerdown', () => this.newGame());
    continueGameButton.setInteractive();
    continueGameButton.on('pointerdown', () => this.continueGame());
    levelSelectButton.setInteractive();
    levelSelectButton.on('pointerdown', () => this.scene.start('LevelSelect'));
    tutorialButton.setInteractive();
    tutorialButton.on('pointerdown', () => this.scene.start('Tutorial'));

  }

  update(){}

  newGame(){
    shotNoise.play();
    progress = 1;
    this.scene.start('LevelOne');
  }

  continueGame(){
    shotNoise.play();

    switch (progress){
      case 1:
      this.scene.start('LevelOne');
      break;
      case 2:
      this.scene.start('LevelTwo');
      break;
      case 3:
      this.scene.start('LevelThree');
      break;
      case 4:
      this.scene.start('LevelFour');
      break;
    }
  }

}
