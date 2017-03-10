function initPlayerData(level) {
	const player = [];
	for (i = 0; i < 2; i++) {
		player.push({
			x : (level["tank" + (i+1)] % level.width) * TILE_WIDTH,
			y : Math.floor(level["tank" + (i+1)] / level.width) * TILE_WIDTH,
			vx : 0,
			vy : 0,
			animate : 0,
			bearing : "up"
		});
	}

	return player;
}

function parseMapData(level) {
	const map = [];
	for (let y = 0; y < level.height; y++) {
		map.push([]);
		for (let x = 0; x < level.width; x++) {
			map[y].push(level.data[y * level.width + x]);
		}
	}
	return map;
}

if (this.window == undefined) {
	module.exports = { 
		initPlayerData : initPlayerData,
		parseMapData : parseMapData
	};
}
