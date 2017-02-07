MAP_HEIGHT = 20
MAP_WIDTH = 30
SQUARE_HEIGHT = 32
SQUARE_WIDTH = 32

var canvas = document.getElementById('editor');
var ctx = canvas.getContext('2d');

state = {
	imageLoaded: false,
	mapLoaded: false,
	mouseDown: false,
	button: null,
	cursorLocation: null,
	terrain: 1
}

var sprites = new Image();


//"tiles": [
//	{ "name": "none", "x": 0, "y": 0 },
//	{ "name": "wall", "x": 256, "y": 512 },
//	{ "name": "water", "x": 864, "y": 608 }
//],
//"sprites":"tiles.png",


var level = {};
var map = [];
var levelNameSpan = document.getElementById('levelName');
var saveButton = document.getElementById('saveButton');

var button1 = document.getElementById('terrain1');
var button2 = document.getElementById('terrain2');
button1.style.borderColor = "black";

button1.onclick = function() {
	state.terrain = 1;
	button1.style.borderColor = "black";
	button2.style.borderColor = "white";
}

button2.onclick = function() {
	state.terrain = 2;
	button2.style.borderColor = "black";
	button1.style.borderColor = "white";
}

function loadMap() {
	get("loadlevel.php", function(res) {
		level = JSON.parse(res);
		levelNameSpan.innerHTML = level.name;
		if (level.data.length != MAP_HEIGHT*MAP_WIDTH)
			throw new Error("Map has incorrect dimensions.");
		for (i of level.data)
			map.push(i);
		sprites.src = level.sprites;

		sprites.onload = function() {
			drawMap();
		}
	});
}

function drawGrid() {
	for (i = 1; i < MAP_WIDTH; i++) {
		ctx.beginPath();
		ctx.moveTo(i * SQUARE_WIDTH, 0);
		ctx.lineTo(i * SQUARE_WIDTH, SQUARE_HEIGHT*MAP_HEIGHT);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#FFFFFF";
		ctx.stroke();
	}

	for (i = 1; i < MAP_HEIGHT; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i * SQUARE_HEIGHT);
		ctx.lineTo(SQUARE_WIDTH*MAP_WIDTH, i * SQUARE_HEIGHT);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#FFFFFF";
		ctx.stroke();
	}
}

function drawMap() {
	ctx.clearRect(0, 0, MAP_WIDTH*SQUARE_WIDTH, MAP_HEIGHT*SQUARE_HEIGHT);
	drawGrid();
	function drawTile(name, x, y) {
		try {
			ctx.drawImage(sprites, level.tiles[name].x, level.tiles[name].y,
				SQUARE_WIDTH, SQUARE_HEIGHT, x*SQUARE_WIDTH, y*SQUARE_HEIGHT,
				SQUARE_WIDTH, SQUARE_HEIGHT);
		}
		catch(err) {
			throw err;
		}
	}

	for (i = 0; i < map.length; i++) {
		try {
			drawTile(map[i], i % MAP_WIDTH, Math.floor(i / MAP_WIDTH))
		} catch(err) {
			console.log(i, map[i]);
		}
	}
}

canvas.onmousedown = function(e) {
	state.cursorLocation = Math.floor(e.offsetX/SQUARE_WIDTH) % MAP_WIDTH
			+ Math.floor(e.offsetY/SQUARE_HEIGHT) * MAP_WIDTH;
	state.mouseDown = true;
	state.button = e.button;
	if (state.button == 0) {
		map[state.cursorLocation] = state.terrain;
	} else if (state.button == 2) {
		e.preventDefault();
		map[state.cursorLocation] = 0;
	}
	drawMap();
}

canvas.onmouseup = function() {
	state.mouseDown = false;
}

canvas.onmousemove = function(e) {
	if (state.mouseDown) {
		var loc = Math.floor(e.offsetX/SQUARE_WIDTH) % MAP_WIDTH
				+ Math.floor(e.offsetY/SQUARE_HEIGHT) * MAP_WIDTH;
		if (loc != state.cursorLocation) {
			map[loc] = (state.button == 0) ? state.terrain : 0;
			state.cursorLocation = loc;
			drawMap();
		}
	}
}

canvas.oncontextmenu = function(e) {
	e.preventDefault();
}

saveButton.onclick = function() {
	level.data = map.join("");
	post("savelevel.php", JSON.stringify(level), function(res) {
		console.log(res)
	});
}
	
loadMap();
