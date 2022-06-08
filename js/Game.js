class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")
    this.leaderboard = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.playerMoving = false
    this.leftKeyActive = false
    this.blast = false
  }

  getState(){
    database.ref("gameState").on("value",x=>{
      gameState = x.val()
    })
  }

  update(x){
    database.ref("/").update({
      gameState:x
    })
  }

  start(){
    
    form = new Form ()
    form.display() 
    player = new Player()
    playerCount = player.getCount()

    car1 = createSprite(width/2-50,height-100)
    car1.addImage("car1",c1)
    car1.addImage("blast",blastImg)
    car1.scale = 0.7

    car2 = createSprite(width/2+50,height-100)
    car2.addImage("car2",c2)
    car2.addImage("blast",blastImg)
    car2.scale = 0.29

    cars = [car1,car2]
    fuels = new Group()
    coins = new Group()
    obstacle1 = new Group()
    obstacle2 = new Group()
    var obstacle1Positions = [
      {x:width/2-150,y:height-1300,image:obstacle1Img},
      {x:width/2+250,y:height-1800,image:obstacle1Img},
      {x:width/2-180,y:height-3300,image:obstacle1Img},
      {x:width/2-150,y:height-4300,image:obstacle1Img},
      {x:width/2,y:height-5300,image:obstacle1Img},
    ]
    var obstacle2Positions = [
      {x:width/2+250,y:height-800,image:obstacle2Img},
      {x:width/2-180,y:height-2300,image:obstacle2Img},
      {x:width/2,y:height-2800,image:obstacle2Img},
      {x:width/2+180,y:height-3300,image:obstacle2Img},
      {x:width/2+250,y:height-3800,image:obstacle2Img},
      {x:width/2+250,y:height-4800,image:obstacle2Img},
      {x:width/2-180,y:height-5500,image:obstacle2Img},
    ]
    
    this.addSprites(fuels,4,fuelImg,0.02)
    this.addSprites(coins,18,coinsImg,0.09)
    this.addSprites(obstacle1,obstacle1Positions.length,obstacle1Img,0.04,obstacle1Positions)
    this.addSprites(obstacle2,obstacle2Positions.length,obstacle2Img,0.04,obstacle2Positions)


  }

    addSprites(spriteGroup,numberOfSprites,spriteImage,scale,positions=[]){
      for(var i = 0;i<numberOfSprites;i++){
        var x,y
        if(positions.length>0){
          x = positions[i].x
          y = positions[i].y
          spriteImage = positions[i].image

        }
        else{
          x = random(width/2+150,width/2-150)
          y = random(-height*4.5,height-200)
        }
        
        var sprite = createSprite(x,y)
        sprite.addImage(spriteImage)
        sprite.scale = scale
        spriteGroup.add(sprite)

      }

    }

  handleElements(){
    form.hide()
    form.titleImg.position(40,50)
    form.titleImg.class("gameTitleAfterEffect")
    this.resetTitle.html("Reset Game")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2+200,40)
    this.resetButton.class("resetButton")
    this.resetButton.position(width/2+230,100)
    this.leaderboard.html("Leaderboard")
    this.leaderboard.class("resetText")
    this.leaderboard.position(width/3-60,40)
    this.leader1.class("leadersText")
    this.leader1.position(width/3-50,80)
    this.leader2.class("leadersText")
    this.leader2.position(width/3-50,130) 
  }

  play(){
    backgroundMusic.play()
    this.handleElements()
    this.handleResetButton()
    Player.getPlayersInfo()
    player.getCarsAtEnd()
    if(allPlayers!==undefined){
        image(track,5,-height*5,width,height*6)
        this.showLeaderboard()
        this.showLife()
        this.showFuel()
        var index = 0
        for(var plr in allPlayers){
          index=index+1
          var x = allPlayers[plr].positionX
          var y = height-allPlayers[plr].positionY
          cars[index-1].position.x=x
          cars[index-1].position.y=y
          var currentLife = allPlayers[plr].life
          if(currentLife<=0){
            cars[index-1].changeImage("blast")
            cars[index-1].scale=0.3
          }
          if(index===player.index){
              stroke(10)
              fill("red")
              ellipse(x,y,80,80)
              this.handleObstacleCollision(index)
              this.handleCarCollision(index)
              this.handleFuel(index)
              this.handleCoins(index)
              camera.position.x = width/2
              camera.position.y = cars[index-1].position.y
              if(player.life<=0){
                this.blast = true
                this.playerMoving = false
                this.gameOver()
              }

          }
        }
       
        

        if( player.positionY>3550){
          gameState=2
          player.rank+=1
          Player.updateCarsAtEnd(player.rank)
          player.update()
          this.showRank()
        }

        this.handlePlayerControls()
        drawSprites()
    }
  
  }

  handleFuel(index){
    cars[index-1].overlap(fuels,function(collector,collected){
      player.fuel = 185
      collected.remove()
    })

    if(player.fuel>0&&this.playerMoving){
      player.fuel-=0.3
      if(player.fuel<=0){
        gameState=2
        backgroundMusic.pause()
        explosion.play()
        this.gameOver()
      }
    }


  }

  handleCoins(index){
    cars[index-1].overlap(coins,function(collector,collected){
      player.score = 10
      player.update() 
      collected.remove()
    })
  }

  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        players:{}
      })
      window.location.reload()
    })
  }
  
  handlePlayerControls(){
    if(!this.blast){
    if(keyIsDown(UP_ARROW)){
      player.positionY+=10
      this.playerMoving = true 
      player.update()
    }

    if(keyIsDown(LEFT_ARROW)&&player.positionX>width/3-50){
      this.leftKeyActive = true
      player.positionX-=5
      player.update()
    }

    if(keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+300){
      this.leftKeyActive = false
      player.positionX+=5
      player.update()
    }
  }
}

  showRank(){
    swal({
      title:`Awesome!${"\n"}Rank${"\n"}${player.rank}${"\n"}Score:${player.score}`,
      text:"Congratulations! You have successfully reached the finish line",
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x,100",
      confirmButtonText:"Ok"
    })
  }

  showLeaderboard(){
    var leader1,leader2
    var players = Object.values(allPlayers)
    if(
      (players[0].rank===0&&players[1].rank===0)||players[0].rank===1
    ){
       leader1 = players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score
       leader2 = players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
     }
     if(players[1].rank===1){
      leader2 = players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score
      leader1 = players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
     }
     this.leader1.html(leader1)
     this.leader2.html(leader2)
  }

  showLife(){
    push()
    image(lifeImg,width/2-130,height-player.positionY-300,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-300,185,20)
    fill("red")
    rect(width/2-100,height-player.positionY-300,player.life,20)
    pop()
  }

  showFuel(){
    push()
    image(fuelImg,width/2-130,height-player.positionY-250,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-250,185,20)
    fill("yellow")
    rect(width/2-100,height-player.positionY-250,player.fuel,20)
    pop()
  }

  gameOver(){
    swal({
      title:`Game Over`,
      text:"Oops! You lost the race",
      imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize:"100x100",
      confirmButtonText:"Thanks for playing the game"
    })
  }

  handleObstacleCollision(index){
    if(cars[index-1].collide(obstacle1)||cars[index-1].collide(obstacle2)){
      if(player.life>0){
        player.life-=185/4
      }
      player.update()

      if(this.leftKeyActive){
        player.positionX+=100
      }
      else{
        player.positionX-=100
      }
     
    }
  }
  handleCarCollision(index){
    if(index===1){
        if(cars[index-1].collide(cars[1])){
          if(player.life>0){
            player.life-=185/4
          }
          player.update()
    
          if(this.leftKeyActive){
            player.positionX+=100
          }
          else{
            player.positionX-=100
          }
        }
    }

    if(index===2){
      if(cars[index-1].collide(cars[0])){
        if(player.life>0){
          player.life-=185/4
        }
        player.update()
  
        if(this.leftKeyActive){
          player.positionX+=100
        }
        else{
          player.positionX-=100
        }
      }
  }
  }
}


