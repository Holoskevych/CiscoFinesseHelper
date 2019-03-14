chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var stateText = document.getElementById("state-text");
	if(stateText){
		var currentStatus = document.getElementById("state-text").outerText;
	}
	if(request.action == "updateStatus"){
		var currentStatus = document.getElementById("state-text").outerText;
		var userInfo = document.getElementById("user-info-text").outerText;
		chrome.runtime.sendMessage({ action: "currentStatus", currentstatus: currentStatus });
		chrome.runtime.sendMessage({ action: "currentUser", currentuser: userInfo });
	}
	if(request.action == "selectStatus"){
		if(request.selectedstatus.toString().includes("NOTREADY")){
			var $notReady = $('a:contains(Not Ready)');
			$notReady[0].click();
		}else{
			var $ready = $('a:contains(Ready)');
			$ready[0].click();
		}
	}
	if(request.action == "keepActive" && document.getElementById("state-text").outerText){
		var currentStatus = document.getElementById("state-text").outerText;
		if (currentStatus && (currentStatus == "Ready" || currentStatus.includes("Talking"))){
			chrome.runtime.sendMessage({ action: "readyCounter" });
			sendUpdatedStatus();
		}
	}
});

function sendUpdatedStatus() {
	var stateText = document.getElementById("state-text");
	if(stateText){
		var currentStatus = stateText.outerText;
	}
	if(currentStatus){
		chrome.runtime.sendMessage({ action: "currentStatus", currentstatus: currentStatus });
	}
}

$(function () {
  $("#state-btn").on('DOMSubtreeModified', "span", function () {
    sendUpdatedStatus();
  });
});

sendUpdatedStatus();

//Heartbeat to increase the time logged.
$(document).ready(function() {
	setInterval(function() {
		var currentStatus = document.getElementById("state-text").outerText;
		if (currentStatus && (currentStatus == "Ready" || currentStatus.includes("Talking"))){
			chrome.runtime.sendMessage({ action: "readyCounter" });
			sendUpdatedStatus();
		}
	}, 1 * 1000);
});