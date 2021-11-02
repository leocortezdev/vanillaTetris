class Player {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.matrix = null;
    this.score = 0;
    this.dropCounter = 0;
    this.dropInterval = 0;
  }

  _piece = (type) => {
    if (type === "T") {
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
    } else if (type === "O") {
      return [
        [2, 2],
        [2, 2],
      ];
    } else if (type === "L") {
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3],
      ];
    } else if (type === "J") {
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0],
      ];
    } else if (type === "I") {
      return [
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
      ];
    } else if (type === "S") {
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
      ];
    } else if (type === "Z") {
      return [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
      ];
    }
  }

  drop() {
    this.pos.y++;
    if (collide(arena, this)) {
      this.pos.y--;
      merge(arena.matrix, this);
      this.reset();
      arena.sweep();
      updateScore();
    }

    this.dropCounter = 0;
  }

  move(dir) {
    this.pos.x += dir;

    if (collide(arena, this)) {
      this.pos.x -= dir;
    }
  }

  reset() {
    const pieces = "ILJOTSZ";
    this.matrix = this._piece(pieces[(pieces.length * Math.random()) | 0]);
    this.pos.y = 0;
    this.pos.x =
      Math.floor(arena.matrix[0].length / 2) - Math.floor(this.matrix[0].length / 2);

    if (collide(arena.matrix, this)) {
      arena.matrix.forEach((row) => row.fill(0));
      this.score = 0;
      updateScore();
    }
  }

  rotate(dir) {
    const { x } = this.pos;
    let offset = 1;
    this._rotateMatrix(this.matrix, dir);
    while (collide(arena, this)) {
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length) {
        this._rotateMatrix(this.matrix, -dir);
        this.pos.x = x;
        return;
      }
    }
  }

  _rotateMatrix = (matrix, dir) => {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }
  
    if (dir > 0) {
      matrix.forEach((row) => row.reverse());
    } else {
      matrix.reverse();
    }
  }


  update(deltaTime) {
    this.dropCounter += deltaTime;

    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }
  }
}

export default Player;
