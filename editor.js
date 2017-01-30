MAP_HEIGHT = 20
MAP_WIDTH = 30
SQUARE_HEIGHT = 32
SQUARE_WIDTH = 32

var canvas = document.getElementById('editor');
var ctx = canvas.getContext('2d');

imageLoaded = false;
mapLoaded = false;
mouseDown = false;

var sprites = new Image();
sprites.src = "tiles.png"

sprites.onload = function() {
	imageLoaded = true;
	if (mapLoaded) drawMap();
}

var tiles = [
	{ name: "none", x: 0, y: 0 },
	{ name: "wall", x: 9*32, y: 17*32 }
]

var level = {};
var map = [];
var levelNameSpan = document.getElementById('levelName');
var saveButton = document.getElementById('saveButton');

function loadMap() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			level = JSON.parse(this.responseText);
			levelNameSpan.innerHTML = level.name;
			if (level.data.length != MAP_HEIGHT*MAP_WIDTH)
				throw new Error("Map has incorrect dimensions.");
			for (i of level.data)
				map.push(i);
			mapLoaded = true;
			if (imageLoaded)
				drawMap();
		}
	}
	xmlhttp.open("GET", "loadlevel.php");
	xmlhttp.send();
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
	function drawTile(name, x, y) {
		try {
			ctx.drawImage(sprites, tiles[name].x, tiles[name].y,
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
	if (e.button == 0) {
		mouseDown = true;
		map[Math.floor(e.offsetX/SQUARE_WIDTH) % MAP_WIDTH
			+Math.floor(e.offsetY/SQUARE_HEIGHT) * MAP_WIDTH] = 1;
		drawMap();
	}
}

canvas.onmouseup = function() {
	mouseDown = false;
}

canvas.onmousemove = function(e) {
}

loadMap();
drawGrid();
