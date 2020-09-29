
class MapGenerator{

  constructor(rows, cols, numInitialWalkers, walkerProtoype){
    this._rows = rows;
    this._cols = cols;
    this._numInitialWalkers = numInitialWalkers;
    this._walkerPrototype = walkerProtoype; 
  }

  generateMap(){
    const walkers = [];
    let newWalkers = [];

    const startingWalkers = this._numInitialWalkers >= 1 ? this._numInitialWalkers : 1;
    console.log( this._walkerPrototype);
    let nextDirection = this._walkerPrototype._direction;
    for(let i=0; i<startingWalkers; i++){
      //TODO prototype pattern with custom location
      const w = this._walkerPrototype.clone();
      w.setDirection(nextDirection);
      walkers.push(w);
      if(initialWalkersInDifferentDirection)
        nextDirection = turnRight(w._direction);
    }
   
    const table = this._walkerPrototype._table; // TODO cutre fix para cuando haga el refactor de los walkers
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
            const newWalker = walker.clone();
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