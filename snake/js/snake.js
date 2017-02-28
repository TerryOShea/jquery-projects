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

class Snake {
  constructor() {
    this.direction = "N";
    this.segments = [[10,10]];
    this.addOns = 0;
    this.removedTail = null;
  }

  head() {
    return this.segments[this.segments.length - 1];
  }

  move() {
    // add new "head" to snake
    const d = dirDeltas[this.direction];
    let newHead = [...this.head()];
    newHead[0] += d[0];
    newHead[1] += d[1];
    this.segments.push(newHead);

    // remove snake's "tail" unless an apple has recently been hit
    if (this.addOns) {
      this.addOns--;
      this.removedTail = null;
    }
    else {
      this.removedTail = this.segments.shift();
    }
  }

  turn(newDir) {
    if (newDir !== oppositeDir[this.direction]) {
      this.direction = newDir;
    }
  }

  hasSnake(pos) {
    return this.segments.some(c => c[0] === pos[0] && c[1] === pos[1]);
  }
}

module.exports = Snake;
