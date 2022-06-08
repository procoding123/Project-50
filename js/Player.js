class Player {
  constructor() {
    this.name = null
    this.index = null
    this.positionX = 0
    this.positionY = 0
    this.fuel = 185
    this.score = 0
    this.rank = 0
    this.life = 185
  }

  getCount(){
    database.ref("playerCount").on("value",x=>{
      playerCount = x.val()
    })
  }

  updateCount(x){
    database.ref("/").update({
      playerCount:x
    })
  }

  addplayer(){
    var playerIndex = "players/player"+this.index
    if(this.index===1){
      this.positionX=width/2-100
    }
    else{
      this.positionX=width/2+100
    }
    database.ref(playerIndex).set({
      name:this.name,
     positionX:this.positionX,
      positionY:this.positionY,
      rank:this.rank,
      score:this.score
    })
  }

  getdistance(){
    database.ref("players/player"+this.index).on("value",data=>{
      var distance = data.val()
      this.positionX = distance.positionX
      this.positionY = distance.positionY
    })


  }

  static getPlayersInfo(){
    database.ref("players").on("value",data=>{
      allPlayers = data.val()

    })
  }

  update(){
    var playerIndex = "players/player"+this.index
    database.ref(playerIndex).update({
      name:this.name,
     positionX:this.positionX,
      positionY:this.positionY,
      rank:this.rank,
      score:this.score,
      life:this.life 
    })
  }
  
  getCarsAtEnd(){
    database.ref("carsAtEnd").on("value",data=>{
      this.rank = data.val()
    })
  }

  static updateCarsAtEnd(rank){
    database.ref("/").update({
      carsAtEnd:rank 
    })
  }
  
}
