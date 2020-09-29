
class MapGenerator{

  constructor(rows, cols, numInitialWalkers, walkerProtoype){
    this._rows = rows;
    this._cols = cols;
    this._numInitialWalkers = numInitialWalkers;
    this._walkerPrototype = walkerProtoype; 
  }

  generateMap(){
    const table = new Table(this._rows, this._cols); //TODO mover a otra clase
    const walkers = [];
    let newWalkers = [];

    const startingWalkers = this._numInitialWalkers >= 1 ? this._numInitialWalkers : 1;
    let direction = directions.DOWN;
    for(let i=0; i<startingWalkers; i++){
      //TODO prototype pattern with custom location
      const w = new Walker(table, tlChance,trChance,dtChance,tbChance, Math.floor(cols/2), Math.floor(rows/2), direction, squareRatio, tunnelRatio, tunnelMaxLength );
      walkers.push(w);
      if(initialWalkersInDifferentDirection)
        direction = turnRight(direction);
    }
   
    let i = 0;
    while(table.floors < maxFloors && i < maxIterations){
      i+=1;
      walkers.push(...newWalkers);
      newWalkers = [];
      for(const walker of walkers){
        if(table.floors < maxFloors)
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

      let despawned = 0;
      for(const walker of walkers){
        if(walkers.length < maxWalkers){
          const r = getRndInteger(0,100);
          if(r < despawnRatio && walkers.length > 2 && despawned < maxWalkerDespawnPerIter){
            walkers.splice(walkers.indexOf(walker),1);
            despawned += 1;
          }
        }
      }

    }
  
    if(placeFinish){
      for(const walker of walkers)
        table.placeFinish(walker._x, walker._y);
    }
  
    console.log("Finally: "+ (walkers.length + newWalkers.length));
    return table;
  }
}