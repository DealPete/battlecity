<?php
	$json = file_get_contents('php://input');

	$fp = fopen('level.json', 'w');
	fwrite($fp, $json);
	fclose($fp);
?>
