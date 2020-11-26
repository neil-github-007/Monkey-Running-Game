const START = 1;
const PLAY = 2;
const END = 0;
var gameState = START;

var monkey, monkey_running;
var banana, bananaImage, obstacle, obstacleImage;
var foodGroup, obstacleGroup;
var ground;
var bg, backgroundImage;
var score;

var monkeyScale;
var life;

var foodFrame, stoneFrame;

function preload() {


  monkey_running = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png")

  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("stone.png");

  backgroundImage = loadImage("jungle.jpg");

}

function setup() {
  createCanvas(1600, windowHeight);

  foodFrame = 80 * (windowWidth/476);
  stoneFrame = 250 * (windowWidth/476);

  bg = createSprite(0, 0, windowWidth, windowHeight);
  bg.addImage("bg", backgroundImage);
  bg.scale = ((windowHeight + windowWidth) / 800) * 1.1;

  ground = createSprite(0, 350 * (windowHeight / 400), 800, 10);
  ground.visible = false;

  monkey = createSprite(40 * (windowWidth / 400), 325 * (windowHeight / 400), 20, 20);
  monkey.addAnimation("monkey", monkey_running);

  obstacleGroup = new Group();
  foodGroup = new Group();
}


function draw() {
  if (gameState === START) {
    background('cyan');

    noFill();
    stroke("black");
    strokeWeight(3);
    rect(75 * (windowWidth / 400), 245 * (windowHeight / 400), 250 * (windowWidth / 400), 20 * (windowHeight / 400));

    noStroke();
    fill('blue');
    textFont("berlin sans fb");
    textSize(25 * ((windowHeight + windowWidth) / 800));
    text("MONKEY GO HAPPY!", 100 * (windowWidth / 400), 200 * (windowHeight / 400));

    textSize(20 * ((windowHeight + windowWidth) / 800));
    text("Press S to start the game.", 115 * (windowWidth / 400), 225 * (windowHeight / 400));

    textSize(15 * ((windowHeight + windowWidth) / 800));
    text("-Don't touch the rocks or you'll lose!", 80 * (windowWidth / 400), 260 * (windowHeight / 400));


    if (keyDown("s")) {
      gameState = PLAY;
      monkey.y = 325 * (windowHeight / 400);

      score = 0;

      life = 2;

      monkeyScale = 0.1 * ((windowHeight + windowWidth) / 800);
    }
  } else if (gameState === PLAY) {
    background("black");

    monkey.setCollider('circle', 0, 0, 2 * (monkey.width + monkey.height));

    ground.width = windowWidth;
    
    console.log(life);
    spawnObstacle();
    spawnFood();

    bg.velocityX = -(4 + frameCount / 500);
    monkey.scale = monkeyScale;

    if (bg.x < 0) {
      bg.x = bg.width / 2;
    }

    if (touches > 0 || keyDown("space") && monkey.collide(ground)) {
      monkey.velocityY = -(14 * (windowHeight / 400));
      touches = [];
    }

    monkey.velocityY += 0.5 * (windowHeight / 400);
    monkey.collide(ground);

    monkey.debug = false;

    if (foodGroup.isTouching(monkey)) {
      foodGroup.destroyEach();

      score += 2;
    }

    if (obstacleGroup.isTouching(monkey)) {
      life -= 1;
      obstacleGroup.destroyEach();

      monkeyScale *= 0.75;
    }

    if (score % 10 === 0 && score > 0) {
      monkey.scale += 0.05;
    }

    if (life === 0) {
      gameState = END;
    }

    drawSprites();

    fill("aqua");
    textSize(15 * ((windowHeight + windowWidth) / 800));
    text("Score: " + score, 20 * (windowWidth / 400), 20 * (windowHeight / 400));
    text("Lives: " + life, 300 * (windowWidth / 400), 20 * (windowHeight / 400));
  } else if (gameState === END) {

    obstacleGroup.destroyEach();
    foodGroup.destroyEach();

    background('red');

    fill('yellow');
    textFont("algerian");
    textSize(30 * ((windowWidth + windowHeight)) / 800);
    text("You Lose!!!", 125 * (windowWidth / 400), 200 * (windowHeight / 400));

    textSize(15 * ((windowWidth + windowHeight)) / 800);
    text("Press R to restart the game", 100 * (windowWidth / 400), 250 * (windowHeight / 400));

    text("Final Score: " + score, 150 * (windowWidth / 400), 145 * (windowHeight / 400));

    if (keyDown("r")) {
      gameState = START;
    }
  }
}

function spawnObstacle() {
  if (frameCount % stoneFrame === 0) {
    obstacle = createSprite(windowWidth, windowHeight - (windowHeight / 5.3), 20, 20);
    obstacle.addImage("obstacle", obstacleImage);
    obstacle.scale = 0.135 * ((windowHeight + windowWidth) / 800);
    obstacle.velocityX = -(4 + frameCount / 500);
    obstacle.lifetime = windowWidth / 4;

    obstacle.setCollider('circle', 0, 0, 125 * ((windowWidth + windowHeight) / 800));
    obstacle.debug = false;

    obstacleGroup.add(obstacle);
  }
}

function spawnFood() {
  if (frameCount % foodFrame === 0) {
    banana = createSprite(windowWidth, random(50, windowHeight - 50), 20, 20);
    banana.addImage("banana", bananaImage);
    banana.scale = 0.05 * ((windowHeight + windowWidth) / 800);
    banana.velocityX = -(4 + frameCount / 500);

    banana.setCollider('circle', 0, 0, banana.width / 3);
    banana.debug = false;

    banana.lifetime = windowWidth / (4 + frameCount / 500);

    foodGroup.add(banana);
  }
}