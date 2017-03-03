function updateState() {
	var moved = false;
	for(i = 0; i < 2; i++) {
		if (state.player[i].vx != 0) {
			let newX = state.player[i].x + state.player[i].vx;
			let newY = state.player[i].y
			if (!collisionDetection(newX, newY)) {
				state.player[i].x = newX;
				moved = true;
			}
		}

		if (state.player[i].vy != 0) {
			newX = state.player[i].x
			newY = state.player[i].y + state.player[i].vy;
			if (!collisionDetection(newX, newY)) {
				state.player[i].y = newY;
				moved = true;
			}
		}

		if (!moved)
			wallShove(state.player[i]);
	}
}

function collisionDetection(newX, newY) {
	for (var column = 0; column < level.length; column++) {
		for (var row = 0; row < level[column].length; row++) {
			if (newX > (row-1) * TILE_WIDTH && newX < row * TILE_WIDTH + TILE_WIDTH && newY > (column - 1) * TILE_WIDTH && newY < column * TILE_WIDTH + TILE_WIDTH && level[column][row] > 2 ) {
        return true;
			}
		}
	}
}

function wallShove(player) {
  xPlace = Math.floor(player.x/TILE_WIDTH);
  yPlace = Math.floor(player.y/TILE_WIDTH);

  if (player.vy > 0) {
     if (player.x >= (xPlace+1)*TILE_WIDTH - 12 && level[yPlace + 1][xPlace+1] < 4) {
         player.x += player.vy;
     }
     if (player.x <= (xPlace)*TILE_WIDTH + 12 && level[yPlace + 1][xPlace] < 4) {
         player.x -= player.vy;
     }
  }
  if (player.vy < 0) {
     if (player.x >= (xPlace+1)*TILE_WIDTH - 12 && level[yPlace - 1][xPlace+1] < 4) {
         player.x -= player.vy;
     }
     if (player.x <= (xPlace)*TILE_WIDTH + 12 && level[yPlace - 1][xPlace] < 4) {
         player.x += player.vy;
     }
  }

  if (player.vx > 0) {
     if (player.y >= (yPlace+1)*TILE_WIDTH - 12 && level[yPlace + 1][xPlace+1] < 4) {
         player.y += player.vx;
     }
     if (player.y <= (yPlace)*TILE_WIDTH + 12 && level[yPlace][xPlace + 1] < 4) {
         player.y -= player.vx;
     }
  }
  if (player.vx < 0) {
     if (player.y >= (yPlace+1)*TILE_WIDTH - 12 && level[yPlace + 1][xPlace - 1] < 4) {
         player.y -= player.vx;
     }
     if (player.y <= (yPlace)*TILE_WIDTH + 12 && level[yPlace][xPlace - 1] < 4) {
         player.y += player.vx;
     }
  }
}
