const port = 3000;

const DRPCs = {
  youtube: require('discord-rpc'),
  netflix: require('discord-rpc')
}

const cIds = {
  youtube: '434442633457172482',
  netflix: '435127726186430475'
};

var youtube = false;
var netflix = false;

const express = require('express');
const app = express();

const rpcs = {
  youtube: new DRPCs.youtube.Client({ transport: 'ipc' }),
  netflix: new DRPCs.netflix.Client({ transport: 'ipc' }),
}

async function setActivity() {
  if (youtube) {
    if (Math.round((new Date()).getTime() / 1000) - youtube.last > 5) {
      // timed out
      console.log("Timed out.");
      youtube = false;
      rpcs.youtube.clearActivity();
    } else {
      console.log("Setting activity");
      rpcs.youtube.setActivity({
        details: youtube.title,
        state: youtube.author,
        // startTimestamp: youtube.time,
        endTimestamp: youtube.end,
        largeImageKey: 'youtube',
        largeImageText: 'Youtube',
        instance: false
      });
    }
  } else if (netflix) {
    if (Math.round((new Date()).getTime() / 1000) - netflix.last > 5) {
      // timed out
      console.log("Timed out.");
      netflix = false;
      rpcs.netflix.clearActivity();
    } else {
      console.log("Setting activity");
      if (netflix.desc) {
        rpcs.netflix.setActivity({
          details: netflix.title,
          state: netflix.desc,
          // startTimestamp: youtube.time,
          endTimestamp: netflix.end,
          largeImageKey: 'netflix',
          largeImageText: 'Netflix',
          instance: false
        });
      } else {
        rpcs.netflix.setActivity({
          details: netflix.title,
          // startTimestamp: netflix.time,
          endTimestamp: netflix.end,
          largeImageKey: 'netflix',
          largeImageText: 'Netflix',
          instance: false
        });
      }
    }
  }
}

rpcs.youtube.on('ready', () => {
  console.log("Youtube RPC ready!");
  setInterval(() => {
    setActivity();
  }, 15e3);
});
rpcs.netflix.on('ready', () => {
  console.log("Netflix RPC ready!");
  setInterval(() => {
    setActivity();
  }, 15e3);
});

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/changestatus', (req, res) => {
  if (!rpcs.youtube || !rpcs.netflix) {
    res.send("RPC not ready!");
    return;
  }
  if (req.body.type == "youtube") {
    youtube = {
      title: req.body.title,
      author: req.body.author,
      time: Math.round((new Date()).getTime() / 1000) - Math.round(req.body.time, 0),
      end: Math.round((new Date()).getTime() / 1000) + (Math.round(req.body.duration, 0) - Math.round(req.body.time, 0)),
      last: Math.round((new Date()).getTime() / 1000)
    }
    res.send('success!');
  } else if (req.body.type == "youtube/stop") {
    youtube = false;
    res.send('stopped');
    rpcs.youtube.clearActivity();
  } else if (req.body.type == "netflix") {
    netflix = {
      title: req.body.title,
      desc: req.body.desc,
      time: Math.round((new Date()).getTime() / 1000) - Math.round(req.body.time, 0),
      end: Math.round((new Date()).getTime() / 1000) + (Math.round(req.body.duration, 0) - Math.round(req.body.time, 0)),
      last: Math.round((new Date()).getTime() / 1000)
    }
    res.send('success!');
  } else if (req.body.type == "netflix/stop") {
    netflix = false;
    rpcs.netflix.clearActivity();
    res.send('stopped');
  }
});

app.listen(port, () => console.log(`Web server started! (${port})`));
rpcs.youtube.login({ clientId: cIds.youtube }).catch(console.error);
rpcs.netflix.login({ clientId: cIds.netflix }).catch(console.error);
