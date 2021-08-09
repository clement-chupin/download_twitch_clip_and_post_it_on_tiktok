const fs = require('fs');

var streamers=[];

module.exports = {
    ok: function () { return "okay" },
    init: init,
    deleteClip: deleteClip,
}


function deleteClip(clipPath){
  console.log("DELETE : "+clipPath);
  fs.unlinkSync(clipPath);
}


function init(fileLogArchive,fileLogUpload,info){
  if (!fs.existsSync("./log/")){
    fs.mkdirSync("./log/");
    console.log("Dir logs created");
  }
  if (!fs.existsSync("./video/")){
    fs.mkdirSync("./video/");
    console.log("Dir video created")
  }
  if(!fs.existsSync(fileLogUpload)) {
    fs.appendFile(fileLogUpload, '', function (err) {
      if(err) throw err;
      console.log('New log created');
    });
  }
  if(!fs.existsSync(fileLogArchive)) {
    fs.appendFile(fileLogArchive, '', function (err) {
      if(err) throw err;
      console.log('New log created');
    });
  }

}