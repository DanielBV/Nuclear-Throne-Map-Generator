'use strict'; 


let cols, rows;
let pixelSize = 15;
let spawnRatio,despawnRatio, maxWalkers, maxWalkersPerIter, maxWalkerDespawnPerIter, placeFinish, squareRatio,
  tunnelRatio, tunnelMaxLength, maxIterations, numInitialWalkers, initialWalkersInDifferentDirection, maxFloors;

let tlChance; // Turn left
let trChance; // Turn Right
let tbChance; // Turn back
let dtChance; // Don't turn

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

inputTR.oninput = function(){
  updatePercentage();
}

inputTL.oninput = function(){
  updatePercentage();
}

inputTB.oninput = function(){
  updatePercentage();
}


updatePercentage();

function updatePercentage(){
  tlChance = parseInt(inputTL.value);
  trChance = parseInt(inputTR.value);
  tbChance = parseInt(inputTB.value);

  const forwardChance = 100 - tlChance - trChance - tbChance
  if(isNaN(tlChance) || isNaN(trChance) || isNaN(tbChance) || forwardChance < 0 || tlChance < 0 || trChance < 0 || tbChance < 0 ){
    inputForward.value = "ERROR";
    inputForward.classList.add("text-danger");
    inputGenerateBtn.disabled = true;
  }else{
    inputForward.value = forwardChance;
    inputForward.classList.remove("text-danger");
    inputGenerateBtn.disabled = false;
  }

  
}

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
  //TODO esto grita unit tests
  return (direction+1)%4;
}

function turnLeft(direction){
  return (direction-1)%4;
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




var map;
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

function createMap(){
  const mapConfig = {rows, cols, numInitialWalkers, maxWalkersPerIter, spawnRatio, despawnRatio, maxWalkerDespawnPerIter};
  const walkerPrototype = new Walker(tlChance,trChance,dtChance,tbChance, Math.floor(cols/2), Math.floor(rows/2), directions.DOWN, squareRatio, tunnelRatio, tunnelMaxLength );;
  const generator = new MapGenerator(mapConfig, walkerPrototype);
  const result = generator.generateMap();
  map = result.map;
  map.placeWalls();
  if(placeFinish)
    generator.colorWalkers(map, result.stats.walkers);
}

function draw() {
  background(51);

  for (var i = 0; i < map.table.length; i++) {
    for (var j = 0; j < map.table[0].length; j++) {
      var x = j * pixelSize;
      var y = i * pixelSize;
      fill(map.table[i][j]);
      noStroke();
      rect(x, y, pixelSize, pixelSize);
    }
  }
}

