let canvas = document.querySelector("#board");
let tool = canvas.getContext("2d");
let toolContainer = document.querySelector(".tool-container");
let pencil = document.querySelector("#pencil");
let mouseDown;
let zoomIn = document.querySelector("#zoom-in");
let zoomOut = document.querySelector("#zoom-out");
let zoomLevel = 1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Pencil
pencil.addEventListener("click", function (e) {
  mouseDown = false;
  // Reset Zoom i.e, scale()
  tool.setTransform(1, 0, 0, 1, 0, 0);
  document.addEventListener("mousedown", fnMouseDown);
  document.addEventListener("mousemove", fnMouseMove);
  document.addEventListener("mouseup", fnMouseUp);
})

function fnMouseDown(e) {
  mouseDown = true;
  tool.beginPath();
  let x = e.clientX;
  let y = e.clientY;
  tool.moveTo(x, y);
}
function fnMouseMove(e) {
  if (mouseDown) {
    let x = e.clientX;
    let y = e.clientY;
    // Not to draw over Tool-Container
    if (y > toolContainer.clientHeight) {
      tool.lineTo(x, y);
      tool.stroke();
    }
  }
}
function fnMouseUp(e) {
  mouseDown = false;
}

// Zoom-In and Zoom-Out
zoomIn.addEventListener("click", function (e) {
  zoomLevel = 1.1;
  tool.scale(zoomLevel, zoomLevel);
  // Copy Canvas Content to another Canvas
  let canvasCopy = document.createElement("canvas");
  canvasCopy.width = window.innerWidth;
  canvasCopy.height = window.innerHeight;
  let newTool = canvasCopy.getContext("2d");
  newTool.drawImage(canvas, 0, 0);
  // Clear canvas
  tool.clearRect(0, 0, canvas.width, canvas.height);
  // Center-Zoom
  let x = (canvas.width / zoomLevel - canvas.width) / 2;
  let y = (canvas.height / zoomLevel - canvas.height) / 2;
  // Draw Again(Paste)
  tool.drawImage(canvasCopy, x, y);
  // Reset Zoom i.e, scale()
  tool.setTransform(1, 0, 0, 1, 0, 0);

})

zoomOut.addEventListener("click", function (e) {
  zoomLevel = 0.8;
  tool.scale(zoomLevel, zoomLevel);
  // Copy Canvas Content to another Canvas
  let canvasCopy = document.createElement("canvas");
  canvasCopy.width = window.innerWidth;
  canvasCopy.height = window.innerHeight;
  let newTool = canvasCopy.getContext("2d");
  newTool.drawImage(canvas, 0, 0);
  // Clear canvas
  tool.clearRect(0, 0, canvas.width, canvas.height);
  // Center-Zoom
  let x = (canvas.width / zoomLevel - canvas.width) / 2;
  let y = (canvas.height / zoomLevel - canvas.height) / 2;
  // Draw Again(Paste)
  tool.drawImage(canvasCopy, x, y);
  // Reset Zoom i.e, scale()
  tool.setTransform(1, 0, 0, 1, 0, 0);

})

