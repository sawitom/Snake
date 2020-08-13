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
  let gameState = {
    value: false,
    get isOver() {
      return this.value;
    },
    set isOver(val) {
      if (!this.value && val) {
        this.value = val;
        clearInterval(snakeTimer);
        alert("GAME OVER");
      } else this.value = val;
    },
  };

  let head = document.getElementById(snakeIds[0].id);
  head.style.backgroundColor = "green";
  for (let i = 1; i < snakeIds.length; i++) {
    document.getElementById(snakeIds[i].id).style.backgroundColor =
      "lightgreen";
  }
  const snakeTimer = setInterval(() => {
    move(gameState);
  }, 500);
}
function move(gameState) {
  removeColors();
  snakeIds.forEach(function (part, index) {
    //switching direction
    changeDirection(part, index);
    console.log(JSON.parse(JSON.stringify(snakeIds)));
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

      //console.log("iteracja " + part);
    }
  }, snakeIds);
  //console.log(snakeIds);
  recolor();
}
function changeDirection(part, index) {
  breakPoints.forEach(function (bp, index) {
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
    }
  }, breakPoints);
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
function createBreakPointLeft() {
  let bpoint = {
    id: snakeIds[0].id,
    newDirection: "left",
  };
  breakPoints.push(bpoint);
}
function createBreakPointRight() {
  let bpoint = {
    id: snakeIds[0].id,
    newDirection: "right",
  };
  breakPoints.push(bpoint);
}

const dotsNumber = 400;
let snakeIds = [
  { id: 210, nextMove: "right" },
  { id: 209, nextMove: "right" },
  { id: 208, nextMove: "right" },
  { id: 207, nextMove: "right" },
  { id: 206, nextMove: "right" },
];
let breakPoints = [
  { id: 217, newDirection: "left" },
  { id: 157, newDirection: "left" },
  { id: 156, newDirection: "right" },
  { id: 136, newDirection: "right" },
];
const leftButton = document.getElementById("goLeft");
const rightButton = document.getElementById("goRight");
drawBoard();
game();
