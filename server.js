const ws = require('nodejs-websocket');

const player = [null, null];

const server = ws.createServer( conn => {
	const message = { type: "connect" };
	if (player[0] == null) {
		message.status = "player1";
		player[0] = conn;
	}
	else if (player[1] == null) {
		message.status = "player2";
		player[1] = conn;
	}
	else
		message.status = "full";

	conn.sendText(JSON.stringify(message));

	conn.on("text", str => {
		const response = { type: "movement" };
		let target = null;

		if (conn == player[0])
			target = player[1];
		else
			target = player[0];

		target.sendText(JSON.stringify(response));
	});

	conn.on("close", () => {
		const message = { type: "closed" };
		let target = null;

		if (conn == player[0]) {
			player[0] = null;
			target = player[1];
		}
		else {
			target = player[0];
			player[1] = null;
		}

		if (target)
			target.sendText(JSON.stringify(message));
	});
}).listen(9000);
