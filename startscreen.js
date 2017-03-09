waiting = [];

let socketUrl = location.origin.replace(/^http/, "ws");

const socket = new WebSocket(socketUrl);

socket.onmessage = function(message) {
	console.log(message.data);
	//player1Div.innerHTML = JSON.parse(message.data).a;
}

const player1Div = document.getElementById("player1");
const player2Div = document.getElementById("player2");

document.getElementById("start-game").onclick = () => {
	socket.send("connect");
}
