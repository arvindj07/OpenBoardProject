// Canvas and Tool
let canvas = document.querySelector("#board");
let tool = canvas.getContext("2d");
let toolContainer = document.querySelector(".tool-container");
// tools
let allTools = document.querySelectorAll(".tool");
let toolSelected = 0;
let toolState = 0;
// Pencil
let pencil = document.querySelector("#pencil");
let mouseDown;
//zoom
let zoomIn = document.querySelector("#zoom-in");
let zoomOut = document.querySelector("#zoom-out");
let zoomLevel = 1;
//Download
let download = document.querySelector("#download");



canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Pencil
pencil.addEventListener("click", function (e) {
  toolActive(e.currentTarget); // Set Active-State
  mouseDown = false;
  toolState = 1;  // Pencil
  // Reset Zoom i.e, scale()
  tool.setTransform(1, 0, 0, 1, 0, 0);
  document.addEventListener("mousedown", fnMouseDown);
  document.addEventListener("mousemove", fnMouseMove);
  document.addEventListener("mouseup", fnMouseUp);


})

function fnMouseDown(e) {
  if (toolState == 1) { // Check-Tool State
    mouseDown = true;
    tool.beginPath();
    let x = e.clientX;
    let y = e.clientY;
    tool.moveTo(x, y);
  }
}
function fnMouseMove(e) {
  if (toolState == 1) {
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
}
function fnMouseUp(e) {
  if (toolState == 1) {
    mouseDown = false;
  }
}

// Zoom-In and Zoom-Out
zoomIn.addEventListener("click", function (e) {
  toolActive(e.currentTarget);
  toolState = 5;  // Zoom_in
  if (toolState == 5) {
    zoomLevel = 1.05;
    tool.scale(zoomLevel, zoomLevel);
    // Copy Canvas Content to another Canvas
    let canvasCopy = copyOfCanvas(canvas);
    // Clear canvas
    tool.clearRect(0, 0, canvas.width, canvas.height);
    // Center-Zoom
    let x = (canvas.width / zoomLevel - canvas.width) / 2;
    let y = (canvas.height / zoomLevel - canvas.height) / 2;
    // Draw Again(Paste)
    tool.drawImage(canvasCopy, x, y);
    // Reset Zoom i.e, scale()
    tool.setTransform(1, 0, 0, 1, 0, 0);
  }
})

zoomOut.addEventListener("click", function (e) {
  toolActive(e.currentTarget);
  toolState = 6;  // zoom-Out
  if (toolState == 6) {
    zoomLevel = 0.95;
    tool.scale(zoomLevel, zoomLevel);
    // Copy Canvas Content to another Canvas
    let canvasCopy = copyOfCanvas(canvas);
    // Clear canvas
    tool.clearRect(0, 0, canvas.width, canvas.height);
    // Center-Zoom
    let x = (canvas.width / zoomLevel - canvas.width) / 2;
    let y = (canvas.height / zoomLevel - canvas.height) / 2;
    // Draw Again(Paste)
    tool.drawImage(canvasCopy, x, y);
    // Reset Zoom i.e, scale()
    tool.setTransform(1, 0, 0, 1, 0, 0);
  }
})

// Download
download.addEventListener("click", function (e) {
  toolState = 4;  // Tool-Selected
  toolActive(e.currentTarget);
  downloadCanvas(canvas); // Download Canvas
})

// Make Copy of Canvas
function copyOfCanvas(canvas) {
  let canvasCopy = document.createElement("canvas");
  canvasCopy.width = window.innerWidth;
  canvasCopy.height = window.innerHeight;
  let newTool = canvasCopy.getContext("2d");
  newTool.drawImage(canvas, 0, 0);
  return canvasCopy;
}

// Set Tool To Active-State
function toolActive(currTool) {
  // Remove Active-class
  allTools.forEach(tool => {
    tool.classList.remove("tool-active");
  });
  // Set Active-class
  currTool.classList.add("tool-active");
}

// Download Canvas Image
function downloadCanvas(canvas) {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "file.png";
  a.click();
  a.remove();
}

