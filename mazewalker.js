const TILE_WIDTH = 32;

var data = [];
var man = new Image();
man.src = "man.png";

var tile = new Image();

var tiles = [];

var canvas = document.getElementById('maze');
var ctx = canvas.getContext('2d');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var gain = audioCtx.createGain();


var state = { state: "loading" };
let imagesLoaded = 0;

function init() {
 get("level.json", function(response) {
	 var jsonRes = JSON.parse(response);
	 get(jsonRes.tileset, function(res) {
		 	var res = JSON.parse(res);
			tile.src = res.sprites
			console.log(tile);
			tiles = res.tiles

	 		var walls = importData(jsonRes.data);
			console.log(res);
			console.log(tiles)
	 		console.log(walls)
	 		console.log(man)
			console.log('game started')

			startGame(walls)

		});
 });
}

function startGame(data) {
	state = {
		state: "playing",
		player: {
			x: 0,
			y: 0,
			vx: 0,
			vy: 0
		}
	}
	// console.log(state.walls.wall1)
	//gameLoop(data)
	window.setInterval(function() {gameLoop(data)}, 10);
}

function gameLoop(data) {
	drawScreen(data);
	if (state.state == "playing")
		updateState(data);
}

function drawScreen(walls) {
	ctx.clearRect(0, 0, 960, 640);
	ctx.drawImage(man, state.player.x, state.player.y, 30, 30);
	drawWalls(walls)
}

function updateState(walls) {
	let newX = state.player.x + state.player.vx;
	let newY = state.player.y + state.player.vy;
	if (!collisionDetection(walls, newX, newY)) {
		state.player.x = newX;
		state.player.y = newY;
	}
}

function drawWall(tileType, topX, topY, xLength, yLength) {
    ctx.beginPath();
		if (tileType != 0) {
			ctx.drawImage(tile, tiles[tileType].x * TILE_WIDTH, tiles[tileType].y * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH, topX, topY, xLength, yLength);
		}
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawWalls(walls) {
	for (var column = 0; column < walls.length; column++) {
		for (var row = 0; row < walls[column].length; row++) {
			if (walls[column][row]) {
				drawWall(walls[column][row], row * TILE_WIDTH, column * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH)
			}
		}
	}
}

function importData(data) {
	var substr = data.match(/.{1,30}/g)
	var newArr =[];
	for (var x = 0; x < substr.length; x++) {
  	newArr.push(substr[x].match(/.{1,1}/g))
	}
	return newArr
}

function collisionDetection(walls, newX, newY) {
	for (var column = 0; column < walls.length; column++) {
		for (var row = 0; row < walls[column].length; row++) {
			if (newX > row * TILE_WIDTH - 32 && newX < row * TILE_WIDTH + TILE_WIDTH && newY > column * TILE_WIDTH - 32 && newY < column * TILE_WIDTH + TILE_WIDTH && walls[column][row] != 0 ) {
				return true
			}
		}
	}

	//wall detection
	// if (newX < state.walls.wall1.topX + state.walls.wall1.xLength && newX > state.walls.wall1.topX - 30 && newY < state.walls.wall1.topY + state.walls.wall1.yLength && newY > state.walls.wall1.topY - 30) {
	// 	return true;
	// }
}

init();

gain.gain.value = 0.1;
gain.connect(audioCtx.destination);


window.onkeyup = (event) => {
	if (state.state == "playing") {
		if (event.keyCode == 38 && state.player.vy < 0 ||
			event.keyCode == 40 && state.player.vy > 0) {
			state.player.vy = 0;
		}
		if (event.keyCode == 37 && state.player.vx < 0 ||
			event.keyCode == 39 && state.player.vx > 0) {
			state.player.vx = 0;
		}
	}
}

window.onkeydown = (event) => {
	if (state.state == "playing") {
		if (event.keyCode == 37)
			state.player.vx = -2;
		else if (event.keyCode == 38)
			state.player.vy = -2;
		else if (event.keyCode == 39)
			state.player.vx = 2;
		else if (event.keyCode == 40)
			state.player.vy = 2;
	}
}
