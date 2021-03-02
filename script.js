function drawBoard() {
  for (let i = 0; i < dotsNumber; i++) {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "dot");
    newDiv.setAttribute("id", i);

    const currentDiv = document.getElementById("board");
    currentDiv.appendChild(newDiv);
  }
}
//function resetBoard() {}
function game() {
  breakPoints = [];
  score = 0;
  const intervalTime = chooseDifficulty();
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
          // document.getElementById(this.fruit[1]).className = "dot";
          addFruit(this);
        } else alert("FRUIT ERROR #1"); //adding new id to existing fruit
      } else {
        if (id != null) this.fruit = [true, id];
        else alert("FRUIT ERROR #2"); //deleting non-existant fruit
      }
    },
  };
  snakeIds.forEach((part, index) => recolor(part, index));
  addFruit(gameState);
  const snakeTimer = setInterval(() => {
    move(gameState);
  }, intervalTime);
}
function move(gameState) {
  if (isAboutToCrashWithSelf()) gameState.isOver = true;
  let fruitEaten = false;
  snakeIds.forEach(function (part, index) {
    if (!gameState.isOver) {
      //switching direction
      changeDirection(part, index);
      removeColors(part); //dotąd git
      //moving
      if (
        (part.id % 20 == 19 && part.nextMove == "right") ||
        (part.id % 20 == 00 && part.nextMove == "left") ||
        (part.id >= 0 && part.id <= 19 && part.nextMove == "up") ||
        (part.id >= 380 && part.id <= 399 && part.nextMove == "down")
      ) {
        gameState.isOver = true;
      } else {
        switch (part.nextMove) {
          case "right":
            part.id++;
            break;
          case "left":
            part.id--;
            break;
          case "up":
            part.id -= 20;
            break;
          case "down":
            part.id += 20;
            break;
        }
        if (index == 0 && part.id == gameState.fruitId) {
          document.getElementById(gameState.fruitId).classList.remove("fruit");
          gameState.fruitId = null;
          tailLengthen();
          fruitEaten = true;
        }
      }
    }
    setBreakPointIndex(part);
    recolor(part, index);
  }, snakeIds);
  //recolor tail if fruit was eaten this iteration
  if (fruitEaten) {
    recolor(snakeIds[snakeIds.length - 1], snakeIds.length - 1);
    fruitEaten = false;
  }
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
      if (index === snakeIds.length - 1) breakPoints.shift();
    }
  }, breakPoints);
}
function setBreakPointIndex(snakeElement) {
  if (breakPoints.length > 0) {
    for (let i = 0; i < breakPoints.length; i++) {
      if (breakPoints[i].id === snakeElement.id) {
        snakeElement.breakPointIndex = i;
        break;
      } else snakeElement.breakPointIndex = null;
    }
  } else {
    snakeElement.breakPointIndex = null;
  }
}
function isAboutToCrashWithSelf() {
  const head = snakeIds[0];
  switch (head.nextMove) {
    case "right":
      for (let i = 1; i < snakeIds.length - 1; i++)
        if (head.id + 1 === snakeIds[i].id) return true;
      return false;
    case "left":
      for (let i = 1; i < snakeIds.length - 1; i++)
        if (head.id - 1 === snakeIds[i].id) return true;
      return false;
    case "up":
      for (let i = 1; i < snakeIds.length - 1; i++)
        if (head.id - 20 === snakeIds[i].id) return true;
      return false;
    case "down":
      for (let i = 1; i < snakeIds.length - 1; i++)
        if (head.id + 20 === snakeIds[i].id) return true;
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
  document.getElementById(newFruitId).className = "fruit";
  gameState.fruitId = newFruitId;
}
function tailLengthen() {
  const endDirection = snakeIds[snakeIds.length - 1].nextMove;
  const endBpIndex = snakeIds[snakeIds.length - 1].breakPointIndex;
  const endId = snakeIds[snakeIds.length - 1].id;
  snakeIds.push({
    id: endId,
    breakPointIndex: endBpIndex,
    nextMove: endDirection,
  });
}
function removeColors(part) {
  if (part.id === snakeIds[0].id) return;
  else document.getElementById(part.id).className = "dot";
}
function recolor(part, index) {
  if (index === 0) {
    //head
    document.getElementById(part.id).className = "dot head" + part.nextMove;
  } else if (index === snakeIds.length - 1) {
    //tail
    let newClass;
    if (part.breakPointIndex !== null) {
      newClass = "dot tail" + snakeIds[index - 1].nextMove;
    } else {
      newClass = "dot tail" + part.nextMove;
    }
    document.getElementById(part.id).className = newClass;
  } else {
    //body
    let newClass;
    if (part.breakPointIndex !== null) {
      newClass =
        "dot curve" +
        part.nextMove +
        breakPoints[part.breakPointIndex].newDirection;
    } else {
      newClass = "body" + part.nextMove;
    }
    document.getElementById(part.id).className = newClass;
  }
}
function chooseDifficulty() {
  let difficulty = document.querySelector("input[name='diff']:checked").value;
  if (difficulty === "custom") {
    difficulty = document.querySelector("input[name='customInput']").value;
  }
  return 1000 / difficulty;
}
//function used to debug breakpoints
function colorAllBreakpoints() {
  breakPoints.forEach((bp) => {
    document.getElementById(bp.id).className = "breakPoint";
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
  }
}
function gameOver() {
  //disable pointer events
  leftButton.style.pointerEvents = "none";
  rightButton.style.pointerEvents = "none";
  //show results
  const points = document.getElementById("points");
  const difficultyInfo = document.getElementById("difficulty-info");
  score == 1
    ? (points.innerHTML = `Score: ${score} point`)
    : (points.innerHTML = `Score: ${score} points`);
  difficultyInfo.innerHTML = `Difficulty: ${getDifficultyInfo()}`;
  const board = document.getElementById("board");
  const gameOver = document.getElementById("gameOver");
  board.style.animation = "darken 1s ease 0s 1 forwards";
  leftButton.style.animation = "darken 1s ease 0s 1 forwards";
  rightButton.style.animation = "darken 1s ease 0s 1 forwards";
  gameOver.style.animation = "slideBackIn 0s ease 0s 1 forwards";
  gameOver.style.display = "grid";
  setTimeout(showInfo, 500);
}
function getDifficultyInfo() {
  let difficulty = document.querySelector("input[name='diff']:checked").value;
  let difficultyInfo;
  switch (difficulty) {
    case "1":
      difficultyInfo = "Easy";
      break;
    case "2":
      difficultyInfo = "Medium";
      break;
    case "5":
      difficultyInfo = "Hard";
      break;
    case "custom":
      difficultyInfo = "Custom";
      break;
    default:
      difficultyInfo = "Unable to get diificulty level";
  }
  return difficultyInfo;
}
function hideSnakeAndFruit() {
  for (let i = 0; i < dotsNumber; i++) {
    const current = document.getElementById(i);
    if (current.style.className != "dot") {
      current.className = "dot";
    }
  }
}
function setNewSnake() {
  snakeIds = [
    { id: 210, breakPointIndex: null, nextMove: "right" },
    { id: 209, breakPointIndex: null, nextMove: "right" },
    { id: 208, breakPointIndex: null, nextMove: "right" },
  ];
}

const info = document.getElementById("info");
function hideInfo() {
  const board = document.getElementById("board");
  info.style.animation = "slideOut 0.5s ease 0s 1 forwards";
  board.style.animation = "lighten 0.5s ease 0s 1 forwards";
  leftButton.style.animation = "lighten 0.5s ease 0s 1 forwards";
  rightButton.style.animation = "lighten 0.5s ease 0s 1 forwards";
  leftButton.style.pointerEvents = "auto";
  rightButton.style.pointerEvents = "auto";
}
function showInfo() {
  info.style.animation = "slideIn 0.5s ease 0s 1 forwards";
}

const playButton = document.getElementById("play");
const restartButton = document.getElementById("restart");
const menuButton = document.getElementById("menu");
const customValueInput = document.getElementById("customValueInput");
playButton.addEventListener("click", () => {
  hideInfo();
  hideSnakeAndFruit();
  setNewSnake();
  snakeIds.forEach((part, index) => recolor(part, index));
  setTimeout(game, 1500);
});
restartButton.addEventListener("click", () => {
  hideInfo();
  hideSnakeAndFruit();
  setNewSnake();
  snakeIds.forEach((part, index) => recolor(part, index));
  setTimeout(game, 1500);
});
menuButton.addEventListener("click", () => {
  document.getElementById("gameOver").style.animation =
    "slideOut 0.5s ease 0s 1 forwards";
});
customValueInput.addEventListener("click", () => {
  document.getElementById("custom").checked = "true";
});
const dotsNumber = 400;
let snakeIds;
let breakPoints;
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
    case 32: //space
      e.preventDefault();
      break;
    case 13: //enter
      e.preventDefault();
      break;
  }
};
let timer;
let score;

showInfo();
drawBoard();
