// Filesystem
// var fs = require('fs');

// AWS SDK
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws_config.json');

exports.upload = function (request) {
  // Check if POST of GET
  if (request.payload) {
    console.log(request.payload)
    // Set uploaded file(s)
    var f = request.payload.file;
    // Get path of uploaded file(s)
    // var path = f.path;
    console.log(f);
    // Get image name(s) of uploaded file(s)
    // var imageName = f.originalFilename;
    // Set path/file for thumbnail(s)
    // var thumbPath = __dirname + "/uploads/thumbs/" + imageName;

    var s3 = new AWS.S3();
    // fs.readFile(path, function(err, file_buffer){
      var date = new Date();
      var time = date.getTime().toString();
      var params = {
        Bucket: 'rate-my-plate',
        Key: time,
        Body: f,
        ACL:'public-read'
      };

      s3.putObject(params, function (perr, pres) {
        if (perr) {
          console.log("Error uploading data: ", perr);
        }
        else {
          console.log("Successfully uploaded data to myBucket/myKey");
          // Delete the original file from  server
          // fs.unlink(path, function (err) {
            // if (err) throw err;
            // console.log('Successfully deleted path: ' + f.path);
          // });
            // JSON return for JQuery Upload
          request.reply('{"files": [{ "name": "' + time + '","size": ' + f.size + ',"url": "https:\/\/s3.amazonaws.com\/yourbucketname\/' + time + '","thumbnailUrl": "https:\/\/s3.amazonaws.com\/yourbucketname\/thumb_' + time + '","deleteUrl": "https:\/\/s3.amazonaws.com\/yourbucketname\/' + time + '","deleteType": "DELETE"}]}');
        }
      });
    // });

  }
  else {
    // GET request reply
    request.reply("Ready");
  }
};