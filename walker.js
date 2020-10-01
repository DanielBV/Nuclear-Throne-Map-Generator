'use strict'; 

class Walker{


  /**
   * 
   * @param {*} table 
   * @param {*} rlChance Rotate left chance
   * @param {*} rrChance Rotate right chance 
   * @param {*} nrChance No rotation chance
   * @param {*} taChance Turn around chance
   */
  constructor(rlChance, rrChance, nrChance, taChance, startX, startY, direction, squareRatio, tunnelRatio, tunnelMaxLength){
    this._rl = rlChance; 
    this._rr = rrChance;
    this._nr = nrChance;
    this._ta = taChance;
    this._x = startX;
    this._y = startY;
    this._direction = direction;
    this._squareRatio = squareRatio;
    this._tunnelRatio = tunnelRatio;
    this._tunnelMaxLength = tunnelMaxLength;

    if(rlChance + rrChance + nrChance + taChance !== 100)
      throw new Error("Invalid walker percentages: " + (rlChance + rrChance + nrChance + taChance) );
  }

 

  placeFloorInCurrentPosition(map){
    const doDouble = getRndInteger(0,100);
    if(doDouble < this._squareRatio){
      map.placeFloor(this._x, this._y);
      map.placeFloor(this._x+1, this._y);
      map.placeFloor(this._x, this._y+1);
      map.placeFloor(this._x+1, this._y+1);
    }else if(doDouble < (this._squareRatio + this._tunnelRatio)){
      const length = getRndInteger(1, this._tunnelMaxLength);
      map.placeFloor(this._x, this._y);
      for(const i of Array(length).keys()){
        this.moveInDirection(map);
        map.placeFloor(this._x, this._y);
      }
    }else{
      map.placeFloor(this._x, this._y);
    }
  }

  moveInDirection(map){
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
    // Leaves a one pixel border for the walls
    if(this._x + plusX >= 1 && this._x + plusX < map.cols-2)
      this._x += plusX;
    if(this._y + plusY >= 1 && this._y + plusY < map.rows-2)
      this._y += plusY;
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

  clone(){
    return new Walker(this._rl, this._rr, this._nr, this._ta, this._x, 
      this._y, this._direction, this._squareRatio, this._tunnelRatio, this._tunnelMaxLength);
  }

  setDirection(direction){
    this._direction = direction;
  }

} 

