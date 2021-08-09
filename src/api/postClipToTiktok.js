const post = require('./tiktokUploadApi/main.js')
const fs = require('fs'); //all clips
const { log } = require('console');

var fileLogArchive = "";
var fileLogUpload = "";
var info = [];



module.exports = {
  ok: function () { return "okay" },
  init:init,
  postVideo: postVideo
}

function init(fileLogArchive_,fileLogUpload_,info_){
  fileLogArchive = fileLogArchive_;
  fileLogUpload = fileLogUpload_;
  info = info_;
}

function postVideo(twitchApi,apiFile, fbUser, fbPass) {

  //console.log("data");
  //var archive = fs.readFileSync(fileLogArchive);

  //let obj = JSON.parse(archive);

  var choice = 0;
  var videoToUpload = null;
  var rawDataArchive = ("[" + fs.readFileSync(fileLogArchive) + "]").replace("},\n]", "}]");
  var rawDataUpload = ("[" + fs.readFileSync(fileLogUpload) + "]").replace("},\n]", "}]");
  var jsonParseArchive = JSON.parse(rawDataArchive);
  var jsonParseUpload = JSON.parse(rawDataUpload);

  //console.log(jsonParseArchive[0]);
  if (jsonParseArchive.length - jsonParseUpload.length == 0) {
    console.log("not enough video in stock");
  }
  else {
    console.log("finding a video to upload");
    do {
      var b = false;
      choice = parseInt(Math.random() * (jsonParseArchive.length));

      videoToUpload = jsonParseArchive[choice];

      jsonParseUpload.forEach((elementInMemory, index) => {
        if (videoToUpload.url == elementInMemory.url) {
          b = true;
        }
      });
    }
    while (b);
    if (videoToUpload != null) {
      // if (!(typeof videoToUpload === 'undefined')) {
      //fs.appendFileSync(fileLogUpload, JSON.stringify(videoToUpload, null, 2) + ",\n");

      var gameTitle = "";
      var loginStreamer = "";
      


      setTimeout(
        function () {
          twitchApi.getGame(videoToUpload.game_id, function (response) {
            gameTitle = response;
          },0);
        }, 1500);

      setTimeout(
        function () {
          twitchApi.getUserById(videoToUpload.broadcaster_id, function (response) {
            loginStreamer = response;
          },0);
        }, 2500);

      setTimeout(
        function () {
          var clipToUpload = "./video/" + loginStreamer + "/" + videoToUpload.id + ".mp4";

          twitchApi.downloadClip(videoToUpload.url,videoToUpload.id+".mp4",loginStreamer,function(){
            console.log(videoToUpload.title +
              " par " + videoToUpload.broadcaster_name +
              " #twitch #clip #" + gameTitle.replace(/\ /g, '') +
              " #" + loginStreamer);
  
            post.post(fbUser, fbPass, clipToUpload,
              videoToUpload.title +
              " by " + videoToUpload.broadcaster_name +
              " #twitch #clip #" + gameTitle.replace(/\ /g, '').toLowerCase() +
              " #" + loginStreamer.toLowerCase(),
              apiFile);
              
            fs.appendFileSync(fileLogUpload, JSON.stringify(videoToUpload, null, 2) + ",\n");
          });

        }, 10000);
    }
  }
}




