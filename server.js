Object.assign(global, require('./game/defines.js'));
const init = require('./game/init.js');
      update = require('./game/update.js');

const fs = require('fs'),
      ws = require('nodejs-websocket');

const level = JSON.parse(fs.readFileSync("level.json"));

if (level.tank1 == "absent" || level.tank2 == "absent")
	throw new Error("The level should have both tank starting spots.");

global.map = init.parseMapData(level);

const gameState = {
	turn: 0,
	player: init.initPlayerData(level)
};

const connection = [null, null];
const commands = [];

const server = ws.createServer( conn => {
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

	conn.sendText(JSON.stringify(message));

	conn.on("text", str => {
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
			target.sendText(JSON.stringify(message));
	});
}).listen(9000);

setInterval(update.update, TURN_LENGTH_MS, gameState);
setInterval(contactClients, TIME_STEP_MS);

function contactClients() {
	const message = { type: "game state" };
	message.state = gameState;
	for (conn of connection) {
		if (conn)
			conn.sendText(JSON.stringify(message));
	}
}
