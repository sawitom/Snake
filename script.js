//document.getElementById("board").innerHTML = "Jestem skryptem i działam ;>";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function drawBoard() {
  for (let i = 0; i < dotsNumber; i++) {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "dot");
    newDiv.setAttribute("id", i);
    const marker = document.createTextNode(".");
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
    if (part.id % 20 == 19 && part.nextMove == "right") {
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
          this[index].id += 20;
          break;
        case "down":
          this[index].id += 20;
          break;
      }

      //console.log("iteracja " + part);
    }
  }, snakeIds);
  recolor();
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
function createBreakPointLeft() {}

const dotsNumber = 400;
let snakeIds = [
  { id: 210, nextMove: "right" },
  { id: 209, nextMove: "right" },
  { id: 208, nextMove: "right" },
];
const leftButton = document.getElementById("goLeft");
const rightButton = document.getElementById("goRight");
drawBoard();
game();
