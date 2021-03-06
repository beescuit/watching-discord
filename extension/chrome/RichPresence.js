// RichPresence loader for websites

function changestatus (data) {
  var xhttp = new window.XMLHttpRequest()
  xhttp.open('POST', 'http://127.0.0.1:3000/changestatus', true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.send(JSON.stringify(data))
}

if (window.location.href.startsWith('https://www.youtube.com/watch?v=')) {
  // Youtube
  var video = document.getElementsByTagName('video')[0]
  video.ontimeupdate = () => {
    // Dumb thing to do but we don't have access to the window.ytplayer variable =(
    var title = document.getElementsByClassName('title')[0].innerHTML.split('>')[1].split('<')[0]
    var author = document.querySelectorAll('#owner-name')[1].innerHTML.split('>')[1].split('<')[0]
    // Get time and duration from HTML's api
    var time = video.currentTime
    var duration = video.duration
    // Call the changestatus function
    changestatus({type: 'youtube', title, author, time, duration})
  }

  // Some checks to remove the presence when not watching
  video.onpause = () => {
    changestatus({type: 'youtube/stop'})
  }
  video.onended = () => {
    changestatus({type: 'youtube/stop'})
  }
} else if (window.location.href.startsWith('https://www.netflix.com/watch/')) {
  // GAMBIARRA
  setTimeout(() => {
    var title, time, duration, desc
    var video = document.getElementById(window.location.pathname.split('/')[2]).children[0]
    video.ontimeupdate = () => {
      if (document.getElementsByClassName('ellipsize-text')[0].children.length > 0) {
        // Series
        title = document.getElementsByClassName('ellipsize-text')[0].children[0].innerHTML
        desc = document.getElementsByClassName('ellipsize-text')[0].children[1].innerHTML + ' ' + document.getElementsByClassName('ellipsize-text')[0].children[2].innerHTML
        time = video.currentTime
        duration = video.duration
        changestatus({type: 'netflix', title, desc, time, duration})
      } else {
        // Film
        title = document.getElementsByClassName('ellipsize-text')[0].innerHTML
        time = video.currentTime
        duration = video.duration
        changestatus({type: 'netflix', title, desc: false, time, duration})
      }
    }

    // Some checks to remove the presence when not watching
    video.onpause = () => {
      changestatus({type: 'netflix/stop'})
    }
    video.onended = () => {
      changestatus({type: 'netflix/stop'})
    }
  }, 10000)
}
