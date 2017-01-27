var canvas = document.getElementById('maze');
var ctx = canvas.getContext('2d');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var gain = audioCtx.createGain();
gain.gain.value = 0.1;
gain.connect(audioCtx.destination);

state = { state: "loading" };

var man = new Image();
man.src = "man.png";

let imagesLoaded = 0;

[man].map( image => {
	image.onload = () => {
		imagesLoaded += 1;
		if (imagesLoaded == 1)
			startGame();
	}
});

function startGame() {
	state = {
		state: "playing",
		player: {
			x: 295,
			y: 175,
			vx: 0,
			vy: 0
		}
	}

	window.setInterval(gameLoop, 10);
}

function gameLoop() {
	drawScreen();
	if (state.state == "playing")
		updateState();
}

function drawScreen() {
	ctx.clearRect(0, 0, 640, 400);
	ctx.drawImage(man, state.player.x, state.player.y, 30, 30);
}

function updateState() {
	state.player.x += state.player.vx;
	state.player.y += state.player.vy;
	if (state.player.y < 10)
		state.player.y = 10;
	if (state.player.y > 340)
		state.player.y = 340;
	if (state.player.x < 10)
		state.player.x = 10;
	if (state.player.x > 580)
		state.player.x  = 580;
}

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
