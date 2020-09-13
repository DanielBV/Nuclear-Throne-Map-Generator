let cols = 50;
let rows = 50;
let pixelSize = 20;
let spawnRatio,despawnRatio, maxWalkers, maxWalkersPerIter;


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
const inputMaxWalkersPerIter = document.getElementById('iMaxWalkersPerIter')

function loadForm(){
  tlChance = parseInt(inputTL.value);
  trChance = parseInt(inputTR.value);
  tbChance = parseInt(inputTB.value);
  dtChance = 100 - tlChance - trChance - tbChance;
  maxWalkers = parseInt(inputMW.value);
  spawnRatio = parseInt(inputWalkerSpawn.value);
  despawnRatio = parseInt(inputWalkerDespawn.value);
  maxWalkersPerIter = parseInt(inputMaxWalkersPerIter.value);
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

/**
 * This "abstraction" is just in case I decide to reverse the table
 * @param {*} table 
 * @param {*} x 
 * @param {*} y 
 * @param {*} color 
 */

 
class Table{
  constructor(rows, cols){
    this.rows = rows;
    this.cols = cols;
    this.table = make2Darray(rows, cols); //TODO refactor
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.table[i][j] = 0;
      }
    }
    
    this.floors = 0;
  }

  placeFloor(x,y){
    if(!this.isFloor(x,y)){
      this.table[y][x] = tiles.FLOOR;
      this.floors+=1;
    }
  }

  placeFinish(x,y){
    //this.table[y][x] = tiles.WALKER_END;    
  }

  isFloor(x,y){
    return this.table[y][x]===tiles.FLOOR;
  }

  placeWalls(){
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if( this.isFloor(x,y)){
          if((x-1) >= 0 && !this.isFloor(x-1,y))
            this.table[y][x-1] = tiles.WALL;
          if((y-1) >= 0 && !this.isFloor(x,y-1))
            this.table[y-1][x] = tiles.WALL; 
          if((y+1) < this.rows && !this.isFloor(x,y+1))
            this.table[y+1][x] = tiles.WALL; 
          if((x+1) < this.cols && !this.isFloor(x+1,y))
            this.table[y][x+1] = tiles.WALL;
        }
      }
    }
  }
}
class Walker{


  /**
   * 
   * @param {*} table 
   * @param {*} rlChance Rotate left chance
   * @param {*} rrChance Rotate right chance 
   * @param {*} nrChance No rotation chance
   * @param {*} taChance Turn around chance
   */
  constructor(table, rlChance, rrChance, nrChance, taChance, startX, startY, direction){
    this._table = table;
    this._rl = rlChance;
    this._rr = rrChance;
    this._nr = nrChance;
    this._ta = taChance;
    this._x = startX;
    this._y = startY;
    this._direction = direction;
    table.placeFloor(this._x, this._y);
    if(rlChance + rrChance + nrChance + taChance !== 100)
      throw new Error("Invalid walker percentages: " + (rlChance + rrChance + nrChance + taChance) );
  }

  walk(){
    let plusX = 0;
    let plusY = 0;
    switch(this._direction){
      case directions.LEFT:
        plusX = -1;
        break;
      case directions.RIGHT:
        plusX = +1;
        break;
      case directions.UP:
        plusY = -1;
        break;
      case directions.DOWN:
        plusY = +1;
        break;
    }
    //TODO checkear que no se sale de límites
    // Leaves a one pixel border for the walls
    if(this._x + plusX > 1 && this._x + plusX < this._table.cols-2)
      this._x += plusX;
    if(this._y + plusY > 1 && this._y + plusY < this._table.rows-2)
      this._y += plusY;
    
   
    const doDouble = getRndInteger(0,100);
    if(doDouble > 90){
      this._table.placeFloor(this._x, this._y);
      this._table.placeFloor(this._x+1, this._y);
      this._table.placeFloor(this._x, this._y+1);
      this._table.placeFloor(this._x+1, this._y+1);
    }else{
      this._table.placeFloor(this._x, this._y);
    }
    this.renewDirection();
  }

  renewDirection(){
    const option = getRndInteger(0,100);
    if(option < this._rl-1 )
      this._direction = turnRight(this._direction);
    else if(option < this._rl + this._rr -1)
      this._direction = turnLeft(this._direction);
    else if(option < this._rl + this._rr + this._nr -1)
      return
    else 
      this._direction = turnAround(this._direction);


  }

} 

function canvasClicked() {
  console.log(mouseX, mouseY);
  const x = Math.floor(mouseX/pixelSize);
  const y = Math.floor(mouseY/pixelSize);
  map.table[y][x]=200;
}



class MapGenerator{
  constructor(){
  }

  generateMap(){
    const table = new Table(rows, cols);
    const walkers = [];
    let newWalkers = [];

    const w = new Walker(table, tlChance,trChance,dtChance,tbChance, Math.floor(cols/2), Math.floor(rows/2), directions.DOWN);
    const w2 = new Walker(table,tlChance,trChance,dtChance,tbChance, Math.floor(cols/2), Math.floor(rows/2), directions.UP);
    const w3 = new Walker(table,tlChance,trChance,dtChance,tbChance, Math.floor(cols/2), Math.floor(rows/2), directions.RIGHT);
    const w4 = new Walker(table,tlChance,trChance,dtChance,tbChance, Math.floor(cols/2), Math.floor(rows/2), directions.LEFT);


    walkers.push(w);
    walkers.push(w2);
    walkers.push(w3);
    walkers.push(w4);
    let i = 0;
    while(table.floors < 150 && i < 200){
      i+=1;
      walkers.push(...newWalkers);
      console.log(newWalkers.length);
      newWalkers = [];
      for(const walker of walkers){
        walker.walk();
      }

      for(const walker of walkers){
        if((walkers.length + newWalkers.length) < maxWalkers){
          const r = getRndInteger(0,100);
          if(newWalkers.length < maxWalkersPerIter &&  r < spawnRatio){
            const newWalker = new Walker(table, walker._rl, walker._rr, walker._nr, walker._ta, walker._x, walker._y, walker._direction);
            newWalker._direction = turnAround(walker._direction);
            newWalkers.push(newWalker);
          }
        }
      }

      for(const walker of walkers){
        if(walkers.length < maxWalkers){
          const r = getRndInteger(0,100);
          if(r < despawnRatio && walkers.length > 2){
            walkers.splice(walkers.indexOf(walker),1);
            break;
          }
        }
      }

    }

    for(const walker of walkers)
      table.placeFinish(walker._x, walker._y);
  
    console.log("Finally: "+ (walkers.length + newWalkers.length));
    return table;
  }
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
  const generator = new MapGenerator();
  map = generator.generateMap();
  map.placeWalls();
  c.mouseClicked(canvasClicked);
}

function draw() {
  background(51);

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var x = j * pixelSize;
      var y = i * pixelSize;
      fill(map.table[i][j]);
      noStroke();
      rect(x, y, pixelSize, pixelSize);
    }
  }
}

