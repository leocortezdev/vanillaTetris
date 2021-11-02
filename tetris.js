const canvas = document.getElementById("tetris");
import Player from "./player.js";
import Arena from "./arena.js";
const context = canvas.getContext("2d");
let lastTime = 0;

const player = new Player();

const arena = new Arena(12, 20);

const colors = [
  null,
  "#800080",
  "#ffff00",
  "#ff7f00",
  "#0000ff",
  "#00ff00",
  "#ff0000",
];

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



const draw = () => {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena.matrix, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
};

const drawMatrix = (matrix, offset) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
};

const merge = (matrix, player) => {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
};


const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;
  player.update(deltaTime);
  draw();
  requestAnimationFrame(update);
};



document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "a") {
    player.move(-1);
  } else if (event.key === "ArrowRight" || event.key === "d") {
    player.move(1);
  } else if (event.key === "ArrowDown" || event.key === "s") {
    player.drop(1);
  } else if (event.key === "q") {
    player.rotate(-1);
  } else if (event.key === "e") {
    player.rotate(1);
  }
});

const updateScore = () => {
  document.getElementById("score").innerText = `Score: ${player.score}`;
};

player.reset();
updateScore();
update();
