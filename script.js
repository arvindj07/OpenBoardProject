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
// Pencil-Formatting Tool
let pencilFormatTool = document.querySelector(".formatting-tool");
let formatToolState = false; // Used to Make FormatTool container visible on-Click
let lineWidth = document.querySelector(".line-width");
let allColorEle = document.querySelectorAll(".color");
let lineWidthEle = document.querySelector("#pencil-line-width");
// Eraser
let eraser = document.querySelector("#eraser");
let eraserMouseDownState;
let old;// store coordinates
let eraserFormatTool = document.querySelector(".eraser-formatting-tool");
let eraserToolState = false;
let eraserWidthEle = document.querySelector("#eraser-line-width");
//zoom
let zoomIn = document.querySelector("#zoom-in");
let zoomOut = document.querySelector("#zoom-out");
let zoomLevel = 1;
//Download
let download = document.querySelector("#download");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// **********************************Pencil
pencil.addEventListener("click", function (e) {
  hideFormatTool(eraserFormatTool); // Hide Eraser Tool
  toolActive(e.currentTarget); // Set Active-State
  defaultStateFormatTool();// Set-Default Format-Tool State
  mouseDown = false;
  toolState = 1;  // Pencil

  document.addEventListener("mousedown", pencilMouseDown);
  document.addEventListener("mousemove", pencilMouseMove);
  document.addEventListener("mouseup", pencilMouseUp);


})

function pencilMouseDown(e) {
  if (toolState == 1) { // Check-Tool State
    mouseDown = true;
    tool.beginPath();
    let x = e.clientX;
    let y = e.clientY;
    // Not to draw over Tool-Container and Formatting Tool
    let obj = pencilFormatTool.getBoundingClientRect();
    if (window.innerWidth > 900 && y > toolContainer.clientHeight && y > obj.bottom) {
      tool.moveTo(x, y);
    } else if (window.innerWidth < 900 && x > toolContainer.clientWidth && x > obj.right) {
      tool.moveTo(x, y);
    }
  }
}
function pencilMouseMove(e) {
  if (toolState == 1) {
    if (mouseDown) {
      let x = e.clientX;
      let y = e.clientY;
      // Not to draw over Tool-Container and Formatting Tool
      let obj = pencilFormatTool.getBoundingClientRect();
      if (window.innerWidth > 900 && y > toolContainer.clientHeight && y > obj.bottom) {
        tool.lineTo(x, y);
        tool.stroke();
      } else if (window.innerWidth < 900 && x > toolContainer.clientWidth && x > obj.right) {
        tool.lineTo(x, y);
        tool.stroke();
      }
    }
  }
}
function pencilMouseUp(e) {
  if (toolState == 1) {
    mouseDown = false;
  }
}

//*************************** Pencil Formatting-Tool
// Make Format Tool visible nd invisible 
pencil.addEventListener("dblclick", function (e) {
  defaultStateFormatTool();
  if (formatToolState == false) {
    displayFormatTool(pencilFormatTool);
  } else {
    hideFormatTool(pencilFormatTool);
  }
  formatToolState = !formatToolState;
})
// Handle Click on All Color Elements
allColorEle.forEach(colorEle => {
  // Click on Each Color-Element
  colorEle.addEventListener("click", function (e) {
    removeColorActiveState();
    let colorElement = e.currentTarget;
    colorElement.classList.add("color-active");// Active State
    tool.strokeStyle = colorElement.getAttribute("colorValue");//set color
  });
});
// Set Line-width 
lineWidth.addEventListener("change", function (e) {
  tool.lineWidth = lineWidth.valueAsNumber;
})
function removeColorActiveState() {
  allColorEle.forEach(color => {
    color.classList.remove("color-active");
  });
}
function displayFormatTool(formattingTool) {
  formattingTool.style.display = "block";
}
function hideFormatTool(formattingTool) {
  formattingTool.style.display = "none";
}
function defaultStateFormatTool() {
  removeColorActiveState();
  allColorEle[0].classList.add("color-active");// red-color default
  tool.strokeStyle = "red"; // default
  tool.lineWidth = "5"; // default
  lineWidth.value = 5;
}

//****************************** Eraser-Tool
eraser.addEventListener("click", function (e) {
  hideFormatTool(pencilFormatTool);
  toolActive(e.currentTarget);
  toolState = 2;  // Eraser
  tool.lineWidth = "5"; // default
  eraserWidthEle.value = 5; // default

  document.addEventListener("mousedown", eraserMouseDown);
  document.addEventListener("mousemove", eraserMouseMove);
  document.addEventListener("mouseup", eraserMouseUp);
})

function eraserMouseDown(e) {
  if (toolState == 2) { // Check-Tool State
    eraserMouseDownState = true;
    old = { x: e.clientX, y: e.clientY };
  }
}
function eraserMouseMove(e) {
  if (toolState == 2) {
    if (eraserMouseDownState) {
      let x = e.clientX;
      let y = e.clientY;
      // Erase Content - Code
      // To give Eraser a Circle-shape
      tool.globalCompositeOperation = 'destination-out';
      tool.beginPath();
      tool.arc(x, y, tool.lineWidth, 0, 2 * Math.PI);
      tool.fill();
      // To Erase it in a line
      tool.beginPath();
      tool.moveTo(old.x, old.y);
      tool.lineTo(x, y);
      tool.stroke();
      old = { x: x, y: y };
    }
  }
}
function eraserMouseUp(e) {
  if (toolState == 2) {
    eraserMouseDownState = false;
    tool.globalCompositeOperation = 'source-over'; // reset to default-value
  }
}

// Make Format Tool visible nd invisible 
eraser.addEventListener("dblclick", function (e) {
  tool.lineWidth = "5"; // default
  eraserWidthEle.value = 5; // default
  if (eraserToolState == false) {
    displayFormatTool(eraserFormatTool);
  } else {
    hideFormatTool(eraserFormatTool);
  }
  eraserToolState = !eraserToolState;
})
// Set Eraser Line-width 
eraserWidthEle.addEventListener("change", function (e) {
  tool.lineWidth = eraserWidthEle.valueAsNumber;
})


//*************************** Zoom-In and Zoom-Out
zoomIn.addEventListener("click", function (e) {
  hideFormatTool(pencilFormatTool);// Hide the Pencil Formatting Tool
  hideFormatTool(eraserFormatTool);// Hide the Eraser Formatting Tool
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
  hideFormatTool(pencilFormatTool);
  hideFormatTool(eraserFormatTool);
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

//**************************** Download
download.addEventListener("click", function (e) {
  hideFormatTool(pencilFormatTool);
  hideFormatTool(eraserFormatTool);
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

