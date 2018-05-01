console.log("YOUTUBE SCRIPT LOADED");

function changestatus(data) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://127.0.0.1:3000/changestatus", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(data));
}

var video = document.getElementsByTagName("video")[0];
video.ontimeupdate = () => {
  var title = window.ytplayer.config.args.title;
  var author = window.ytplayer.config.args.author;
  // Get time and duration from HTML's api
  var time = video.currentTime;
  var duration = video.duration;
  // Call the changestatus function
  changestatus({type: "youtube", title, author, time, duration});
}

// Some checks to remove the presence when not watching
video.onpause = () => {
  changestatus({type: "youtube/stop"});
}
video.onended = () => {
  changestatus({type: "youtube/stop"});
}
