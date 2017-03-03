function drawScreen() {
	ctx.clearRect(0, 0, 960, 640);
  animateTank();
  drawWalls();
}

function animateTank() {
	for(i = 0; i < 2; i++) {
		if (state.player[i].animate != 0) {
			if (state.player[i].animate == 1) {
				state.player[i].tankSkin.x += 1;
				state.player[i].animate = 2;
			} else {
				state.player[i].tankSkin.x -= 1;
				state.player[i].animate = 0;
			}
		}
		ctx.drawImage(sprites, state.player[i].tankSkin.x * TILE_WIDTH, state.player[i].tankSkin.y * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH, state.player[i].x, state.player[i].y, TILE_WIDTH, TILE_WIDTH);
	}
}

function drawWall(tileType, topX, topY, xLength, yLength) {
    ctx.beginPath();
		if (tileType > 2) {
			ctx.drawImage(sprites, tiles[tileType].x * TILE_WIDTH, tiles[tileType].y * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH, topX, topY, xLength, yLength);
		}

    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawWalls() {
	for (var column = 0; column < level.length; column++) {
		for (var row = 0; row < level[column].length; row++) {
			if (level[column][row]) {
				drawWall(level[column][row], row * TILE_WIDTH, column * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
			}
		}
	}
}

