var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState;
var car1,car2,cars;
var allPlayers, coins, fuels;
var obstacle1,obstacle2;

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  c1 = loadImage("./assets/car1.png");
  c2 = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");
  fuelImg = loadImage("./assets/fuel.png");
  coinsImg = loadImage("./assets/goldCoin.png");
  lifeImg = loadImage("./assets/life.png");
  obstacle1Img = loadImage("./assets/obstacle1.png");
  obstacle2Img = loadImage("./assets/obstacle2.png");
  blastImg = loadImage("./assets/blast.png");
  explosion = loadSound("./assets/explosion.mp3");
  backgroundMusic = loadSound("./assets/backgroundmusic.mp3");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if(playerCount===2){
      game.update(1)
  }
  if(gameState===1){
      game.play()
  }
  //if(gameState===2){
  //  game.end()
 // }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
