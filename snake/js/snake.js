const dirDeltas = {
  "N": [-1, 0],
  "S": [1, 0],
  "E": [0, 1],
  "W": [0, -1]
};

const oppositeDir = {
  "N": "S",
  "E": "W",
  "S": "N",
  "W": "E"
};

class Snake{
  constructor(){
    this.direction = "N";
    this.segments = [[[10,10]]];
    this.addOns = 0;
  }

  head() {
    let lastSeg = this.segments[this.segments.length -1];
    if(lastSeg.length === 0) {
      let secondLast = this.segments[this.segments.length -2];
      return secondLast[secondLast.length -1];
    } else {
      return lastSeg[lastSeg.length-1];
    }
  }

  move(){
    const d = dirDeltas[this.direction];
    let newHead = [...this.head()];
    newHead[0] += d[0];
    newHead[1] += d[1];

    let lastSeg = this.segments[this.segments.length -1];
    lastSeg.push(newHead);

    if (this.addOns) {
      this.addOns--;
    }
    else {
      this.segments[0].shift();
      if(this.segments[0].length === 0) this.segments.shift();
    }
  }

  turn(newDir){
    if (newDir !== oppositeDir[this.direction]){
      this.segments.push([]);
      this.direction = newDir;
    }
  }

  snakeCoords() {
    let flatten = arr => arr.reduce((acc, val) => acc.concat(val), []);
    return flatten(this.segments);
  }

  hasSnake(pos) {
    return this.snakeCoords().some(c => c[0] === pos[0] && c[1] === pos[1]);
  }
}

module.exports = Snake;
