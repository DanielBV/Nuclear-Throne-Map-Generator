'use strict'; 


let cols, rows;
let pixelSize = 20;
let spawnRatio,despawnRatio, maxWalkers, maxWalkersPerIter, maxWalkerDespawnPerIter, placeFinish, squareRatio,
  tunnelRatio, tunnelMaxLength, maxIterations, numInitialWalkers, initialWalkersInDifferentDirection, maxFloors;

let tlChance; // Turn left
let trChance; // Turn Right
let tbChance; // Turn back
let dtChance; // Don't turn

const inputTR = document.getElementById('iTurnRight');
const inputTL = document.getElementById('iTurnLeft');
const inputTB = document.getElementById('iTurnBack');
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
  //TODO debería de eliminar el que el walker contenga la tabla, porque lo hace todo muy acoplado y poco intuitivo
  // Porque 
  // a) Si la tabla se crea en MapGenerator, no puedo crear el prototipo aquí porque en el constructor de Walker
  //    se pinta de manera automática (y tampoco debería hacer eso)
  // b) Si saco la tabla afuera entonces generateMap() ya no es generateMap(), sino fillMap() y hay que pasarle un mapa.
        // Si se hace esto, se tendrían que cambiar el prototipo para que parta del mapa a rellenar, pero como pinta 
        // en el constructor, no se esta pintando en el nuevo mapa (diferencias entre la primera ejecución y el resto) 
  const table = new Map(rows, cols); //TODO mover a otro fichero
  // De momento voy a hacer esto porque no quiero ponerme ahora con el refactor de los walkers
  const mapConfig = {rows, cols, numInitialWalkers, maxWalkersPerIter, spawnRatio, despawnRatio, maxWalkerDespawnPerIter};
  const walkerPrototype = new Walker(table, tlChance,trChance,dtChance,tbChance, Math.floor(cols/2), Math.floor(rows/2), directions.DOWN, squareRatio, tunnelRatio, tunnelMaxLength );;
  const generator = new MapGenerator(mapConfig, walkerPrototype);
  const result = generator.generateMap();
  map = result.map;
  map.placeWalls();
  if(placeFinish)
    generator.colorWalkers(map, result.stats.walkers);
  c.mouseClicked(canvasClicked);
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

