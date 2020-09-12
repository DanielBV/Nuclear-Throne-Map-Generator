let cols = 50;
let rows = 50;
let pixelSize = 25;

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

function make2Darray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
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
    this.table = make2Darray(cols, rows); //TODO refactor
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        this.table[i][j] = 0;
      }
    }
    
    this.floors = 0;
  }

  placeFloor(x,y){
    if(this.table[y][x]===0){
      this.table[y][x] = tiles.FLOOR;
      this.floors+=1;
    }
  }

  placeFinish(x,y){
    //this.table[y][x] = tiles.WALKER_END;    
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
    const table = new Table(cols, rows);
    const walkers = [];

    const maxWalkers = 50;
    const spawnRatio = 5;
    const despawnRatio = 1;

    console.log(table);
    const w = new Walker(table, 20,25,25,30, Math.floor(cols/2), Math.floor(cols/2), directions.DOWN);
    const w2 = new Walker(table, 20,25,25,30, Math.floor(cols/2), Math.floor(cols/2), directions.UP);
    const w3 = new Walker(table, 20,25,25,30, Math.floor(cols/2), Math.floor(cols/2), directions.RIGHT);
    const w4 = new Walker(table, 20,25,25,30, Math.floor(cols/2), Math.floor(cols/2), directions.LEFT);


    walkers.push(w);
    walkers.push(w2);
    walkers.push(w3);
    walkers.push(w4);
    let i = 0;
    while(table.floors < 150 && i < 200){
      i+=1;
      console.log(walkers.length);
      for(const walker of walkers){
        walker.walk();
      }

      for(const walker of walkers){
        if(walkers.length < maxWalkers){
          const r = getRndInteger(0,100);
          if(r < spawnRatio){
            const newWalker = new Walker(table, walker._rl, walker._rr, walker._nr, walker._ta, walker._x, walker._y, walker._direction);
            newWalker._direction = turnAround(walker._direction);
            walkers.push(newWalker);
            break;
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
  
    console.log("Finally: "+ walkers.length);
    return table;
  }
}

var map;
function setup() {
  tiles =  {
    FLOOR:color(255, 195, 77),
    WALKER_END: color(255, 0, 0)
  };
  const c = createCanvas(rows*pixelSize, cols*pixelSize);
  const generator = new MapGenerator();
  map = generator.generateMap();
  c.mouseClicked(canvasClicked);
}

function draw() {
  background(51);

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var x = j * pixelSize;
      var y = i * pixelSize;
      fill(map.table[i][j]);
      stroke(0);
      rect(x, y, pixelSize, pixelSize);
    }
  }
}
