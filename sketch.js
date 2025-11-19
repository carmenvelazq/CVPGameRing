// idea: rhythm game with songs that relate to my life //

let diskIcon;
let game;
let inLevel = false;
let levelX, levelY, levelR;
let barStartX, barEndX;
let font;

function preload(){
  font = loadFont("/shuttleblock-fonts/shuttle-bold.otf")
}

function setup() {
  createCanvas(600, 600);
  game = new RhythmGame();
  cursor("/images/cursor.png", 16, 16);
  textFont(font)
}

function draw() {
  if(!inLevel){
    game.drawMainMenu();
    //print("menu width is: "+game.mainSize[0]) // 475
    //print("menu height is: "+game.mainSize[1]) // 530
  }
  else{
    game.drawLevel();
    //print("level width is: "+game.levelSize[0]) // 600
    //print("level height is: "+game.levelSize[1]) // 275
    //game.currentLevel.initializeLevel();
    game.currentLevel.showNotes();
    // push();
    // fill(0);
    // circle(levelX, levelY, levelR)
    // noFill();
    // pop();
  }
  //noLoop();
}
function mouseClicked(){
  print(mouseX, mouseY)
  for(let i = 0; i < game.levels.length; i++){
    let level = game.levels[i];
    if(dist(mouseX, mouseY, level.x, level.y) < 5){
      inLevel = true;
      game.currentLevel = level;
      //print(game.currentLevel.name)
      //game.drawLevel();

    }
  }
  //print(game.currentLevel.name)
  if(inLevel){
    //fill(0)
    //circle(levelX, levelY, levelY)
    if(dist(mouseX, mouseY, levelX, levelY) < levelR){
      inLevel = false;
      //game.drawMainMenu();
    }
  }
}

/*
Songs to include:

- fur elise (mom liked it, my first song on piano)
- bohemian rhapsody (middle school)
- claire de lune (favorite piano piece)
- yesterday (childhood)
- great fairy fountain (also childhood, but video games focused)
- better in stereo (childhood with sister)
- dear friends /maybe/ (loss of friendships over the years)
- shissou (nostalgic, 2020 era)
- life goes on (kpop era)

- - - - - - - - - - - - 

user interface: 

- kind of a pink/purple vibe 
*/

class RhythmGame{
  constructor(){
    // set mS width to width/3, mS height to windowHeight*(2/3)
    // alternatively, to width/3, width*(3/2)
    this.mainSize = [width*(475/600), height*(530/600)] // sets main menu window size
    this.levelSize = [width, height*(275/600)] // sets level window size
    this.mainColors = [] // array of color scheme
    this.songs = ["Fur_Elise", "Bohemian_Rhapsody", "Claire_de_Lune", "Yesterday", "Great_Fairy_Fountain", "Better_in_Stereo", "Dear_Friends", "Shissou", "Life_Goes_On"] // array of songs for game
    this.levels = []
    this.currentLevel = null;
    this.barSize = this.levelSize[0]*2/5
    this.barStartX = width/2 + this.barSize*0.1;
    this.barEndX = (width/2 + this.barSize*0.1) + this.barSize;
    //this.
  }
  
  drawMainMenu(){
    //background(225)
    clear()
    this.drawWindow(this.mainSize, "Main Menu", true, true)
    let x = width/2
    let y = ((height/2 - this.mainSize[1]/2) + this.mainSize[1]/9) + (this.mainSize[1]-(this.mainSize[1]/9))/2
    this.drawSongs(x, y)
  }
  
  drawSongs(startX, startY){
    // text size for each song is 12 pixels (for now)
    // let each song take up 15 pixels in Y direction
    
    let newX = startX*(9/10);
    let newY = startY - (this.songs.length*30)/2;
    
    //print(this.songs)
    for(var song of this.songs){
      circle(newX-15, newY, 10)
      textAlign(LEFT, CENTER)
      this.levels.push(new Level(song, newX-15, newY, this.barStartX, this.barEndX))
      text(song+".mp3", newX, newY)
      newY += 30
    }
  }
  
  drawLevel(){
    //background(225)
    clear()
    this.drawWindow(this.levelSize, "Level")
    
    // level window coordinates
    let normX = width/2 - this.levelSize[0]/2
    let normY = height/2 - this.levelSize[1]/2
    
    // combo window coordinates + size
    // need to add variables to update streak + multiplier
    // probably should make it a function 
    let xTop = normX + this.levelSize[0]/6;
    let yTop = normY - normY/2
    let sizeTop = [this.levelSize[0]/3, this.levelSize[1]/2]
    
    // score window coordinates
    // need to add variables to update scores
    let xBot = normX + this.levelSize[0]/18;
    let yBot = normY + this.levelSize[1]*0.55;
    let sizeBot = [this.levelSize[0]/3, this.levelSize[1]/2]
    
    this.drawSmallWindow(xTop, yTop, sizeTop[0], sizeTop[1], "Combo")
    this.drawSmallWindow(xBot, yBot, sizeBot[0], sizeBot[1], "Score")
    
    // draws actual game part
    
    // let barSize = this.levelSize[0]*2/5
    // barStartX = windowWidth/2 + barSize*0.1;
    // barEndX = (windowWidth/2 + barSize*0.1) + barSize;
    line(
        this.barStartX, 
        height/2 + normY/2, 
        this.barEndX, 
        height/2 + normY/2
    )
  }
  
  drawSmallWindow(x, y, w, h, title){
    rectMode(CORNER)
    rect(x, y, w, h)
    rect(x, y, w, h/9)
    this.drawWindowCorner("None", x, y, w, h/9)
    
    textAlign(LEFT, CENTER)
    text(title, x + w*0.05, y + (h/18))
  }
  drawWindow(size, title, sqT = false, uT = false){
    let x =width/2 - size[0]/2
    let y = height/2 - size[1]/2
    
    rectMode(CORNER)
    strokeWeight(2)
    rect(x, y, size[0], size[1])
    rect(x, y, size[0], size[1]/9)
    strokeWeight(1)
    
    this.drawWindowCorner(title, x, y, size[0], size[1]/9, sqT, uT)
    levelX = (x+size[0])-(size[0]/20)
    levelY = y + size[1]/18
    levelR = size[1]/18
    
    textAlign(LEFT, CENTER)
    // if(title == "Level")
    //     text(this.currentLevel, x + size[0]*0.05, y+(size[1]/18))
    // else
    text(title, x + size[0]*0.05, y+(size[1]/18))
  }
  
  drawWindowCorner(title, cX, cY, w, h, sqTrue = false, unTrue = false){
    // parameters are as follows:
    // cX = window corner x // cY = window corner y // w = window stripwindowWith // h = window strip height
    // draw symbols at (cX + w) * 0.75 (3/4 of thewindowWith)
    let areaWidth = w*0.25
    
    // draws the minimize icon
    if(unTrue){
      line((cX+w)-areaWidth, (cY+h/2)+(areaWidth/9), ((cX+w)-areaWidth)+(areaWidth/6), (cY+h/2)+(areaWidth/9))
    }
    
    // draws the fullscreen icon
    if(sqTrue){
      rectMode(CENTER)
      square((cX+w)-(areaWidth*7/12), /*((cY+h)*0.95)-((areaWidth*2/18))*/cY+(h/2), areaWidth*2/9)
    }
    
    // draws X (to be figured out later)
    // draw a circle for now
    if(title == "Level")
      circle((cX+w)-(areaWidth/5), cY+(h/2), h/2)
    else
      circle((cX+w)-(areaWidth/5), /*((cY+h)*0.95)-((areaWidth*2/18))*/cY+(h/2), areaWidth*2/9)
  }
}

class Level {
  constructor(s, x, y, start, end){
    this.name = s // name of song
    this.sounds = null // array of sound files for notes
    this.windowSize = [350, 300] // sets the size of the bg window
    this.backg = null // sets the background for each level to be diff
    this.colors = [] // each level has its own color scheme array
    this.notes; // matrix of notes to show - maybe 4 cols?
    this.initializeLevel();
    this.x = x
    this.y = y
    this.start = start;
    this.end = end;
  }
  
  initializeLevel(){
    this.notes = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]
    this.randomRow();
  }
  
  randomRow(){
    for(let r = 0; r < this.notes.length; r++){
      let randInt = floor(random(this.notes.length))
      for(let c = 0; c < this.notes[r].length; c++){
        if(c === randInt){
          this.notes[c][r] = new Note();
        }
      }
    }
  }
  showNotes(){
    
    let hei = height/2 - this.windowSize[1]/4;
    let increment = (this.end - this.start)/4
    for(let r = 0; r < this.notes.length; r++){
        let tempStart = this.start + increment/2
        for(let c = 0; c < this.notes[0].length; c++){
            if(this.notes[c][r] == 1){
                push();
                noFill();
                circle(tempStart, hei, 5)
                pop();
            }
            tempStart += increment
            // push();
            // fill(0)
            // textAlign(CENTER)
            // text(this.notes[c][r], tempStart, hei)
            // pop();
            // tempStart += increment
        }
        hei += 30
    }
  }
}

class Song{
  constructor(name, x, y){
    this.x = x
    this.y = y  
    this.name = name
  }
}

class Note{
  constructor(x, y, size){
    this.x = x
    this.y = y
    this.size = size
  }
}