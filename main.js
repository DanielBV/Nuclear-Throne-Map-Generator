'use strict'; 


// Used to reset the settings when the user does Ctrl+R
const defaultSettings = {
  rows: 50,
  cols: 50,
  maxFloors: 110,
  maxIterations: 200,
  colorWalkers: false,
  initialWalkers: 4,
  differentWalkerDirection: true,
  maxWalkers: 50,
  spawnRatio: 5,
  maxWalkersPerIter: 1,
  despawnRatio: 1,
  maxWalkerDespawnPerIter: 1,
  turnRight: 20,
  turnLeft: 30,
  turnBack: 15,
  squareRatio: 10,
  tunnelRatio: 10,
  tunnelMaxLength: 4
};


let cols, rows;
let pixelSize = 15;
let spawnRatio,despawnRatio, maxWalkers, maxWalkersPerIter, maxWalkerDespawnPerIter, placeFinish, squareRatio,
  tunnelRatio, tunnelMaxLength, maxIterations, numInitialWalkers, initialWalkersInDifferentDirection, maxFloors, showWalkers;

let tlChance; // Turn left
let trChance; // Turn Right
let tbChance; // Turn back
let dtChance; // Don't turn

let insideAnimation = false;

const inputTR = document.getElementById('iTurnRight');
const inputTL = document.getElementById('iTurnLeft');
const inputTB = document.getElementById('iTurnBack');
const inputForward = document.getElementById('iForward');
const inputMW = document.getElementById('iMaxWalkers');
const inputWalkerSpawn = document.getElementById('iWalkerSpawn');
const inputWalkerDespawn = document.getElementById('iWalkerDespawn');
const inputMaxWalkersPerIter = document.getElementById('iMaxWalkersPerIter');
const inputWalkerDespawnPerIter = document.getElementById('iMaxDespawnWalkersPerIter');
const inputRows = document.getElementById('iRows');
const inputCols = document.getElementById('iCols');
const inputMaxFloors = document.getElementById('iMaxFloors');
const inputColorLastPosition = document.getElementById('iColorLastPosition');
const inputFillSquare = document.getElementById('iFillSquare');
const inputStartTunnel = document.getElementById('iStartTunnel');
const inputMaxTunnelLength = document.getElementById('iTunnelMaxSize');
const inputMaxIterations = document.getElementById('iMaxIterations');
const inputInitialWalkers = document.getElementById('iInitialWalkers');
const inputDifferentWalkerDirection = document.getElementById('iDifferentWalkerDirection');
const inputGenerateBtn = document.getElementById('generateButton'); 

const labelTR = document.getElementById('labelTR');
const labelTL = document.getElementById('labelTL');
const labelTB = document.getElementById('labelTB');


inputTR.oninput = function(){
  updateWalkerDirectionPercentage();
}

inputTL.oninput = function(){
  updateWalkerDirectionPercentage();
}

inputTB.oninput = function(){
  updateWalkerDirectionPercentage();
}

function resetSettings(){
  inputTR.value = defaultSettings.turnRight;
  inputTL.value = defaultSettings.turnLeft;
  inputTB.value = defaultSettings.turnBack;
  inputMW.value = defaultSettings.maxWalkers;
  inputWalkerSpawn.value = defaultSettings.spawnRatio;
  inputWalkerDespawn.value = defaultSettings.despawnRatio;
  inputMaxWalkersPerIter.value = defaultSettings.maxWalkersPerIter;
  inputWalkerDespawnPerIter.value = defaultSettings.maxWalkerDespawnPerIter;
  inputRows.value = defaultSettings.rows;
  inputCols.value = defaultSettings.cols;
  inputMaxFloors.value = defaultSettings.maxFloors;
  inputColorLastPosition.checked = defaultSettings.colorWalkers;
  inputFillSquare.value = defaultSettings.squareRatio;
  inputStartTunnel.value = defaultSettings.tunnelRatio;
  inputMaxTunnelLength.value = defaultSettings.tunnelMaxLength;
  inputMaxIterations.value = defaultSettings.maxIterations;
  inputInitialWalkers.value = defaultSettings.initialWalkers;
  inputDifferentWalkerDirection.checked = defaultSettings.differentWalkerDirection;
}

resetSettings();

function disableGenerateBtn(){
  inputGenerateBtn.disabled = true;
}

function enableGenerateBtn(){
  inputGenerateBtn.disabled = false;
}

function checkGenerateBtn(){
  let enable = !insideAnimation;

  if(!walkerMovementRatioIsValid())
    enable = false;
  
  if(enable)
    enableGenerateBtn();
  else
    disableGenerateBtn();
}

function walkerMovementRatioIsValid(){
  tlChance = parseInt(inputTL.value);
  trChance = parseInt(inputTR.value);
  tbChance = parseInt(inputTB.value);

  const forwardChance = 100 - tlChance - trChance - tbChance
  return !isNaN(tlChance) && !isNaN(trChance) && !isNaN(tbChance) 
    && forwardChance >= 0 && tlChance >= 0 && trChance >= 0 && tbChance >= 0;
}

function updateWalkerDirectionPercentage(){
  tlChance = parseInt(inputTL.value);
  trChance = parseInt(inputTR.value);
  tbChance = parseInt(inputTB.value);

  let valid = true;
  if(isNaN(tlChance) || tlChance < 0 || tlChance > 100){
    valid = false;
    labelTL.classList.add("text-danger");
  }else{
    labelTL.classList.remove("text-danger");
  }

  if(isNaN(trChance) || trChance < 0 || trChance > 100){
    valid = false;
    labelTR.classList.add("text-danger");
  }else{
    labelTR.classList.remove("text-danger");
  }

  if(isNaN(tbChance) || tbChance < 0 || tbChance > 100){
    valid = false;
    labelTB.classList.add("text-danger");
  }else{
    labelTB.classList.remove("text-danger");
  }

  const forwardChance = 100 - tlChance - trChance - tbChance
  if(!valid ||  forwardChance < 0 ){
    inputForward.value = "ERROR";
    inputForward.classList.add("text-danger");
  }else{
    inputForward.value = forwardChance;
    inputForward.classList.remove("text-danger");
    inputGenerateBtn.disabled = false;
  }

  checkGenerateBtn();  
}

updateWalkerDirectionPercentage();

function loadForm(){
  tlChance = parseInt(inputTL.value);
  trChance = parseInt(inputTR.value);
  tbChance = parseInt(inputTB.value);
  dtChance = 100 - tlChance - trChance - tbChance;
  maxWalkers = parseInt(inputMW.value);
  spawnRatio = parseInt(inputWalkerSpawn.value);
  despawnRatio = parseInt(inputWalkerDespawn.value);
  maxWalkersPerIter = parseInt(inputMaxWalkersPerIter.value);
  maxWalkerDespawnPerIter = parseInt(inputWalkerDespawnPerIter.value);
  rows = parseInt(inputRows.value);
  cols = parseInt(inputCols.value);
  maxFloors = parseInt(inputMaxFloors.value);
  placeFinish = inputColorLastPosition.checked;
  showWalkers = inputColorLastPosition.checked; //TOD remove placeFinish and rename inputColorLastPosition
  squareRatio = parseInt(inputFillSquare.value);
  tunnelRatio = parseInt(inputStartTunnel.value);
  tunnelMaxLength = parseInt(inputMaxTunnelLength.value);
  maxIterations = parseInt(inputMaxIterations.value);
  numInitialWalkers = parseInt(inputInitialWalkers.value);
  initialWalkersInDifferentDirection = inputDifferentWalkerDirection.checked;
}

/* min (included) and max (excluded). Source: https://www.w3schools.com/js/js_random.asp */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

let tiles;

const directions = {
  LEFT: 0,
  RIGHT: 2,
  UP: 1,
  DOWN: 3
}

function turnRight(direction){
  return (direction+1)%4;
}

function turnLeft(direction){
  return (direction+3)%4;
}

function turnAround(direction){
  return (direction+2)%4;
}

function make2Darray(rows, cols) {
  var arr = new Array(rows);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }
  return arr;
}



function canvasClicked() {
  const x = Math.floor(mouseX/pixelSize);
  const y = Math.floor(mouseY/pixelSize);
  map.table[y][x]=200;
}




var map, walkers;
function setup() {
  loadForm();
  tiles =  {
    FLOOR:color(255, 195, 77),
    WALKER_END: color(255, 0, 0),
    WALL: color(176,144,106)
  };
  const c = createCanvas(cols*pixelSize, rows*pixelSize);
  c.parent("canvas");
  c.mouseClicked(canvasClicked);


  createMap(); 
}

function nextIter(generator){
  const x = generator.next();
  if(x.value){
    map = x.value.map;
    walkers = x.value.stats.walkers;
   setTimeout(() => nextIter(generator),100);
  }else{
    map.placeWalls();
    insideAnimation = false;
    checkGenerateBtn();
  }
}

function createMap(){
  insideAnimation = true;
  checkGenerateBtn();
  const mapConfig = {rows, cols, numInitialWalkers, maxWalkersPerIter, spawnRatio, despawnRatio, maxWalkerDespawnPerIter};
  const walkerPrototype = new Walker(tlChance,trChance,dtChance,tbChance, Math.floor(cols/2), Math.floor(rows/2), directions.DOWN, squareRatio, tunnelRatio, tunnelMaxLength );;
  const generator = new MapGenerator(mapConfig, walkerPrototype);
  const mapGenerator = generator.generateMap();
  let result;
  map = mapGenerator.next().value.map;
  nextIter(mapGenerator);
  
 /* map = result.map;
  map.placeWalls();
  if(placeFinish)
    generator.colorWalkers(map, result.stats.walkers);*/
}

function draw() {
  background(51);

  for (let i = 0; i < map.table.length; i++) {
    for (let j = 0; j < map.table[0].length; j++) {
      const x = j * pixelSize;
      const y = i * pixelSize;
      fill(map.table[i][j]);
      noStroke();
      rect(x, y, pixelSize, pixelSize);
    }
  }
  if(showWalkers)
    for(const walker of walkers){
      fill(tiles.WALKER_END);
      noStroke();
      const x = walker._x * pixelSize;
      const y = walker._y * pixelSize;
      rect(x, y, pixelSize, pixelSize);
    }
}

