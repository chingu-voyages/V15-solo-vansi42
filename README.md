# MyJong - Classic Mahjong Solitaire Game

## What is it about?
Mahjong is a traditional chinese game combining strategy, patience, spatial cognintion and luck.
The solitaire Mahjong uses the same tiles, but has totally different rules.

You can read more about it here: https://en.wikipedia.org/wiki/Mahjong_solitaire

And you can play it online here: https://myjong.herokuapp.com/

## Rules of the game
There are 144 tiles on the board. 

The types of tiles are:
- Charachters: 1 to 9. Match is the exact same tile.
- Dots: 1 to 9. Match is the exact same tile.
- Bamboo: 1 to 9. Match is the exact same tile.
- The four seasons. Match can be any two of the seasons.
- The four flowers (Plum blossom, Orchid, Chrysantemum aka MUM, Bamboo). Match can be any two of the flowers.
- The three dragons (red, blue, green). Match is the exact same tile.
- The four Winds. Match is the exact same tile.

In each turn, player removes a pair of tiles. 

You can remove a tile only if at least one of its sides is free and there are no tiles covering it.

Player wins when all of them are removed.

### Attention: Not all games are winnable!

## Main Structure: The Board
An object containing all the tiles. 

The keys are the coordinates [Layer, Row, Position]. Other attributes for the tiles are: 
- The picture on the tile (Not yet implemented)
- Is it available for removal?
- Is it already removed?

Also the board contains a "stack" which saves all the tiles removed by order. It is used for the "Undo" functionality.

## Plans for the future
- Add nice graphics
- Make it responsive
- Add a "hint" button
- Add autoplay
- High scores table
- Add a message whenever there are no more moves available


Please feel free to contact me if you have any questions, remarks or a craving for noodles soup! 🍲