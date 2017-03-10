const WebSocketServer = require('ws').Server;
const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

let level = JSON.parse(fs.readFileSync("level.json"));
let tileset = JSON.parse(fs.readFileSync(level.tileset));

app.get("/level", (req, res) => {
	res.send(JSON.stringify(level));
});

app.get("/tileset", (req, res) => {
	res.send(JSON.stringify(tileset));
});

app.post("/level", (req, res) => {
	level = req.body;
	fs.writeFileSync("level.json", JSON.stringify(level));
});

const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port);
console.log("Listening on port", port);

Object.assign(global, require('./public/game/defines.js'));
const init = require('./public/game/init.js'),
      update = require('./public/game/update.js');

if (level.tank1 == "absent" || level.tank2 == "absent")
	throw new Error("The level should have both tank starting spots.");

global.map = init.parseMapData(level);

const gameState = {
	turn: 0,
	player: init.initPlayerData(level)
};

const connection = [null, null];
const commands = [];

const wss = new WebSocketServer({server: server});

wss.on("connection", conn => {
	const message = { type: "connect", state: gameState };
	if (connection[0] == null) {
		message.status = "player1";
		connection[0] = conn;
	}
	else if (connection[1] == null) {
		message.status = "player2";
		connection[1] = conn;
	}
	else
		message.status = "full";

	conn.send(JSON.stringify(message));

	conn.on("message", str => {
		const message = JSON.parse(str);
		update.applyCommand(gameState, message);
	});

	conn.on("close", () => {
		const message = { type: "closed" };
		let target = null;

		if (conn == connection[0]) {
			connection[0] = null;
			target = connection[1];
		}
		else {
			target = connection[0];
			connection[1] = null;
		}

		if (target)
			target.send(JSON.stringify(message));
	});
});

setInterval(update.update, TURN_LENGTH_MS, gameState);
setInterval(contactClients, TIME_STEP_MS);

function contactClients() {
	const message = { type: "game state" };
	message.state = gameState;
	for (conn of connection) {
		if (conn)
			conn.send(JSON.stringify(message));
	}
}
