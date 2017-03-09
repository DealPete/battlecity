let connected = false;
let initialized = false;

var sprites = new Image();

var canvas = document.getElementById('city');
var ctx = canvas.getContext('2d');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var gain = audioCtx.createGain();
gain.gain.value = 0.1;
gain.connect(audioCtx.destination);

let socketUrl = location.origin.replace(/^http/, "ws");

const socket = new WebSocket(socketUrl + ":5000");

socket.onmessage = function(message) {
	var data = JSON.parse(message.data);
	switch(data.type) {
		case "connect":
			if (data == "full") {
				alert("Full!");
			} else {
				state.gameState = data.state;
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
		
		case "game state":
			state.gameState = data.state;
			break;
	}
};
			
const state = {
	mode: "loading",
	lastCommandSent: 0,
	lastCommandReceived: 0,
	commands: []
};

function init() {
	get("level.json", function(response) {
		var jsonRes = JSON.parse(response);
		map = parseMapData(jsonRes);
		get(jsonRes.tileset, function(res) {
			var res = JSON.parse(res);
			sprites.src = res.sprites;
			tiles = res.tiles;

			if (connected)
				startGame()
			else
				initialized = true;
		});
 });
}

function startGame() {
	state.mode = "playing";

	window.addEventListener("keyup", onkeyup);
	window.addEventListener("keydown", onkeydown);

 	window.setInterval(function() {gameLoop();}, TURN_LENGTH_MS);
}

function gameLoop() {
	drawScreen();
	if (state.mode == "playing") {
		update(state.gameState);
	}
}

init();

function submitCommand(command) {
	message = {
		command: command,
		playerNumber: state.playerNumber
	};
	state.commands.push(message);
	socket.send(JSON.stringify(message));
	applyCommand(state.gameState, message);
}

function onkeyup(event) {
	if (state.mode == "playing") {
		if (event.keyCode == 38 || event.keyCode == 40) {
			submitCommand(commands.STOP_Y);
		}
		if (event.keyCode == 37 || event.keyCode == 39) {
			submitCommand(commands.STOP_X);
		}
	}
}

function onkeydown(event) {
	if (state.mode == "playing") {
		if ([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
			event.preventDefault();
			if (event.keyCode == 37) {
				submitCommand(commands.START_LEFT);
			}
			else if (event.keyCode == 38){
				submitCommand(commands.START_UP);
			}
			else if (event.keyCode == 39){
				submitCommand(commands.START_RIGHT);
			}
			else if (event.keyCode == 40){
				submitCommand(commands.START_DOWN);
			}
		}
	}
}
