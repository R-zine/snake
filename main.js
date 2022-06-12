let lastRender = 0;
let SNAKE_SPEED = localStorage.getItem("speed");
if (!SNAKE_SPEED) SNAKE_SPEED = 7;
const BODY = [{ x: 11, y: 11 }];
let APPLE = rndApple();
let GROWTH = localStorage.getItem("growth");
if (!GROWTH) GROWTH = 3;
let newParts = 0;
const BOARD = document.querySelector(".game");
let gameOver = false;
let count = 0;

const MENU = document.querySelector(".pause");
const SETTINGS = document.querySelector(".settings");

const END = document.querySelector(".end");

const SCORE = document.querySelector(".score");
const HI = document.querySelector(".highscore");
let highscore = localStorage.getItem("score");
if (!highscore) highscore = 0;

// Menu buttons

const SPEED_BTNS = document.querySelectorAll(".speedbtn");
const MUTATE = document.getElementById("grow");
const MODE = document.getElementById("mode");

window.addEventListener("DOMContentLoaded", () => {
  localStorage.getItem("mode") == "dark"
    ? document.body.classList.add("dark")
    : document.body.classList.remove("dark");
});

SPEED_BTNS.forEach((x) =>
  x.addEventListener("change", (e) => (SNAKE_SPEED = e.target.id))
);

SPEED_BTNS.forEach((x) =>
  x.id == SNAKE_SPEED ? (x.checked = true) : (x.checked = false)
);

MUTATE.addEventListener("change", (e) => {
  if (e.target.checked) GROWTH = 7;
  else GROWTH = 3;
  MUTATE.blur();
});

GROWTH == 7 ? (MUTATE.checked = true) : (MUTATE.checked = false);

MODE.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.contains("dark")
    ? localStorage.setItem("mode", "dark")
    : localStorage.setItem("mode", "light");
  MODE.blur();
});

// Changing direction

let direction = { x: 0, y: 0 };
let lastInput = { x: 0, y: 0 };

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (lastInput.y !== 0) break;
      direction = { x: 0, y: -1 };
      break;
    case "w":
      if (lastInput.y !== 0) break;
      direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (lastInput.y !== 0) break;
      direction = { x: 0, y: 1 };
      break;
    case "s":
      if (lastInput.y !== 0) break;
      direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (lastInput.x !== 0) break;
      direction = { x: -1, y: 0 };
      break;
    case "a":
      if (lastInput.x !== 0) break;
      direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (lastInput.x !== 0) break;
      direction = { x: 1, y: 0 };
      break;
    case "d":
      if (lastInput.x !== 0) break;
      direction = { x: 1, y: 0 };
      break;
  }
  lastInput = direction;
});

// Drawing the snake

function draw(BOARD) {
  BOARD.innerHTML = "";
  BODY.forEach((part) => {
    const element = document.createElement("div");
    element.style.gridRowStart = part.y;
    element.style.gridColumnStart = part.x;
    element.classList.add("snake");
    BOARD.appendChild(element);
  });
}

// Drawing the apple

function drawApple(BOARD) {
  const currentApple = document.createElement("div");
  currentApple.style.gridRowStart = APPLE.y;
  currentApple.style.gridColumnStart = APPLE.x;
  currentApple.classList.add("apple");
  BOARD.appendChild(currentApple);
}

// Updating the snake

function update() {
  addParts();
  for (let i = BODY.length - 2; i >= 0; i--) {
    BODY[i + 1] = { ...BODY[i] };
  }

  BODY[0].x += direction.x;
  BODY[0].y += direction.y;
  checkDeath();
}

function out() {
  return BODY[0].x < 1 || BODY[0].y < 1 || BODY[0].x > 21 || BODY[0].y > 21;
}

function snakeItself() {
  let check = false;
  for (let k = 1; k < BODY.length; k++)
    if (equalPos(BODY[k], BODY[0])) check = true;
  return check;
}

function checkDeath() {
  gameOver = out() || snakeItself();
}

// Growing the snake

function grow(growth) {
  newParts += growth;
}

function equalPos(pos0, pos1) {
  return pos0.x === pos1.x && pos0.y === pos1.y;
}

function eat(APPLE) {
  return BODY.some((x) => equalPos(x, APPLE));
}

function addParts() {
  for (let j = 0; j < newParts; j++) {
    BODY.push(BODY[BODY.length - 1]);
  }
  newParts = 0;
}

//Updating the food

function updateApple() {
  if (eat(APPLE)) {
    grow(GROWTH);
    APPLE = rndApple();
    count++;
    SCORE.innerHTML = `<h2>Score: ${count * SNAKE_SPEED}</h2>`;
  }
}

function rndApple() {
  let newApple;
  while (newApple == null || eat(newApple)) {
    newApple = rndPos();
  }
  return newApple;
}

function rndPos() {
  return {
    x: Math.floor(Math.random() * 21) + 1,
    y: Math.floor(Math.random() * 21) + 1,
  };
}

// Refreshing and snake speed

function main(time) {
  if (gameOver) {
    if (count * SNAKE_SPEED > highscore) {
      localStorage.setItem("score", "" + count * SNAKE_SPEED);
    }
    END.classList.add("visible");
    window.addEventListener("keydown", () => location.reload());
    return;
  }
  window.requestAnimationFrame(main);
  const secondsExpired = (time - lastRender) / 1000;
  if (secondsExpired < 1 / SNAKE_SPEED) return;

  lastRender = time;

  update();
  updateApple();
  draw(BOARD);
  drawApple(BOARD);
}

window.requestAnimationFrame(main);

// Menu

function menu() {
  document.body.onkeyup = function (e) {
    if (e.key == " " || e.code == "Space") {
      direction = { x: 0, y: 1 };
      MENU.classList.remove("visible");
      SETTINGS.classList.remove("visible");
      localStorage.setItem("speed", `${SNAKE_SPEED}`);
      localStorage.setItem("growth", `${GROWTH}`);
    }
    if (e.key == "m" || e.key == "M") {
      MENU.classList.remove("visible");
      SETTINGS.classList.add("visible");
    }
    if (e.key == "Escape") {
      MENU.classList.add("visible");
      SETTINGS.classList.remove("visible");
    }
  };
}

menu();

// Highscore update

window.addEventListener("load", () => {
  HI.innerHTML = `<h2>Highscore: ${highscore}</h2>`;
});
