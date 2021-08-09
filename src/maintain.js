
const config = require('./config.js');

const twitchDownload =require("./api/getTwitch.js");
const apiFile = require('./api/apiFile.js')

if( typeof process.argv[2] === "undefined"){
    console.log("no bot to maintain");
}
else{
    var i = process.argv[2];
    apiFile.init       (config.archive[i],config.upload[i],config.info[i]);
    twitchDownload.init(config.archive[i],config.upload[i],config.info[i]);

    twitchDownload.getClipsMASTER(config.mode[i]);
    //uploadTiktok.init  (config.archive[i],config.upload[i],config.streamer[i]);
}
  


