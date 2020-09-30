
class MapGenerator{

  constructor(rows, cols, numInitialWalkers, walkerProtoype, maxNewWalkersPerIter, spawnRatio, despawnRatio, maxWalkerDespawnPerIter){
    this._rows = rows;
    this._cols = cols;
    this._numInitialWalkers = numInitialWalkers;
    this._walkerPrototype = walkerProtoype; 
    this._maxWalkersPerIter = maxNewWalkersPerIter;
    this._spawnRatio = spawnRatio;
    this._despawnRatio = despawnRatio;
    this._maxWalkerDespawnPerIter = maxWalkerDespawnPerIter
  }

  generateMap(){
    const walkers = this._generateInitialWalkers()
    let newWalkers = [];

   
    const map = this._walkerPrototype._table; // TODO cutre fix para cuando haga el refactor de los walkers
    let i = 0;
    while(map.floors < maxFloors && i < maxIterations){
      i+=1;

      walkers.push(...newWalkers);

      for(const walker of walkers){
        if(map.floors < maxFloors)
          walker.walk();
      }

     newWalkers = this._generateNewWalkers(walkers);
     this._despawnWalkers(walkers);
    }
    console.log("Finally: "+ (walkers.length + newWalkers.length));
    return {map, stats:{walkers}};
  }

  
  _generateInitialWalkers(){
    const walkers = [];

    const startingWalkers = this._numInitialWalkers >= 1 ? this._numInitialWalkers : 1;
    let nextDirection = this._walkerPrototype._direction;
    for(let i=0; i<startingWalkers; i++){
      const w = this._walkerPrototype.clone();
      w.setDirection(nextDirection);
      walkers.push(w);
      if(initialWalkersInDifferentDirection)
        nextDirection = turnRight(w._direction);
    }
    return walkers;
  }

  _generateNewWalkers(walkers){
    const newWalkers = [];
    for(const walker of walkers){
      if((walkers.length + newWalkers.length) < maxWalkers){
        const r = getRndInteger(0,100);
        if(newWalkers.length < this._maxWalkersPerIter &&  r < this._spawnRatio){ 
          const newWalker = walker.clone();
          newWalker._direction = turnAround(walker._direction);
          newWalkers.push(newWalker);
        }
      }
    }

    return newWalkers;
  }

  _despawnWalkers(walkers){
    let despawned = 0;
      for(const walker of walkers){
        if(walkers.length < maxWalkers){
          const r = getRndInteger(0,100);
          if(r < this._despawnRatio && walkers.length > 2 
              && despawned < this._maxWalkerDespawnPerIter){ 
            walkers.splice(walkers.indexOf(walker),1);
            despawned += 1;
          }
        }
      }
  }

  colorWalkers(map, walkers){
    for(const walker of walkers)
      map.placeFinish(walker._x, walker._y);
  }
}