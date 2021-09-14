var gameState = "play";
var runner, runnerImg, invisibleGround;
var backgroundImg, ghostImg, ripImg;
var restart, restartImg, cloudsGrp, cloudImg;
var ripGrp, score = 0, gameOverImg, ground1, ground2, groundImg;


function preload(){
    backgroundImg = loadImage("background.png");
    gameOverImg = loadImage("game_over.png");
    ghostImg = loadImage("ghost.png");
    runnerImg = loadAnimation("Run(1).png", "Run(2).png", "Run(3).png", "Run(4).png", "Run(5).png", "Run(6).png", "Run(7).png", "Run(8).png", "Run(9).png", "Run(10).png");
    restartImg = loadImage("restart.png");
    groundImg = loadImage("ground.png");
    ripImg = loadImage("rip.png");
    cloudImg = loadImage("cloud.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    ground1 = createSprite(width - (width - 400), height - 10);
    ground1.addImage(groundImg);

    ground2 = createSprite(width , height - 10);
    ground2.addImage(groundImg);

    runner = createSprite(200, height - 70);
    runner.addAnimation("running", runnerImg);
    runner.addAnimation("runner_dead", ghostImg);
    runner.scale = 0.3;
    runner.setCollider('circle',0,0,100);

    invisibleGround = createSprite(width * 1/2, height - 70, windowWidth, 20);
    invisibleGround.visible = false;

    gameOver = createSprite(width/2,height/2- 80);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);

    gameOver.visible = false;
    restart.visible = false;

    ripGrp = new Group();
    cloudsGrp = new Group();
}

function draw() {
    background(backgroundImg);
    
    stroke("white");
    fill("white");
    textSize(25);
    text("Score: "+ score, width - 400,50);

    if (gameState == "play"){
        score = score + Math.round(getFrameRate()/60);
        ground1.velocityX = -9
        ground2.velocityX = -9
      
        if(keyDown("space") && runner.y >= 159) {
          runner.velocityY = -12;
        }
      
        runner.velocityY = runner.velocityY + 0.7
      
        if (ground1.x < 100){
          ground1.x = ground1.width/3;
        }

        if (ground2.x < 100){
            ground2.x = ground2.width/3;
          }
      
        runner.collide(invisibleGround);
        spawnClouds();
        spawnRips();
      
        if(ripGrp.isTouching(runner)){
            gameState = "end";
        }
    }else if (gameState === "end") {
        gameOver.visible = true;
        gameOver.scale = 1.5;

        restart.visible = true;
        restart.scale = 0.3;

        ground1.velocityX = 0;
        ground2.velocityX = 0;
        runner.velocityY = 0;
        ripGrp.setVelocityXEach(0);
        cloudsGrp.setVelocityXEach(0);

        runner.changeAnimation("runner_dead",ghostImg);
        runner.velocityY = -2;
        runner.scale = 0.2;

        gameOver.depth = runner.depth;
        restart.depth = runner.depth;
        runner.depth = runner.depth + 1;
        
        ripGrp.setLifetimeEach(-1);
        cloudsGrp.setLifetimeEach(-1);

        if(mousePressedOver(restart)){
            reset();
        }
      }

    drawSprites();
}

function spawnClouds() {
    if (frameCount % 120 === 0) {
      var cloud = createSprite(width + 5,Math.round(random(100,200)),40,10);
      cloud.addImage(cloudImg);
      cloud.scale = 0.3;
      cloud.velocityX = -3;
      cloud.lifetime = width/9;

      cloud.depth = runner.depth;
      runner.depth = runner.depth+1;
      
      cloudsGrp.add(cloud);
    }
  }

  function spawnRips() {
    if(frameCount % 80 === 0) {
      var rip = createSprite(width + 10,random(height - 95, height - 70),20,30);
      rip.addImage(ripImg);
      rip.velocityX = -9; 
      rip.scale = 0.25;
      rip.lifetime = width/9;

      rip.depth = runner.depth;
      runner.depth = runner.depth + 1;

      ripGrp.add(rip);
    }
  }
  
  function reset(){
    gameState = "play";

    runner.x = 100;
    runner.scale = 0.3;

    gameOver.visible = false;
    restart.visible = false;
    
    ripGrp.destroyEach();
    cloudsGrp.destroyEach();
    
    runner.changeAnimation("running",runnerImg);
    
    score = 0;
  }