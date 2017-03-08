const defines = {
	TILE_WIDTH: 32,
	TURN_LENGTH_MS: 15,
	TIME_STEP_MS: 15,
	commands: {
		START_UP: 0,
		START_DOWN: 1,
		START_LEFT: 2,
		START_RIGHT: 3,
		STOP_X: 4,
		STOP_Y: 5
	}
}

if (this.window == undefined)
	module.exports = defines;
else
	Object.assign(window, defines);
