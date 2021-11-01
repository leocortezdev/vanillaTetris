const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

context.scale(20, 20);

const collide = (arena, player) => {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
};

const createMatrix = (w, h) => {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
};

const playerMove = (dir) => {
  player.pos.x += dir;

  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
};

const rotate = (matrix, dir) => {
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
};

const draw = () => {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
};

const drawMatrix = (matrix, offset) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = "red";
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
};

const merge = (arena, player) => {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
};

const playerRotate = (dir) => {
  const { x } = player.pos;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = x;
      return;
    }
  }
};

const createPiece = (type) => {
  if (type === "T") {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === "O") {
    return [
      [1, 1],
      [1, 1],
    ];
  } else if (type === "L") {
    return [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ];
  } else if (type === "J") {
    return [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ];
  } else if (type === "I") {
    return [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ];
  } else if (type === "S") {
    return [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ];
  } else if (type === "Z") {
    return [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ];
  }
};

const playerReset = () => {
  const pieces = "ILJOTSZ";
  player.matrix = createPiece(
    pieces[pieces.length * Math.random() | 0]
  );
  player.pos.y = 0;
  player.pos.x =
    Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);

    if(collide(arena, player)) {
        arena.forEach(row => row.fill(0));
    }
};

const playerDrop = () => {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
  }

  dropCounter = 0;
};

const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
};

const arena = createMatrix(12, 20);
console.log(arena);

const player = {
  pos: { x: 5, y: 5 },
  matrix: createPiece('T'),
};

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "a") {
    playerMove(-1);
  } else if (event.key === "ArrowRight" || event.key === "d") {
    playerMove(1);
  } else if (event.key === "ArrowDown" || event.key === "s") {
    playerDrop(1);
  } else if (event.key === "q") {
    playerRotate(-1);
  } else if (event.key === "e") {
    playerRotate(1);
  }
});

update();
