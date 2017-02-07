function post(requestPage, data, callback) {
	var xmlhttp = new XMLHttpRequest("POST");
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText);
		}
	}
	xmlhttp.open("POST", requestPage);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(data);
}

function get(requestPage, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText);
		}
	}
	xmlhttp.open("GET", requestPage);
	xmlhttp.send();
}
