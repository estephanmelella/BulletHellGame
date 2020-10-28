class MainMenu extends Phaser.Scene {
  constructor(){
    super('MainMenu');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    //this.load.image('star', 'assets/explosion.png');
    this.load.audio('select', ['assets/Select.ogg', 'assets/Select.mp3', 'assets/Select.m4a']);
    this.load.audio('tutorial song', ['assets/Tutorial Song.ogg', 'assets/Tutorial Song.mp3', 'assets/Tutorial Song.m4a'])
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');
    selectNoise = game.sound.add('select');
    selectNoise.setVolume(.25);
    if(!tutorialSong){
      tutorialSong = game.sound.add('tutorial song', {volume: 0.25});
      tutorialSong.setLoop(true);
    }



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
    tutorialButton.on('pointerdown', () => this.tutorialStart());
    if(tutorialSong.isPlaying){
      tutorialSong.stop();
    }
    youWin = false;

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
      this.scene.start('LevelOneIntro');
      break;
      case 2:
      this.scene.start('LevelTwoIntro');
      break;
      case 3:
      this.scene.start('LevelThreeIntro');
      break;
      case 4:
      this.scene.start('LevelFourIntro');
      break;
    }
  }

  levelSelect(){
    selectNoise.play();
    this.scene.start('LevelSelect');
  }

  tutorialStart(){
	selectNoise.play();
	this.scene.start('Tutorial');
  }
}
