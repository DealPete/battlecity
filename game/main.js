const TILE_WIDTH = 32;

let connected = false;
let initialized = false;

var sprites = new Image();

var canvas = document.getElementById('city');
var ctx = canvas.getContext('2d');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var gain = audioCtx.createGain();

const socket = new WebSocket("ws:127.0.0.1:9000");

socket.onmessage = function(message) {
	var data = JSON.parse(message.data);
	switch(data.type) {
		case "connect":
			if (data == "full") {
				alert("Full!");
			} else {
				if (data.status == "player1")
					state.playerNumber = 0;
				else
					state.playerNumber = 1;
				if (initialized)
					startGame()
				else
					connected = true;
			}
			break;
	}
};
			
var state = { mode: "loading" };

function init() {
	get("level.json", function(response) {
		var jsonRes = JSON.parse(response);
		get(jsonRes.tileset, function(res) {
			var res = JSON.parse(res);
			sprites.src = res.sprites;
			tiles = res.tiles;
			level = importData(jsonRes.data);

			if (connected)
				startGame()
			else
				initialized = true;
		});
 });
}

function startGame() {
	Object.assign(state, {
		mode: "playing",
		player: []
	});

  getStartPlace();

	window.addEventListener("keyup", onkeyup);
	window.addEventListener("keydown", onkeydown);

 	window.setInterval(function() {gameLoop();}, 10);
}

function gameLoop() {
	drawScreen();
	if (state.mode == "playing")
		updateState();
}

function getStartPlace() {
  for (var column = 0; column < level.length; column++) {
		for (var row = 0; row < level[column].length; row++) {
			tile = level[column][row];
			if (tile == 1 || tile == 2) {
				state.player[tile - 1] = {
					x : row * TILE_WIDTH,
          y : column * TILE_WIDTH,
					vx : 0,
					vy : 0,
					animate : 1,
					tankSkin : tiles[tile]
				};
			}
		}
	}
}

function importData(data) {
	var substr = data.match(/.{1,30}/g)
	var newArr = [];
	for (var x = 0; x < substr.length; x++) {
  	newArr.push(substr[x].match(/.{1,1}/g))
	}
	return newArr;
}

init();

gain.gain.value = 0.1;
gain.connect(audioCtx.destination);

function onkeyup(event) {
	let player = state.player[state.playerNumber];
	if (state.mode == "playing") {
		if (event.keyCode == 38 && player.vy < 0 ||
			event.keyCode == 40 && player.vy > 0) {
			player.vy = 0;

		}
		if (event.keyCode == 37 && player.vx < 0 ||
			event.keyCode == 39 && player.vx > 0) {
			player.vx = 0;
		}
	}
  player.animate = 0;
}

function onkeydown(event) {
	let player = state.player[state.playerNumber];
	if (state.mode == "playing") {
		if ([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
			event.preventDefault();
			if (event.keyCode == 37) {
				player.vx = -2;
				player.tankSkin.x = 2;
				player.animate = 1;
			}
			else if (event.keyCode == 38){
				player.vy = -2;
				player.tankSkin.x = 0;
				player.animate = 1;
			}
			else if (event.keyCode == 39){
				player.vx = 2;
				player.tankSkin.x = 6;
				player.animate = 1;
			}
			else if (event.keyCode == 40){
				player.vy = 2;
				player.tankSkin.x = 4;
				player.animate = 1;
			}
		}
	}
}
