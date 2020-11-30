var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gO, rest


function preload(){
  jump=loadSound("jump.mp3")
  cpoint=loadSound("checkPoint.mp3")
  die=loadSound("die.mp3")
  gameover=loadImage("gameOver.png");
  res=loadImage("restart.png");
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
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
  createCanvas(displayWidth,displayHeight-200);

  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
    
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  score = 0;
  
 // trex.debug=true;
 
     gO=createSprite(displayWidth/2,80,20,20);
     gO.addImage("g",gameover)
     gameover.scale=0.99
     rest=createSprite(displayWidth/2,140,20,20);
     rest.addImage("z",res)
     rest.scale=0.7
  gO.visible=false
  rest.visible=false
     
  
  
  trex.setCollider("circle",0,0,50)
}

function draw() {
  background(180);
  //tint(0,120,120,128)
  //displaying score
  textStyle(BOLD)
  textSize(18)
  text("Score: "+ score,displayWidth-150,50);
  
  // obstaclesGroup.debug=true
console.log(getFrameRate())
  
  if(gameState === PLAY){
    if(score%100===0 && score>0){
      cpoint.play();
    }
    //move the ground
    ground.velocityX = -4;
    //scoring
    score =score+Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 160) {
      jump.play();
        trex.velocityY = -13;
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
   obstaclesGroup.debug=true
    //spawn obstacles on the ground
    spawnObstacles();
    
    
   
    
    if(obstaclesGroup.isTouching(trex)){
      die.play();
        gameState = END;
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     trex.velocityY=0;
     trex.changeAnimation("collided" , trex_collided)
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     cloudsGroup.setLifetimeEach(-100024512)
      
  obstaclesGroup.setLifetimeEach(-100024512)
      gO.visible=true
  rest.visible=true
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  if(mousePressedOver(rest)&&gameState===END){
    reset()
  }
  
  
  drawSprites();
}

function reset(){
  gO.visible=false
  rest.visible=false
  trex.changeAnimation("running", trex_running)
  cloudsGroup.destroyEach();
  score=0
  
  obstaclesGroup.destroyEach();
  gameState=PLAY
  
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(displayWidth-10,165,10,40);
   obstacle.velocityX = -6;
   
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
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(displayWidth,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 1000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

