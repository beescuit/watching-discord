// RichPresence loader for websites

function changestatus(data) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://127.0.0.1:3000/changestatus", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(data));
}

function injectscript(url) {
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function(){
    console.log("Loaded script");
  };
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

if (window.location.href.startsWith("https://www.youtube.com/watch?v=")) {
  // Youtube
  // Inject script to be able to access the window object.
  injectscript(chrome.extension.getURL('youtube.js'));
} else if (window.location.href.startsWith("https://www.netflix.com/watch/")) {
  // GAMBIARRA
  setTimeout(() => {
    var video = document.getElementById(window.location.pathname.split("/")[2]).children[0];
    video.ontimeupdate = () => {
      if (document.getElementsByClassName("ellipsize-text")[0].children.length > 0) {
        // Series
        var title = document.getElementsByClassName("ellipsize-text")[0].children[0].innerHTML;
        var desc = document.getElementsByClassName("ellipsize-text")[0].children[1].innerHTML + " " + document.getElementsByClassName("ellipsize-text")[0].children[2].innerHTML;
        var time = video.currentTime;
        var duration = video.duration;
        changestatus({type: "netflix", title, desc, time, duration});
      } else {
        // Film
        var title = document.getElementsByClassName("ellipsize-text")[0].innerHTML;
        var time = video.currentTime;
        var duration = video.duration;
        changestatus({type: "netflix", title, desc: false, time, duration});
      }
    }

    // Some checks to remove the presence when not watching
    video.onpause = () => {
      changestatus({type: "netflix/stop"});
    }
    video.onended = () => {
      changestatus({type: "netflix/stop"});
    }
  }, 10000)
}
