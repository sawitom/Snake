function drawBoard() {
  for (let i = 0; i < dotsNumber; i++) {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "dot");
    newDiv.setAttribute("id", i);
    //const marker = document.createTextNode(i);
    //newDiv.appendChild(marker);

    const currentDiv = document.getElementById("board");
    currentDiv.appendChild(newDiv);
  }
}
function resetBoard() {}
function game() {
  timer = 0;
  score = 0;
  const gameState = {
    over: false,
    fruit: [false, null],

    get isOver() {
      return this.over;
    },
    set isOver(val) {
      if (!this.over && val) {
        clearInterval(snakeTimer);
        this.over = val;
        gameOver();
        //alert("GAME OVER");
        //console.log("GAME OVER");
      } else this.over = val;
    },

    get fruitId() {
      return this.fruit[1];
    },
    set fruitId(id) {
      if (this.fruit[0]) {
        if (id == null) {
          score++;
          this.fruit = [false, id];
          addFruit(this);
        } else alert("FRUIT ERROR #1"); //adding new id to existing fruit
      } else {
        if (id != null) this.fruit = [true, id];
        else alert("FRUIT ERROR #2"); //deleting non-existant fruit
      }
    },
  };
  recolor();
  addFruit(gameState);
  const snakeTimer = setInterval(() => {
    move(gameState);
  }, 500);
}
function move(gameState) {
  timer += 0.5;
  snakeIds.forEach(function (part, index) {
    if (isAboutToCrashWithSelf()) gameState.isOver = true;
    if (!gameState.isOver) {
      //console.log(gameState.isOver);
      //switching direction
      changeDirection(part, index);
      //moving
      if (
        (part.id % 20 == 19 && part.nextMove == "right") ||
        (part.id % 20 == 00 && part.nextMove == "left") ||
        (part.id >= 0 && part.id <= 19 && part.nextMove == "up") ||
        (part.id >= 380 && part.id <= 399 && part.nextMove == "down")
      ) {
        gameState.isOver = true;
      } else {
        removeColors();
        switch (part.nextMove) {
          case "right":
            this[index].id++;
            break;
          case "left":
            this[index].id--;
            break;
          case "up":
            this[index].id -= 20;
            break;
          case "down":
            this[index].id += 20;
            break;
        }

        if (index == 0 && part.id == gameState.fruitId) {
          gameState.fruitId = null;
          tailLengthen();
        }
        //recolor();
        //console.log("ruch");
      }
    } else if (isAboutToCrashWithSelf()) {
      const head = snakeIds[0];
      switch (head.nextMove) {
        case "right":
          head.id--;
          break;
        case "left":
          head.id++;
          break;
        case "up":
          head.id += 20;
          break;
        case "down":
          head.id -= 20;
          break;
      }
    }
    recolor();
  }, snakeIds);
  //colorAllBreakpoints();
}
function changeDirection(part, index) {
  breakPoints.forEach((bp) => {
    if (bp.id == part.id) {
      switch (bp.newDirection) {
        case "left":
          switch (part.nextMove) {
            case "right":
              part.nextMove = "up";
              break;
            case "left":
              part.nextMove = "down";
              break;
            case "up":
              part.nextMove = "left";
              break;
            case "down":
              part.nextMove = "right";
              break;
          }
          break;
        case "right":
          switch (part.nextMove) {
            case "right":
              part.nextMove = "down";
              break;
            case "left":
              part.nextMove = "up";
              break;
            case "up":
              part.nextMove = "right";
              break;
            case "down":
              part.nextMove = "left";
              break;
          }
          break;
      }
      // deleting used breakpoints
      if (index == snakeIds.length - 1) breakPoints.shift();
    }
  }, breakPoints);
}
function isAboutToCrashWithSelf() {
  const head = snakeIds[0];
  switch (head.nextMove) {
    case "right":
      for (let i = 1; i < snakeIds.length; i++)
        if (head.id == snakeIds[i].id) return true;
      return false;
    case "left":
      for (let i = 1; i < snakeIds.length - 1; i++)
        if (head.id == snakeIds[i].id) return true;
      return false;
    case "up":
      for (let i = 1; i < snakeIds.length - 1; i++)
        if (head.id == snakeIds[i].id) return true;
      return false;
    case "down":
      for (let i = 1; i < snakeIds.length - 1; i++)
        if (head.id == snakeIds[i].id) return true;
      return false;
  }
}
function addFruit(gameState) {
  const possibleIds = [];
  for (let i = 0; i < dotsNumber; i++) {
    if (!snakeIds.some((item) => item.id == i)) possibleIds.push(i);
  }
  const randomId = Math.floor(Math.random() * possibleIds.length);
  const newFruitId = possibleIds[randomId];
  document.getElementById(newFruitId).style.backgroundColor = "red";
  gameState.fruitId = newFruitId;
}
function tailLengthen() {
  const endDirection = snakeIds[snakeIds.length - 1].nextMove;
  const endId = snakeIds[snakeIds.length - 1].id;
  snakeIds.push({ id: endId, nextMove: endDirection });
}
function removeColors() {
  snakeIds.forEach((item) => {
    document.getElementById(item.id).style.backgroundColor = "";
  });
}
function recolor() {
  document.getElementById(snakeIds[0].id).style.backgroundColor = "green";
  for (let i = 1; i < snakeIds.length; i++) {
    document.getElementById(snakeIds[i].id).style.backgroundColor =
      "lightgreen";
  }
}
//function used to debug breakpoints
function colorAllBreakpoints() {
  breakPoints.forEach((bp) => {
    document.getElementById(bp.id).style.backgroundColor = "orange";
  });
}
function createBreakPointLeft() {
  if (!breakPoints.some((bp) => bp.id == snakeIds[0].id)) {
    let bpoint = {
      id: snakeIds[0].id,
      newDirection: "left",
    };
    breakPoints.push(bpoint);
  } else {
    const indexToChange = breakPoints
      .map((item) => item.id)
      .indexOf(snakeIds[0].id);
    breakPoints[indexToChange].newDirection = "left";
    console.log(breakPoints[indexToChange].newDirection);
  }
}
function createBreakPointRight() {
  if (!breakPoints.some((bp) => bp.id == snakeIds[0].id)) {
    let bpoint = {
      id: snakeIds[0].id,
      newDirection: "right",
    };
    breakPoints.push(bpoint);
  } else {
    const indexToChange = breakPoints
      .map((item) => item.id)
      .indexOf(snakeIds[0].id);
    breakPoints[indexToChange].newDirection = "right";
    console.log(breakPoints[indexToChange].newDirection);
  }
}
function gameOver() {
  const points = document.getElementById("points");
  const time = document.getElementById("time");
  points.innerHTML = `You earned ${score} points.`;
  time.innerHTML = `Play time: ${String(timer).replace(".", ",")} seconds.`;
  const board = document.getElementById("board");
  const gameOver = document.getElementById("gameOver");
  board.style.animation = "addBlur 1s ease 0s 1 forwards";
  leftButton.style.animation = "addBlur 1s ease 0s 1 forwards";
  rightButton.style.animation = "addBlur 1s ease 0s 1 forwards";
  gameOver.style.animation = "slideBackIn 0s ease 0s 1 forwards";
  gameOver.style.display = "grid";
  setTimeout(showInfo, 500);
}
function hideSnakeAndFruit() {
  for (let i = 0; i < dotsNumber; i++) {
    const current = document.getElementById(i);
    if (current.style.backgroundColor != "") {
      current.style.animation = "hideItem 1s ease";
      setTimeout(() => {
        current.style.removeProperty("background-color");
        current.style.removeProperty("animation");
      }, 1000);
    }
  }
}
function setNewSnake() {
  snakeIds = [
    { id: 210, nextMove: "right" },
    { id: 209, nextMove: "right" },
    { id: 208, nextMove: "right" },
  ];
}

const info = document.getElementById("info");
function hideInfo() {
  const board = document.getElementById("board");
  info.style.animation = "slideOut 0.5s ease 0s 1 forwards";
  board.style.animation = "removeBlur 0.25s ease 0.75s 1 forwards";
  leftButton.style.animation = "removeBlur 0.25s ease 0.75s 1 forwards";
  rightButton.style.animation = "removeBlur 0.25s ease 0.75s 1 forwards";
  leftButton.style.pointerEvents = "auto";
  rightButton.style.pointerEvents = "auto";
}
function showInfo() {
  info.style.animation = "slideIn 0.5s ease 0s 1 forwards";
}

const playButton = document.getElementById("play");
const restartButton = document.getElementById("restart");
const menuButton = document.getElementById("menu");
playButton.addEventListener("click", () => {
  hideInfo();
  hideSnakeAndFruit();
  setNewSnake();
  recolor();
  setTimeout(game, 1500);
});
restartButton.addEventListener("click", () => {
  hideInfo();
  hideSnakeAndFruit();
  setNewSnake();
  recolor();
  setTimeout(game, 1500);
});
menuButton.addEventListener("click", () => {
  document.getElementById("gameOver").style.animation =
    "slideOut 0.5s ease 0s 1 forwards";
});
const dotsNumber = 400;
let snakeIds;
const breakPoints = [];
//adding left/right button functionality
const leftButton = document.getElementById("goLeft");
leftButton.addEventListener("click", createBreakPointLeft);
const rightButton = document.getElementById("goRight");
rightButton.addEventListener("click", createBreakPointRight);
//adding arrow keys functionality
document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37:
      createBreakPointLeft();
      break;
    case 39:
      createBreakPointRight();
      break;
  }
};
let timer;
let score;
showInfo();
drawBoard();
