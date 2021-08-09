const twitchDownload =require("./api/getTwitch.js");
const uploadTiktok = require('./api/postClipToTiktok.js')
const apiFile = require('./api/apiFile.js')


const config = require('./config.js');
//console.log(config.archive);


console.log("Bot tik tok upload");
console.log("Test of twitchDownload :"+twitchDownload.ok());
console.log("Test of tiktok upload :"+uploadTiktok.ok());
console.log("Test of apiFile :"+apiFile.ok());


if( typeof process.argv[2] === "undefined"){
  console.log("please specify an index");
}
else{
  var i = process.argv[2];
  apiFile.init       (config.archive[i],config.upload[i],config.info[i]);
  twitchDownload.init(config.archive[i],config.upload[i],config.info[i]);
  uploadTiktok.init  (config.archive[i],config.upload[i],config.info[i]);

  uploadTiktok.postVideo(twitchDownload,apiFile,config.user[i],config.pass[i]);
}
console.log("END");




/*
const { exec } = require("child_process");
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/getInfo', (req, res) => {
    res.set('Content-Type', 'text/html');
    exec("node ./src/command/getSize.js", (error, stdout, stderr) => {    
      //console.log(error);
      // console.log(`stdout: ${stdout}`);
      res.send(stdout);

    });
    
});

app.get('/deleteStreamer', (req, res) => {
  res.set('Content-Type', 'text/html');
  exec("node ./src/command/deleteStreamer.js "+req.query.streamer, (error, stdout, stderr) => {    
    var page ="";
    page+=(stdout);
    page+=(error);
    page+=(stderr);
    res.send(page);

  });
  
});

app.get('/addStreamer', (req, res) => {
  res.set('Content-Type', 'text/html');
  exec("node ./src/command/addStreamer.js "+req.query.streamer, (error, stdout, stderr) => {    
    var page ="";
    page+=(stdout);
    page+=(error);
    page+=(stderr);
    res.send(page);

  });
  
});

app.get('/refreshList', (req, res) => {
  res.set('Content-Type', 'text/html');
  exec("node ./src/command/refreshListClip.js "+req.query.streamer, (error, stdout, stderr) => {    
    var page ="";
    page+=(stdout);
    page+=(error);
    page+=(stderr);
    res.send(page.replace(/\n/g, '<br/>'));
  });
  
});

app.get('/getStreamers', (req, res) => {
  res.set('Content-Type', 'text/html');
  exec("node ./src/command/getStreamers.js", (error, stdout, stderr) => {    
    var page ="";
    page+=(stdout);
    page+=(error);
    page+=(stderr);
    res.send(page);

  });
  
});

app.get('/getStreamersByClips', (req, res) => {
  res.set('Content-Type', 'text/html');
  exec("node ./src/command/getClips.js", (error, stdout, stderr) => {    
    var page ="";
    page+=(stdout);
    page+=(error);
    page+=(stderr);
    res.send(page);

  });
  
});




app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  var page ="";

  page+=("You can see info of the bot : <a href='/getInfo'>getInfo</a><br/>");
  page+=("You can add streamer : <a href='/addStreamer?streamer='>addStreamer</a><br/>");
  page+=("You can delete streamer : <a href='/deleteStreamer?streamer='>deleteStreamer</a><br/>");
  page+=("You can get streamers : <a href='/getStreamers'>getStreamers</a><br/>");
  page+=("You can get streamers by clips : <a href='/getStreamersByClips'>getStreamersByClips</a><br/>");
  page+=("You can refresh the clip list : <a href='/refreshList'>refreshList</a><br/>");
  res.send(page);
  
});

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});


*/