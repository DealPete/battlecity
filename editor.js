MAP_HEIGHT = 20
MAP_WIDTH = 30

var canvas = document.getElementById('editor');
var ctx = canvas.getContext('2d');

state = {
	mouseDown: false,
	button: null,
	cursorLocation: null,
	terrain: 1
}

var sprites = new Image();

var map = [];
var buttons = [];
var levelNameSpan = document.getElementById('levelName');
var saveButton = document.getElementById('saveButton');
var clearMap = document.getElementById('clearMap');

function createButtons() {
	for (tile of tileset.tiles) {
		if (tile.name != "none") {
			var node = document.createElement("button");
			node.className = "tile-button";
			node.style.width = tileset.tileWidth;
			node.style.height = tileset.tileHeight;
			node.style.background = "url(" + tileset.sprites +") -"
				+ tile.x * tileset.tileWidth + " -" + tile.y * tileset.tileHeight;
			node.onclick = function() {
				for (var i = 0; i < buttons.length; i++) {
					if (buttons[i] == this) {
						state.terrain = i + 1;
						buttons[i].style.outlineStyle = "solid";
					}
					else {
						buttons[i].style.outlineStyle = "none";
					}
				}
			}
			buttons.push(node);
			document.getElementById("tile-buttons").appendChild(node);
		}
	}
	state.terrain = 1;
	buttons[0].style.outlineStyle = "solid";
	drawMap();
}

function loadMap() {
	get("loadlevel.php", function(res) {
		level = JSON.parse(res);
		levelNameSpan.innerHTML = level.name;
		if (level.data.length != MAP_HEIGHT*MAP_WIDTH)
			throw new Error("Map has incorrect dimensions.");
		for (i of level.data)
			map.push(i);

		get(level.tileset, res => {
			console.log(res);
			tileset = JSON.parse(res);
			sprites.src = tileset.sprites;
			sprites.onload = createButtons;
		});
	});
}

function drawGrid() {
	for (i = 1; i < MAP_WIDTH; i++) {
		ctx.beginPath();
		ctx.moveTo(i * tileset.tileWidth, 0);
		ctx.lineTo(i * tileset.tileWidth, tileset.tileHeight*MAP_HEIGHT);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#FFFFFF";
		ctx.stroke();
	}

	for (i = 1; i < MAP_HEIGHT; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i * tileset.tileHeight);
		ctx.lineTo(tileset.tileWidth*MAP_WIDTH, i * tileset.tileHeight);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#FFFFFF";
		ctx.stroke();
	}
}

function drawMap() {
	ctx.clearRect(0, 0, MAP_WIDTH*tileset.tileWidth, MAP_HEIGHT*tileset.tileHeight);
	drawGrid();
	function drawTile(name, x, y) {
		ctx.drawImage(sprites, tileset.tiles[name].x*tileset.tileWidth,
			tileset.tiles[name].y*tileset.tileHeight, tileset.tileWidth,
			tileset.tileHeight, x*tileset.tileWidth, y*tileset.tileHeight,
			tileset.tileWidth, tileset.tileHeight);
	}

	for (i = 0; i < map.length; i++) {
		if (map[i] != 0) {
			drawTile(map[i], i % MAP_WIDTH, Math.floor(i / MAP_WIDTH))
		}
	}
}

canvas.onmousedown = function(e) {
	state.cursorLocation = Math.floor(e.offsetX/tileset.tileWidth) % MAP_WIDTH
			+ Math.floor(e.offsetY/tileset.tileHeight) * MAP_WIDTH;
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
		var loc = Math.floor(e.offsetX/tileset.tileWidth) % MAP_WIDTH
				+ Math.floor(e.offsetY/tileset.tileHeight) * MAP_WIDTH;
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
	
clearMap.onclick = function() {
	map = map.map( tile => 0 );
	drawMap();
}

loadMap();
