# Nuclear Throne-like Map Generator
A 2D map generator similar to the one that Nuclear Throne uses. It's an extremely complex algorithm which... oh, wait... it's just a walker that moves randomly. You can try it here: https://danielbv.github.io/Nuclear-Throne-Map-Generator/

The website allows configuring multiple settings of the walkers: Percentage of changing direction, creating tunnels, map size, walker spawn/despawn percentage, etc.

The algorithm is based on the one in Wasteland Kings (a Nuclear Throne early version). Source: https://indienova.com/u/root/blogread/1766 (It isn't the original post, but it was deleted. You can also see it here. https://web.archive.org/web/20160313200825/https://www.vlambeer.com/2013/04/02/random-level-generation-in-wasteland-kings/)


## Known bugs
* The walker can end outside the map if it creates a tunnel in the last iteration and the number of floors has passed the limit.
  * Because the walker moves but doesn't place new floors.
* Animation delay has a minimum time because it's implemented with `setTimeout`.
* CSS. All of it. Me and CSS = Bleeding eyes.

## Features (that I'm not going to make)
* Adding chest/enemies to the map
* Zoom in/out
* Stats collection (max walkers in an iteration, number of walkers destroyed, number of walkers spawned, average tunnel size)