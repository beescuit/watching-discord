const port = 3000;

const DiscordRPC = require('./RPC');

const ClientId = '434442633457172482';

var youtube = false;
var first = true;

var lastRequest = false;

const moment = require('moment');

const express = require('express');
const app = express();

DiscordRPC.register(ClientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function setActivity() {
  if (youtube) {
    if (Math.round((new Date()).getTime() / 1000) - youtube.last > 5) {
      // timed out
      console.log("Timed out.");
      youtube = false;
      rpc.clearActivity();
    } else {
      console.log("Setting activity");
      rpc.setActivity({
        details: youtube.title,
        state: youtube.author,
        // startTimestamp: youtube.time,
        endTimestamp: youtube.end,
        largeImageKey: 'youtube',
        largeImageText: 'Youtube',
        instance: false
      });
    }
  }
}

rpc.on('ready', () => {
  console.log("RPC ready!");
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
  if (!rpc) {
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
    if (first) {
      setActivity();
      first = false;
    }
    res.send('success!');
  }
  if (req.body.type == "youtube/stop") {
    youtube = false;
    rpc.clearActivity();
  }
});

app.listen(port, () => console.log(`Web server started! (${port})`));
rpc.login(ClientId).catch(console.error);
