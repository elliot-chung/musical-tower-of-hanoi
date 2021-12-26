# The Musical Tower of Hanoi
## [Link to the Website](https://ec-2018.github.io/musical-tower-of-hanoi/)
  
  
## The Puzzle Itself
[The Tower of Hanoi](https://en.wikipedia.org/wiki/Tower_of_Hanoi) is a mathematical puzzle involving three towers and many disks. These disks are first arranged in a single tower such that every disk is smaller than the one underneath it. The objective of the puzzle is to move this tower to another positions in the same order while obeying three rules. 
1. Only a single disk may be moved at once
2. Only the top disk from any tower may be moved
3. Every disk must always smaller than the disk it sits on top of

## The 'Musical' Solve
The tower is solved recursively to achieve the optimal solve. Each piece has a note associated with it that play whenever it is moved. The top block is always a 'C' note and the subsequent blocks walk down the C major scale. 

## Tools
Built in React  
Midi sounds are thanks to @danigb's [soundfont-player](https://github.com/danigb/soundfont-player)

## Inspiration
I originally wanted to make this project based on [this](https://www.youtube.com/watch?v=PGuRmqpr6Oo) youtube video I watched a while back. 
[![Alt text](https://img.youtube.com/vi/PGuRmqpr6Oo/0.jpg)](https://www.youtube.com/watch?v=PGuRmqpr6OoD)

