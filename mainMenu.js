class MainMenu extends Phaser.Scene {
  constructor(){
    super('MainMenu');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('star', 'assets/star.png');
    this.load.audio('select', ['assets/select.ogg', 'assets/select.mp3', 'assets/select.m4a']);
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');
    selectNoise = game.sound.add('select');


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
    levelSelectButton.on('pointerdown', () => this.levelSelect());
    tutorialButton.setInteractive();
    tutorialButton.on('pointerdown', () => this.tutorial());

  }

  update(){}

  newGame(){
    selectNoise.play();
    progress = 1;
    this.continueGame();
  }

  continueGame(){
    selectNoise.play();

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

  levelSelect(){
    selectNoise.play();
    this.scene.start('LevelSelect');
  }

  tutorial(){
    selectNoise.play();
    this.scene.start('Tutorial');
  }

}
