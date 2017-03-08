function applyCommand(gameState, message) {
	const player = gameState.player[message.playerNumber];
	switch (message.command) {
		case commands.STOP_X:
			player.vx = 0;
			player.animate = 0;
			break;

		case commands.STOP_Y:
			player.vy = 0;
			player.animate = 0;
			break;

		case commands.START_LEFT:
			player.vx = -2;
			player.bearing = "left";
			player.animate = 1;
			break;

		case commands.START_UP:
			player.vy = -2;
			player.bearing = "up";
			player.animate = 1;
			break;

		case commands.START_RIGHT:
			player.vx = 2;
			player.bearing = "right";
			player.animate = 1;
			break;

		case commands.START_DOWN:
			player.vy = 2;
			player.bearing = "down";
			player.animate = 1;
			break;

		default:
			throw new Error("Unknown command type: ", message.comand);
	}
}

function update(gameState) {
	let moved = false;
	for(i = 0; i < 2; i++) {
		const player = gameState.player[i];
		if (player.vx != 0) {
			let newX = player.x + player.vx;
			let newY = player.y
			if (!collisionDetection(newX, newY)) {
				player.x = newX;
				moved = true;
			}
		}

		if (player.vy != 0) {
			newX = player.x
			newY = player.y + player.vy;
			if (!collisionDetection(newX, newY)) {
				player.y = newY;
				moved = true;
			}
		}

		if (!moved)
			wallShove(player);
	}
}

function collisionDetection(newX, newY) {
	for (var column = 0; column < map.length; column++) {
		for (var row = 0; row < map[column].length; row++) {
			if (newX > (row-1) * TILE_WIDTH && newX < row * TILE_WIDTH + TILE_WIDTH && newY > (column - 1) * TILE_WIDTH && newY < column * TILE_WIDTH + TILE_WIDTH && map[column][row] > 2 ) {
        return true;
			}
		}
	}
}

function wallShove(player) {
  xPlace = Math.floor(player.x/TILE_WIDTH);
  yPlace = Math.floor(player.y/TILE_WIDTH);

  if (player.vy > 0) {
     if (player.x >= (xPlace+1)*TILE_WIDTH - 12 && map[yPlace + 1][xPlace+1] < 4) {
         player.x += player.vy;
     }
     if (player.x <= (xPlace)*TILE_WIDTH + 12 && map[yPlace + 1][xPlace] < 4) {
         player.x -= player.vy;
     }
  }
  if (player.vy < 0) {
     if (player.x >= (xPlace+1)*TILE_WIDTH - 12 && map[yPlace - 1][xPlace+1] < 4) {
         player.x -= player.vy;
     }
     if (player.x <= (xPlace)*TILE_WIDTH + 12 && map[yPlace - 1][xPlace] < 4) {
         player.x += player.vy;
     }
  }

  if (player.vx > 0) {
     if (player.y >= (yPlace+1)*TILE_WIDTH - 12 && map[yPlace + 1][xPlace+1] < 4) {
         player.y += player.vx;
     }
     if (player.y <= (yPlace)*TILE_WIDTH + 12 && map[yPlace][xPlace + 1] < 4) {
         player.y -= player.vx;
     }
  }
  if (player.vx < 0) {
     if (player.y >= (yPlace+1)*TILE_WIDTH - 12 && map[yPlace + 1][xPlace - 1] < 4) {
         player.y -= player.vx;
     }
     if (player.y <= (yPlace)*TILE_WIDTH + 12 && map[yPlace][xPlace - 1] < 4) {
         player.y += player.vx;
     }
  }
}

if (this.window == undefined) {
	module.exports = {
		update: update,
		applyCommand: applyCommand
	};
}
