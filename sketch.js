var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0, gameOver, restart, gameOverImg, restartImg;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
}

function setup() {
  var canvas = createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 50);

  trex.debug = false;
  
  ground = createSprite(300,180,1200,20);
  ground.addImage("ground",groundImage);
  //ground.x = ground.width /2;
  
  invisibleGround = createSprite(300,190,1000000000000,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  restart = createSprite(150, 160);
  restart.scale = 1;
  restart.addImage(restartImg);
  restart.visible = false;
  gameOver = createSprite(150, 50);
  gameOver.scale = 1;
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;
  
  score = 0;
}

function draw() {
  background(180);
  text("Score: "+ score, 500,50);

  camera.position.x = trex.x;
  camera.position.y = trex.y;

  trex.collide(invisibleGround);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate()/60);
    
    if(keyDown("space") && trex.y >= 100) {
      trex.velocityY = -12;
    }

    trex.debug = false;
    
    trex.velocityY = trex.velocityY + 0.8

    ground.velocityX = -4;
    
    if (ground.x < 0){
      ground.x = 600
    }

    
    spawnClouds();
    spawnObstacles();
    
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }

    if (score > 7000) {
      text("You Win!!", 50, 200);
      gameState = END;
    }
  }

  else if (gameState === END) {
   // trex.velocityX = 0;
    //trex.velocityY = 0;
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    gameOver.visible = true;
    restart.visible = true;
    cloudsGroup.setVelocityXEach(0);
    trex.changeImage(trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if (mousePressedOver(restart)) {
      reset(); 
    }
  }  
  drawSprites();
}

function reset() {
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.addAnimation("running", trex_running);
  
  score = 0;
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,200,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 900;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.4;
    obstacle.lifetime = 900;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}