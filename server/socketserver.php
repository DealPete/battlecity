#!/usr/bin/env php
<?php

require_once('PHP-Websockets/users.php');
require_once('PHP-Websockets/websockets.php');


class battleserver extends WebSocketServer {
	protected $player1 = false;
	protected $player2 = false;

	protected function process ($user, $message) {
		$message = ["type" => "relay"];
		if ($user == $this->player1) {
			$target = $this->player2;
		}
		else {
			$target = $this->player1;
		}

		$this->send($target, json_encode($message));
	}

	protected function connected ($user) {
		$message = ["type" => "connect"];
		if ($this->player1 == false) {
			$message["status"] = "player1";
			$this->player1 = $user;
		} else if ($this->player2 == false) {
			$message["status"] = "player2";
			$this->player2 = $user;
		}
		else {
			$message["status"] = "full";
		}
			
		$this->send($user, json_encode($message));
	}

	protected function closed ($user) {
		$message = ["type" => "closed"];
		$target = null;
		if ($user == $this->player1) {
			$target = $this->player2;
			$this->player1 = false;
		}
		else {
			$target = $this->player1;
			$this->player2 = false;
		}
			
		if ($target)
			$this->send($target, json_encode($message));	
	}
}

$battle = new battleserver("127.0.0.1", "9000");

$battle->run();
