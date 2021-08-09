const fs = require('fs'); //all clips
const https = require('https');
var request = require("request");
const apiFile = require('./apiFile.js')

var token = "";

var fileLogArchive = "";
var fileLogUpload = "";
var info = [];

const config = require('../config.js');


module.exports = {
    ok: function () { return "okay" },
    init:init,
    getUsers: getClipsByUser,
    getGame: getGame,
    getUserById: getUserById,
    downloadClip:downloadClip,
    getClipsMASTER:getClipsMASTER,

}

function init(fileLogArchive_,fileLogUpload_,info_){
    fileLogArchive = fileLogArchive_;
    fileLogUpload = fileLogUpload_;
    info = info_;
  }

function downloadClip(clipToDownload,videoName, streamerName,callback_){
    console.log("DOWNLOAD :"+clipToDownload);
    getUrlDownload(clipToDownload, videoName, streamerName);

    setTimeout(callback_,30000);
}

async function getToken() {
    
    request({
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Accept-Language": "en-US",
        },
        uri: "https://id.twitch.tv/oauth2/token?client_id="+config.tClient+"&client_secret=="+config.tSecret+"&grant_type=client_credentials",


        method: 'POST'
    }, function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        
        //console.log('body:', body); // Print the HTML for the Google homepage.
        const obj = JSON.parse(body);
        //console.log('token twitch:', obj.access_token); // Print the HTML for the Google homepage.   
        // console.error(obj);
        token = obj.access_token;

    });
}




function getClipsByUser(user, severity) {
    //console.log(user);
    if(severity < 5){
        if (token === "") {
            
            getToken();
			severity++;
			console.log("a get token severity : "+severity);
            setTimeout(getClipsByUser.bind(null, user, severity), 1500);
        }
        else {
            request({
                headers: getHead(),
                // uri: "https://api.twitch.tv/helix/clips?broadcaster_id="+user,
                uri: "https://api.twitch.tv/helix/users?login=" + user,
                //uri: "https://api.twitch.tv/helix/streams",

                responseType: "json",
                resolveBodyOnly: true,
                method: 'GET'
            }, function (error, response, body) {
                //debug(error, response, body);
                //const obj = JSON.parse(body);
                //console.log(obj);
                //console.log(body);
                if(body == null || JSON.parse(body).data == null || JSON.parse(body).data[0] == null){
                    //console.log("try to fix "+severity);
					
                    
                    getToken();
                    severity++;
					console.log("a get token_ severity : "+severity);
					setTimeout(getClipsByUser.bind(null,user,severity),1500);
                }
                else{
                    console.log("get of : "+JSON.parse(body).data[0].login);
                    getClipsByUserId(JSON.parse(body).data[0].id, JSON.parse(body).data[0].login,2);
                }
            });
        }
    }
    else{
        console.log("Fatal error of getUsers :"+user);
    }
}


function getClipsByGame(game, severity) {
    //console.log(user);
    if(severity < 5){
        if (token === "") {
            getToken();
			severity++;
            setTimeout(getClipsByGame.bind(null, game, severity), 1500);
        }
        else {
            request({
                headers: getHead(),
                uri: "https://api.twitch.tv/helix/games?name=" + game,
                responseType: "json",
                resolveBodyOnly: true,
                method: 'GET'
            }, function (error, response, body) {
                //debug(error, response, body);
                //const obj = JSON.parse(body);
                //console.log(obj);
                //console.log(error);
                if(body == null || JSON.parse(body).data == null || JSON.parse(body).data[0] == null){
                    //console.log("try to fix "+severity);
					
                    
                    getToken();
                    severity++;
					console.log("a get token_ severity : "+severity);
					setTimeout(getClipsByGame.bind(null,game,severity),1500);
                }
                else{
                    //console.log(JSON.parse(body).data[0].id);
                    // console.log("get of : "+JSON.parse(body).data);
                    getClipsByGameId(JSON.parse(body).data[0].id, JSON.parse(body).data[0].name,3);
                }
            });
        }
    }
    else{
        console.log("Fatal error of getUsers :"+game);
    }
}

function getUserById(userId, callback_,severity) {
    
    if(severity < 5){
        if (token == "") {
			getToken();
			severity++;
            console.log("b get token severity : "+severity);
            setTimeout(getUserById.bind(null, userId, callback_,severity), 1500);
        }
        else {
            request({
                headers: getHead(),
                // uri: "https://api.twitch.tv/helix/clips?broadcaster_id="+user,
                uri: "https://api.twitch.tv/helix/users?id=" + userId,
                responseType: "json",
                resolveBodyOnly: true,
                method: 'GET'
            }, function (error, response, body) {
                const obj = JSON.parse(body);
                //debug(error, response, body);
                if(obj.data[0] == null){
                    //console.log("try :"+severity)
					
					getToken();
					severity++;
                    console.log("b get token severity_ : "+severity);
                    setTimeout(getUserById.bind(null,userId, callback_,severity),1500);   
                }
                else{
                    //console.log(obj.data[0].login);
                    callback_(obj.data[0].login);
                }
            });
        }
    }
    else{
        console.log("Fatal error of getUserById :"+severity);
        callback_("fun");
        // console.log("Fatal error of getUserById :"+userId);
        
    }
}

function getGame(id, callback_,severity) {
    if(severity < 5){
        if (token === "") {
			getToken();
			severity++;
            console.log("c get token severity : "+severity);
            setTimeout(getGame.bind(null, id, callback_,severity), 1500);
        }
        else {
            request({
                headers: getHead(),
                uri: "https://api.twitch.tv/helix/games?id=" + id,
                responseType: "json",
                resolveBodyOnly: true,
                method: 'GET'
            }, function (error, response, body) {
                //debug(error, response, body);
                //console.log(body);

                if(body == null || JSON.parse(body).data[0] == null){
					getToken();
					severity++;
                    console.log("c get token_ severity : "+severity);
                    setTimeout(getGame.bind(null, id, callback_, severity), 1500);
                }
                else{
                    callback_(JSON.parse(body).data[0].name);
                }
            });
        }
    }
    else{
        console.log("Fatal error of getGame :"+id);
        callback_("life");
    }
}
function getClipsByUserId(userId, loginUser, nb) {
    request({
        headers: getHead(),
        uri: "https://api.twitch.tv/helix/clips?first=100&broadcaster_id=" + userId,
        // uri: "https://api.twitch.tv/helix/clips?game_id=" + userId,
        
        responseType: "json",
        resolveBodyOnly: true,
        method: 'GET'
    }, function (error, response, body) {
        const obj = JSON.parse(body);
        //console.log(obj);
        var archiveArray = JSON.parse(("[" + fs.readFileSync(fileLogArchive) + "]").replace("},\n]", "}]"));
        obj.data.forEach((elementToAdd, i) => {
            var b = true;
            archiveArray.forEach(elementInMemory => {
                if (elementInMemory["url"] == elementToAdd.url) {
                    b = false;
                }
            });
            if (b) {
                //setTimeout(getUrlDownload.bind(null, elementToAdd.url, elementToAdd.id + ".mp4", loginUser), i * 1000);
                console.log("add clip in memory "+loginUser);
                setTimeout(fs.appendFileSync.bind(null, fileLogArchive, JSON.stringify(elementToAdd, null, 2) + ",\n"), i * 100 + 100);//don't work now
            }
            else {
                // console.log(elementToAdd);
                // console.log("already in clips memory "+loginUser);
            }
        
        });
        
        nb--;
        if(nb >0 && obj.pagination.cursor != null){
            setTimeout(getClipsByUserId.bind(null,userId+"&after="+obj.pagination.cursor, loginUser,nb),1000);
        }
        else{
            console.log("finish of get : "+loginUser);
        }
    });
}

function getClipsByGameId(gameId, gameName,nb) {
    request({
        headers: getHead(),
        
        uri: "https://api.twitch.tv/helix/clips?first=100&game_id=" + gameId,
        
        responseType: "json",
        resolveBodyOnly: true,
        method: 'GET'
    }, function (error, response, body) {
        const obj = JSON.parse(body);
        //console.log(obj);
        console.log(error);
        //console.log(obj);
        var archiveArray =JSON.parse(("[" + fs.readFileSync(fileLogArchive) + "]").replace("},\n]", "}]"));
        obj.data.forEach((elementToAdd, i) => {
            var b = true;
            archiveArray.forEach(elementInMemory => {
                if (elementInMemory["url"] == elementToAdd.url) {
                    b = false;
                }
            });
            if (b) {
                //setTimeout(getUrlDownload.bind(null, elementToAdd.url, elementToAdd.id + ".mp4", loginUser), i * 1000);
                console.log("add clip in memory "+gameName+":"+elementToAdd.title);
                setTimeout(fs.appendFileSync.bind(null, fileLogArchive, JSON.stringify(elementToAdd, null, 2) + ",\n"), i * 100+100);//don't work now
                // fs.appendFileSync.bind(fileLogArchive, JSON.stringify(elementToAdd, null, 2) + ",\n");
            }
            else {
                // console.log(elementToAdd);
                //console.log("already in clips memory "+gameId);
            }
        
        });
        nb--;
        if(nb >0 && obj.pagination.cursor != null){
            setTimeout(getClipsByGameId.bind(null,gameId+"&after="+obj.pagination.cursor, gameName,nb),1000);
        }
        else{
            console.log("finish of get : "+gameName+gameId);
        }
    });
}





function getUrlDownload(url, videoName, streamerName) {
    request({
        headers: getHead(),
        uri: "https://fr.clipr.xyz/api/grabclip",
        responseType: "json",
        formData: {
            clip_url: url
        },
        method: 'POST'
    }, function (error, response, body) {
        console.log(body);    
        console.log(error);  
        const obj = JSON.parse(body);
        console.log("https:" + obj.download_url);
        


        if (!fs.existsSync("./video/" + streamerName)) {
            fs.mkdirSync("./video/" + streamerName);
            console.log("Dir streamer created")
        }
        const file = fs.createWriteStream("./video/" + streamerName + "/" + videoName);

        const download = https.get("https:" + obj.download_url,
            function (response) {
                response.pipe(file);
            });
    });

}






function getHead() {
    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Language": "en-US",
        "Authorization": "Bearer " + token,
        "Client-Id": "rzf6hv8vu6240limdjg7kbn9adu7ek"
    }
}

function debug(error, response, body) {
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    const obj = JSON.parse(body);
    console.log(obj);
}

function getClipsMASTER(mode){

    info.forEach(function(info,index){
        switch(mode){
            case "streamer" :{
                console.log("get by streamer");
                setTimeout(getClipsByUser.bind(null,info,0),index*1000);
                break;
            }
            case "game" :{
                console.log("get by game");
                setTimeout(getClipsByGame.bind(null,info,0),index*1000);
                break;
            }
        }
     });
  
}

//initListStreamer();
