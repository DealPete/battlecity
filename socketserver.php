#!/usr/bin/env php
<?php

require_once('PHP-Websockets/users.php');
require_once('PHP-Websockets/websockets.php');


class battleserver extends WebSocketServer {
	protected $player1 = false;
	protected $player2 = false;

	protected function process ($user, $message) {
		echo $message;
	}

	protected function connected ($user) {
		$this->send($user, json_encode(
			["player1" => $this->player1, "player2" => $this->player2]
		));
	}

	protected function closed ($user) {
	}
}

$battle = new battleserver("127.0.0.1", "9000");

$battle->run();
