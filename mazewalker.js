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
			// console.log(tile);
			tiles = res.tiles
      tank = tiles[1];
      // console.log(tank)

	 		var walls = importData(jsonRes.data);
			// console.log(res);
			// console.log(tiles)
      // nsole.log(walls)
      // nsole.log(man)
			// console.log('game started')

			startGame(tile, walls)


		});
 });
}

function startGame(tile, data) {
	state = {
		state: "playing",
		player: {
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
		},
    tankSkin : tiles[1],
    animate : 1
	}
  console.log(state)
  getStartPlace(data)
	// console.log(state.walls.wall1)
	//gameLoop(data)
	window.setInterval(function() {gameLoop(tile, data)}, 10);
}

function gameLoop(tile, data) {
	drawScreen(tile, data);
	if (state.state == "playing")
		updateState(data);
}

function drawScreen(tile, walls) {
	ctx.clearRect(0, 0, 960, 640);
  animateTank(tile)
  drawWalls(walls)
}

function animateTank(tile) {
  if (state.animate == 1) {
    state.tankSkin.x += 32;
    state.animate = 2;
  } else {
    state.tankSkin.x -= 32;
    state.animate = 1;
  }
  return ctx.drawImage(tile, state.tankSkin.x, state.tankSkin.y, TILE_WIDTH, TILE_WIDTH, state.player.x, state.player.y, TILE_WIDTH, TILE_WIDTH)
}

// function getCurrentPosition(x, y) {
//   console.log(x)
//   console.log(y)
// }

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
		if (tileType > 1) {
			ctx.drawImage(tile, tiles[tileType].x * TILE_WIDTH, tiles[tileType].y * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH, topX, topY, xLength, yLength);
		}

    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function getStartPlace(walls) {
  for (var column = 0; column < walls.length; column++) {
		for (var row = 0; row < walls[column].length; row++) {
			if (walls[column][row] == 1) {
				state.player.x = row * TILE_WIDTH;
        state.player.y = column * TILE_WIDTH;
        console.log(state.player.y)
        console.log(state.player.x)
			}
		}
	}
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
			if (newX > row * TILE_WIDTH - 32 && newX < row * TILE_WIDTH + TILE_WIDTH && newY > column * TILE_WIDTH - 32 && newY < column * TILE_WIDTH + TILE_WIDTH && walls[column][row] > 1 ) {
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
  event.preventDefault();
	if (state.state == "playing") {
		if (event.keyCode == 37) {
			state.player.vx = -2;
      state.tankSkin.x = 64;
      state.animate = 1;
    }
		else if (event.keyCode == 38){
			state.player.vy = -2;
      state.tankSkin.x = 0;
      state.animate = 1;
    }
		else if (event.keyCode == 39){
			state.player.vx = 2;
      state.tankSkin.x = 192;
      state.animate = 1;
    }
		else if (event.keyCode == 40){
			state.player.vy = 2;
      state.tankSkin.x = 128;
      state.animate = 1;
    }
	}

}
