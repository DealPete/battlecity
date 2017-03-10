const tankFrames = {
	up :
		{ x: 0 },
	down :
		{ x: 4 },
	left :
		{ x: 2 },
	right :
		{ x: 6 }
};

function drawScreen() {
	ctx.clearRect(0, 0, 960, 640);
  drawTank();
  drawWalls();
}

function drawTank() {
	for(i = 0; i < 2; i++) {
		const player = state.gameState.player[i];

		let frameX = (tankFrames[player.bearing].x + player.animate) * TILE_WIDTH,
		    frameY = (i * TILE_WIDTH * 8);
				
		ctx.drawImage(sprites, frameX, frameY, TILE_WIDTH, TILE_WIDTH, player.x, player.y, TILE_WIDTH, TILE_WIDTH);
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
	for (var column = 0; column < map.length; column++) {
		for (var row = 0; row < map[column].length; row++) {
			if (map[column][row]) {
				drawWall(map[column][row], row * TILE_WIDTH, column * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
			}
		}
	}
}

