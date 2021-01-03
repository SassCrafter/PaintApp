const paintColorInput = document.getElementById('paint__color');
const paintBgColorInput = document.getElementById('paint__bg-color');
const brushSizeInput = document.getElementById('paint__brush-size');
const brushSizeNumberEl = document.getElementById('paint__brush-size--num');

const canvasXEl = document.getElementById('paint__canvas-width');
const canvasYEl = document.getElementById('paint__canvas-height');

// Erase Elements
const eraseEl = document.getElementById('paint__erase');
const resetEl = document.getElementById('paint__reset');

// Save To Local Storage buttons
const saveBtn = document.getElementById('paint__save-btn');
const loadBtn = document.getElementById('paint__load-btn');
const clearBtn = document.getElementById('paint__clear-btn');

const downloadBtn = document.getElementById('paint__download-btn');

let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;
let brushColor = paintColorInput.value;
let bgColor = paintBgColorInput.value;
let brushSize = 5;

let linesArray = [];

const canvas = document.getElementById('paint__canvas');
const ctx = canvas.getContext('2d');





function canvasSetup(brushColor, brushSize) {
	ctx.strokeStyle = brushColor;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.lineWidth = brushSize;
}

function redrawCanvasPicture(lines) {
	for (var i = 1; i < lines.length; i++) {
		canvasSetup(lines[i].color, lines[i].size);
		ctx.beginPath();
		ctx.moveTo(lines[i-1].x, lines[i-1].y);
		ctx.lineTo(lines[i].x, lines[i].y);
		ctx.stroke();
	}
}

function draw(e) {
	if (isDrawing) {
		drawLine(lastX, lastY, e.offsetX, e.offsetY);
		[lastX, lastY] = [e.offsetX, e.offsetY];
		store(lastX, lastY, brushColor, brushSize);
	}
}



function drawLine(startX, startY, endX, endY) {
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();
}

function changeBrushColor() {
	brushColor = this.value;
	ctx.strokeStyle = brushColor;
}

function changeBgColor() {
	let color = this.value;
	canvas.style.background = color;
}

function changeBrushSize() {
	brushSize = this.value;
	brushSizeNumberEl.innerText = brushSize;
	ctx.lineWidth = brushSize;
}

function erase() {
	isErasing = !isErasing;
	if (isErasing) {
		ctx.strokeStyle = paintBgColorInput.value;
	} else {
		ctx.strokeStyle = brushColor;
	}
}

function clearCanvas() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	linesArray = [];
}


function resizeCanvas() {
	canvas.width = canvasXEl.value;
	canvas.height = canvasYEl.value;
	canvas.style = `width: ${canvas.width}px; height: ${canvas.height}px`;
	redrawCanvasPicture(linesArray);
}

function store(x, y, c, s) {
	const line = {
		x: x,
		y: y,
		color: c,
		size: s
	}
	linesArray.push(line);
}

function saveToLocalStorage() {
	localStorage.removeItem('savedCanvas');
	localStorage.setItem('savedCanvas', JSON.stringify(linesArray));
}

function loadSavedCanvas() {
	if (localStorage.getItem('savedCanvas') !== null) {
		linesArray = JSON.parse(localStorage.savedCanvas);
		redrawCanvasPicture(linesArray);
	}
}

function clearLocalStorage() {
	localStorage.removeItem('savedCanvas');
}

function downloadCanvasImage(fileName) {
	const link = document.createElement('a');
	link.href = canvas.toDataURL("image/png;base64");
	link.download = fileName;
	link.click();
	link.remove();
}


canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	[lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mouseup', () => {
	isDrawing = false;
	linesArray.push('stop');
});
canvas.addEventListener('mouseout', () => {
	isDrawing = false;
	linesArray.push('stop');
});
canvas.addEventListener('mousemove', draw);

// Listen for change color input
paintColorInput.addEventListener('change', changeBrushColor);

// Listen for background color change
paintBgColorInput.addEventListener('change', changeBgColor);

// Listen for brush size change
brushSizeInput.addEventListener('change', changeBrushSize);
brushSizeInput.addEventListener('mousemove', changeBrushSize);

// Listen for isErasing
eraseEl.addEventListener('click', () => {
	eraseEl.classList.toggle('clicked');
	erase();
});

resetEl.addEventListener('click', () => {
	setTimeout(() => {
		resetEl.classList.remove('clicked');
	}, 250);
	resetEl.classList.add('clicked');
	clearCanvas();
});

// Listen for Save, Load and Clear buttons
saveBtn.addEventListener('click', saveToLocalStorage);
loadBtn.addEventListener('click', loadSavedCanvas);
clearBtn.addEventListener('click', clearLocalStorage);

downloadBtn.addEventListener('click', () => {
	downloadCanvasImage('masterpiece.png')
});



// Listen for resizing canvas
canvasXEl.addEventListener('change', resizeCanvas);
canvasYEl.addEventListener('change', resizeCanvas);


window.addEventListener('DOMContentLoaded', () => {
	canvasSetup(brushColor, brushSize);
});
