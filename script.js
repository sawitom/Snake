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
  //let headId = 210;
  //let tailLength = 2;
  let snakeIds = [210, 209, 208];
  let head = document.getElementById(snakeIds[0]);
  //let tailIds = [209, 208];
  //const snake = [head, tailIds];
  head.style.backgroundColor = "green";
  for (let i = 1; i < snakeIds.length; i++) {
    document.getElementById(snakeIds[i]).style.backgroundColor = "cyan";
  }
}

const dotsNumber = 400;
drawBoard();
game();
