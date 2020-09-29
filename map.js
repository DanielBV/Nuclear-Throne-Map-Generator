
class Map{
  constructor(rows, cols){
    this.rows = rows;
    this.cols = cols;
    this.table = make2Darray(rows, cols); 
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
// Refactor para poner primero los muros y después colorear los walkers.
  placeFinish(x,y){
    this.table[y][x] = tiles.WALKER_END;    
  }

  isFloor(x,y){
    return this.table[y][x]===tiles.FLOOR || this.table[y][x]===tiles.WALKER_END;
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