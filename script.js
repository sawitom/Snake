function drawBoard() {
  for (let i = 0; i < dotsNumber; i++) {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "dot");
    newDiv.setAttribute("id", i);
    const marker = document.createTextNode(i);
    newDiv.appendChild(marker);

    const currentDiv = document.getElementById("board");
    currentDiv.appendChild(newDiv);
  }
}
function game() {
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
        alert("GAME OVER");
      } else this.over = val;
    },

    get fruitId() {
      return this.fruit[1];
    },
    set fruitId(id) {
      if (this.fruit[0]) {
        if (id == null) {
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
  //removeColors();
  snakeIds.forEach(function (part, index) {
    //switching direction
    changeDirection(part, index);
    //console.log(JSON.parse(JSON.stringify(snakeIds)));

    //moving
    if (
      (part.id % 20 == 19 && part.nextMove == "right") ||
      (part.id % 20 == 00 && part.nextMove == "left") ||
      (part.id >= 0 && part.id <= 19 && part.nextMove == "up") ||
      (part.id >= 380 && part.id <= 399 && part.nextMove == "down")
    ) {
      gameState.isOver = true;
      //console.log("restart");
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
      if (isAboutToCrash()) gameState.isOver = true;
      if (index == 0 && part.id == gameState.fruitId) {
        gameState.fruitId = null;
        tailLengthen();
      }
      //console.log("iteracja " + part);
    }
    //if (index == snakeIds.length - 1) breakPoints.shift();
  }, snakeIds);
  //console.log(snakeIds);
  recolor();
}
function changeDirection(part, index) {
  breakPoints.forEach((bp) => {
    //console.log(index);
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
      if (index == snakeIds.length - 1) {
        breakPoints.shift();
        //console.log(breakPoints);
      }
    }
  }, breakPoints);
}
function isAboutToCrash() {
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
    document.getElementById(item.id).style.backgroundColor = "royalblue";
    //console.log("kolory usunięte");
  });
}
function recolor() {
  document.getElementById(snakeIds[0].id).style.backgroundColor = "green";
  for (let i = 1; i < snakeIds.length; i++) {
    document.getElementById(snakeIds[i].id).style.backgroundColor =
      "lightgreen";
    //console.log("kolory dodane");
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
  }
}
function createBreakPointRight() {
  if (!breakPoints.some((bp) => bp.id == snakeIds[0].id)) {
    let bpoint = {
      id: snakeIds[0].id,
      newDirection: "right",
    };
    breakPoints.push(bpoint);
  }
}

const dotsNumber = 400;
let snakeIds = [
  { id: 210, nextMove: "right" },
  { id: 209, nextMove: "right" },
  { id: 208, nextMove: "right" },
  { id: 207, nextMove: "right" },
  { id: 206, nextMove: "right" },
];
let breakPoints = [];
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
drawBoard();
game();
