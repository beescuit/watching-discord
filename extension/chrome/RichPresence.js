// RichPresence loader for websites

function changestatus(data) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://127.0.0.1:3000/changestatus", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(data));
}

if (window.location.href.startsWith("https://www.youtube.com/watch?v=")) {
  // Youtube
  var video = document.getElementsByTagName("video")[0];
  video.ontimeupdate = () => {
    // Dumb thing to do but we don't have access to the window.ytplayer variable =(
    var title = document.title.replace(" - YouTube", "");
    var author = document.getElementById("owner-name").innerHTML.split(">")[1].split("<")[0];
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
}
