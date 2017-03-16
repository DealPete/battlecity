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
			  + tile.x * tileset.tileWidth + "px -" + tile.y * tileset.tileHeight + "px";

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
	get("level", function(res) {
		level = JSON.parse(res);
		levelNameSpan.innerHTML = level.name;
		if (level.data.length != level.width * level.height)
			throw new Error("Map has incorrect dimensions.");
		for (i of level.data)
			map.push(i);

		saveButton.onclick = saveClick;
		clearMap.onclick = clearClick;
		canvas.onmousedown = canvasMouseDown;
		canvas.onmousemove = canvasMouseMove;
	});

	get("tileset", res => {
		tileset = JSON.parse(res);
		sprites.src = tileset.sprites;
		sprites.onload = createButtons;
	});
}

function drawGrid() {
	for (i = 1; i < level.width; i++) {
		ctx.beginPath();
		ctx.moveTo(i * tileset.tileWidth, 0);
		ctx.lineTo(i * tileset.tileWidth, tileset.tileHeight*level.height);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#FFFFFF";
		ctx.stroke();
	}

	for (i = 1; i < level.height; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i * tileset.tileHeight);
		ctx.lineTo(tileset.tileWidth*level.width, i * tileset.tileHeight);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#FFFFFF";
		ctx.stroke();
	}
}

function drawMap() {
	ctx.clearRect(0, 0, level.width*tileset.tileWidth, level.height*tileset.tileHeight);
	drawGrid();
	function drawTile(tile, x, y) {
		ctx.drawImage(sprites, tile.x*tileset.tileWidth,
			tile.y*tileset.tileHeight, tileset.tileWidth,
			tileset.tileHeight, x*tileset.tileWidth, y*tileset.tileHeight,
			tileset.tileWidth, tileset.tileHeight);
	}

	for (i = 0; i < map.length; i++)
		if (map[i] != 0)
			drawTile(tileset.tiles[map[i]], i % level.width, Math.floor(i / level.width))

	for (tile of tileset.tiles)
		if (tile.type == "unique") {
			let pos = level[tile.name];
			if (pos != "absent")
				drawTile(tile, pos % level.width, Math.floor(pos / level.width));
		}
}

function placeTile(location) {
	if (tileset.tiles[state.terrain].type == "unique") {
		level[tileset.tiles[state.terrain].name] = location;
		map[location] = 0;
	}
	else
		map[location] = state.terrain;
}

function removeTile(location) {
	for (tile of tileset.tiles)
		if (tile.type == "unique" && level[tile.name] == location)
			level[tile.name] = "absent";
	map[location] = 0;
}

function canvasMouseDown(e) {
	state.cursorLocation = Math.floor(e.offsetX/tileset.tileWidth) % level.width
			+ Math.floor(e.offsetY/tileset.tileHeight) * level.width;
	state.mouseDown = true;
	state.button = e.button;
	if (state.button == 0) {
		placeTile(state.cursorLocation);
	} else if (state.button == 2) {
		e.preventDefault();
		removeTile(state.cursorLocation);
	}
	drawMap();
}

canvas.onmouseup = function() {
	state.mouseDown = false;
}

function canvasMouseMove(e) {
	if (state.mouseDown) {
		var loc = Math.floor(e.offsetX/tileset.tileWidth) % level.width
				+ Math.floor(e.offsetY/tileset.tileHeight) * level.width;
		if (loc != state.cursorLocation) {
			if (state.button == 0)
				placeTile(loc);
			else
				removeTile(loc);
			state.cursorLocation = loc;
			drawMap();
		}
	}
}

canvas.oncontextmenu = function(e) {
	e.preventDefault();
}

function saveClick() {
	level.data = map.join("");
	post("level", JSON.stringify(level), function(res) {
		console.log(res);
	});
}
	
function clearClick() {
	map = map.map( tile => 0 );
	for (tile of tileset.tiles)
		if (tile.type == "unique")
			level[tile.name] = "absent";
	drawMap();
}

loadMap();
