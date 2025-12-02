// aesthetic elements
let font;
let disk;

// logistics
let game;
let inLevel = false;
let popUp = false;
let popupButton = null;
// audio dictionary
let loadedAudio = {};

function preload(){
  font = loadFont("shuttleblock-fonts/shuttle-bold.otf");
  disk = loadImage("images/disk.svg");
  let songList = 
  [ "FUR_ELISE",
    "BOHEMIAN_RHAPSODY",
    "YESTERDAY",
    "GREAT_FAIRY_FOUNTAIN",
    "SHISSOU",
    "LIFE_GOES_ON"
  ];

  // adds loaded audio to dictionary based on their string
  for (let s of songList){
    loadedAudio[s] = loadSound(`songs/${s}.mp3`);
  }  
}

function setup(){
  createCanvas(600, 600);
  textFont(font);
  game = new RhythmGame();
}

function draw(){
  background(240);
  let currentStrokeWeight = drawingContext.lineWidth;

  // draws the text popup after exiting level
  if (popUp) {
    drawExit();
    return;
  }

  if (!inLevel) {
    game.drawMainMenu();
    //print("Current stroke weight: "+currentStrokeWeight);
  } else {
    game.drawLevel();
  }
}

function mouseClicked() {

  if (popUp && popupButton !== null) {

    if (mouseX > popupButton.x &&
        mouseX < popupButton.x + popupButton.w &&
        mouseY > popupButton.y &&
        mouseY < popupButton.y + popupButton.h) {

      // closes popup, returns to main menu
      popUp = false;
      inLevel = false;

      if (game.currentLevel) {
        game.currentLevel.stop();
        game.currentLevel = null;
      }

      popupButton = null;
      return;
    }
  }

  
  if (!inLevel) {
    game.checkLevelClick(mouseX, mouseY);
    return;
  }

  
  if (game.checkExitClick(mouseX, mouseY)) {
    popUp = true;

    if (game.currentLevel) {
      game.currentLevel.pause();  
    }

    return;
  }

  
  if (game.currentLevel) {
    let bar_y = (height/2 - game.levelSize[1]/2) +(game.levelSize[1] * 0.6)
    game.currentLevel.checkHit(mouseX, mouseY,bar_y);
  }
}

// selects a different scenario based on what level is being played
function storyText(){
  index = game.songs.indexOf(game.currentLevel.name)
  if(index === 0){
    return `
    You just played the song that your mom liked to listen to while she was pregnant with you! Also the first song you ever played on piano.`
  }
  else if(index === 1){
    return `
    You just played your favorite song from your Queen era, just like you did in seventh grade at your piano recital. `
  }
  else if(index === 2){
    return `
    You just played the song your mom would always sing during your childhood. This brings back feelings of longing for a simpler time. `
  }
  else if(index === 3){
    return `
    You just played the song that reminds you of the games you used to play during your childhood. You sometimes wish you could go back as an escape. `
  }
  else if(index === 4){
    return `
    You just played the song that reminds you of your days in quarantine. It marks the end of your middle school days with a twinge of nostalgia.`
  }
  else if(index === 5){
    return `You just played the song that you loved back in high school. It reminds you that life is too beautiful and fleeting to get hung up on the little things. `
  }
}

// draws pop up upon exit
function drawExit(){
  push();

  // background
  noStroke();
  fill("#71AEC8");
  rectMode(CORNER)
  rect(0, 0, width, height);

  // center w/ text
  let w = width * 0.55;
  let h = height * 0.82;
  let x = width/2 - w/2;
  let y = height/2 - h/2;

  fill("#F1EBE6");
  stroke(80);
  strokeWeight(2);
  rect(x, y, w, h, 25);

  // adjust to specific text descriptions per scene
  textAlign(CENTER, CENTER);
  fill(0);
  noStroke();
  textSize(26);
  text("Level Complete!", width/2, y + h * 0.08);

  print(game.currentLevel.name)
  textSize(16);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER)
  rectMode(CENTER)
  text(storyText(), width/2, y+h*0.30, w*0.85);
  rectMode(CORNER)
  // displays score summary
  let L = game.currentLevel;

  if (L) {
    //let totalNotes = L.notesHit + L.notesMissed;
    //let acc = totalNotes > 0 ? floor((L.notesHit / totalNotes) * 100) : 0;

    textSize(16);
    fill(0);
    noStroke();
    text(`Score: ${L.score}`, width/2, y + h * 0.63);
    // text(`Max Combo: ${L.maxCombo}`, width/2, y + h * 0.68);
    // text(`Accuracy: ${acc}%`, width/2, y + h * 0.73);
  }

  // button to click
  let bw = w * 0.45;
  let bh = h * 0.13;
  let bx = width/2 - bw/2;
  let by = y + h * 0.78;

  popupButton = { x: bx, y: by, w: bw, h: bh };

  stroke(60);
  fill("#E37B6F");
  rect(bx, by+15, bw, bh, 15);

  noStroke();
  fill(0);
  textSize(18);
  text("Return to Menu", width/2, by + (bh/2)+15);

  pop();
}

class RhythmGame {
  constructor(){
    this.mainSize = [width * 0.79, height * 0.883];
    this.levelSize = [width, height * 0.45];

    this.songs = [
      "FUR_ELISE",
      "BOHEMIAN_RHAPSODY",
      "YESTERDAY",
      "GREAT_FAIRY_FOUNTAIN",
      "SHISSOU",
      "LIFE_GOES_ON"
    ];
    this.levels = [];
    this.spawnLevelButtons();
    this.currentLevel = null;
  }

  spawnLevelButtons(){
    let centerX = width * 0.45;
    let startY = height/2 - (this.songs.length * 20)/2;
    let gap = 30;

    this.levels = [];

    for(let i = 0; i < this.songs.length; i++){
      let y = startY + i * gap;
      let x = centerX - 15;
      this.levels.push(new LevelDescriptor(this.songs[i], x, y));
    }
  }

  drawMainMenu(){
    clear();
    this.drawWindow(this.mainSize, "Main Menu");

    fill(0);
    strokeWeight(1);
    textAlign(LEFT, CENTER);

    for(let i = 0; i < this.levels.length; i++){
      let ld = this.levels[i];
      image(disk, ld.x - 50, ld.y - 7, 20, 20);
      strokeWeight(1);
      text(ld.name + ".mp3", ld.x - 30, ld.y);
    }
  }

  checkLevelClick(mx,my){
    for(let ld of this.levels){
      if(dist(mx,my,ld.x-50,ld.y) < 10){
        this.currentLevel = new LevelPlayable(ld.name, this.levelSize);
        inLevel = true;
        this.currentLevel.start();
        break;
      }
    }
  }

  drawLevel(){
    clear();
    this.drawWindow(this.levelSize, "Level");
// (height/2 - this.levelSize[1]/2) +(this.levelSize[1] * 0.6) // this is barY
    let areaX = width/2 - this.levelSize[0]/2;
    let areaY = height/2 - this.levelSize[1]/2;

    let barY = areaY + this.levelSize[1] * 0.6;
    let barW = this.levelSize[0] * 0.6;
    let barStartX = width/2 - barW/2;
    let barEndX = width/2 + barW/2;

    stroke(0);
    strokeWeight(2);
    line(barStartX, barY, barEndX, barY);

    this.drawSmallWindow(areaX + 80, areaY - 40, 140, 60, "Combo");
    this.drawSmallWindow(areaX + 240, areaY - 40, 140, 60, "Score");

    if(this.currentLevel){
      this.currentLevel.updateAndDraw(barStartX, barEndX, barY);

      noStroke();
      fill(0);
      textAlign(LEFT, CENTER);
      textSize(18);
      //strokeWeight(1);
      text("Score: " + this.currentLevel.score, areaX + 250, areaY - 12);
      text("Combo: " + this.currentLevel.combo, areaX + 90, areaY - 12);
      stroke(0);
    }
  }

  drawSmallWindow(x,y,w,h,title){
    rectMode(CORNER);
    stroke(0);
    strokeWeight(1);
    fill("#F1EBE6");
    rect(x,y,w,h);
    fill("#f59197");
    rect(x,y,w,h/6);
    noStroke();
    fill(0);
    textSize(12);
    //strokeWeight(1);
    //text(title, x + 6, y + h/17);
  }

  drawWindow(size, title){
    let x = width/2 - size[0]/2;
    let y = height/2 - size[1]/2;

    rectMode(CORNER);
    stroke(0);
    strokeWeight(2);
    fill("#F1EBE6");
    rect(x,y,size[0],size[1]);
    fill("#F4BD46");
    rect(x,y,size[0],size[1]/9);

    fill("#E37B6F");
    circle((x + size[0]) - (size[0]/20), y + size[1]/18, size[1]/18);

    noStroke();
    fill(0);
    textSize(16);
    //strokeWeight(1);
    text(title, x + size[0]*0.05, y + (size[1]/18));
  }

  checkExitClick(mx,my){
    let size = this.levelSize;
    let x = width/2 - size[0]/2;
    let y = height/2 - size[1]/2;
    let cx = (x + size[0]) - (size[0]/20);
    let cy = y + size[1]/18;
    let r = size[1]/36;

    return dist(mx, my, cx, cy) < r;
  }
}

// used to display the levels in the main menu
class LevelDescriptor {
  constructor(name, x, y){
    this.name = name;
    this.x = x;
    this.y = y;
  }
}

// actual gameplay logic 
class LevelPlayable {
  constructor(name, levelSize){
    this.name = name;
    this.levelSize = levelSize;
    this.audio = loadedAudio[name];

    // used to sync the notes spawn to the beats of each song
    const BPM_BY_SONG = { 
      "FUR_ELISE":120,
      "BOHEMIAN_RHAPSODY":72,
      "YESTERDAY":97,
      "GREAT_FAIRY_FOUNTAIN":156,
      "SHISSOU":110,
      "LIFE_GOES_ON":81 
    };
    this.bpm = BPM_BY_SONG[name] || 120;

    this.secPerBeat = 60 / this.bpm;
    this.spawnInterval = this.secPerBeat * 2;

    this.lanes = 4;
    this.activeNotes = [];
    this.noteSize = 20;
    this.noteSpeed = 2.4;

    this.score = 0;
    this.combo = 0;

    let playableW = this.levelSize[0] * 0.6;
    let left = width/2 - playableW/2;
    let inc = playableW / (this.lanes - 1);

    this.laneXs = [];
    for(let i = 0; i < this.lanes; i++)
      this.laneXs.push(left + i * inc);

    this.topY = height/2 - this.levelSize[1]/2 + 40;
    this.bottomY = height/2 + this.levelSize[1]/2 - 40;

    this.lastBeatTime = 0;
    this.running = false;
  }

  start(){
    this.running = true;
    this.activeNotes = [];
    this.score = 0;
    this.combo = 0;

    this.audio.stop();
    this.audio.play();
    this.lastBeatTime = 0;
  }

  pause(){
    this.running = false;
    if (this.audio && this.audio.isPlaying()){
      this.audio.pause();
    }
  }

  stop(){
    this.running = false;
    if (this.audio && this.audio.isPlaying()){
      this.audio.stop();
    }
  }

  updateAndDraw(barStartX, barEndX, barY){
    if(this.running){
      let audioTime = this.audio.currentTime();

      // stops level at the end of audio
      if (!this.audio.isPlaying() && this.running) {
        this.running = false;
        popUp = true;
        return;
      }


      if(audioTime - this.lastBeatTime >= this.spawnInterval){
        this.spawnRandomRow();
        this.lastBeatTime = audioTime;
      }
    }

    for(let i = this.activeNotes.length - 1; i >= 0; i--){
      let n = this.activeNotes[i];
      n.y += this.noteSpeed;
      n.draw();

      if(n.y > barY + 30){
        this.activeNotes.splice(i,1);
        this.notesMissed++;
        this.combo = 0;
      }      
    }

    // different note lanes
    stroke(180);
    for(let x of this.laneXs){
      line(x, this.topY - 10, x, this.bottomY + 50);
    }

    // horizontal hit bar
    noFill();
    stroke(0);
    rectMode(CENTER);
    rect(width/2, barY - 6, (barEndX - barStartX)*0.9, 30);
  }

  spawnRandomRow(){
    let lane = floor(random(this.lanes));
    let x = this.laneXs[lane];
    this.activeNotes.push(new Note(x, this.topY, this.noteSize));
  }

  checkHit(mx,my, barY){
    let hitY = barY;
    let tol = 28;

    for(let i = this.activeNotes.length - 1; i >= 0; i--){
      let n = this.activeNotes[i];

      if(dist(mx,my,n.x,n.y) < n.size/2 + 10){
        if(abs(n.y - hitY) <= tol){
          this.activeNotes.splice(i,1);
          this.combo++;
          this.notesHit++;
          if (this.combo > this.maxCombo) this.maxCombo = this.combo;
          this.score += 100 + this.combo * 2;
          return;
        }
      }
    }

    this.combo = 0;
  }
}

class Note {
  constructor(x,y,size){
    this.x = x;
    this.y = y;
    this.size = size;
  }
  draw(){
    noStroke();
    fill("#71AEC8");
    circle(this.x, this.y, this.size);
  }
}
