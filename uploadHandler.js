// Filesystem
var fs = require('fs');

// AWS SDK
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws_config.json');

exports.upload = function (request, reply) {
  var data  = request.payload;

  if (request.payload) {
    var filename = data.file.hapi.filename;
    var path = __dirname + "/uploads/" + filename;

    var file = fs.createWriteStream(path);

    file.on('error', function (err) {
      console.log(err);
    });

    data.file.pipe(file);

    data.file.on('end', function (err) {
      if (err) { console.log(err); }

      var s3 = new AWS.S3();
      fs.readFile(path, function (err, dataBuffer) {
        if (err) { console.log(err); }
        var date = new Date();
        var time = date.getTime().toString();
        var params = {
          Bucket: 'rate-my-plate',
          Key: filename,
          Body: dataBuffer,
          ACL:'public-read'
        };

        s3.putObject(params, function (perr, pres) {
          if (perr) {
            console.log("Error uploading data: ", perr);
          } else {
            console.log("Successfully uploaded data to myBucket/myKey");
            fs.unlink(path, function (err) {
              if (err) { console.log(err); }
              console.log('Successfully deleted path: ' + path);
              var imageURL = "https:\/\/s3.amazonaws.com\/rate-my-plate\/"+filename;
              reply({imageURL: imageURL});
            });
          }
        });
      });
    });
  } else {
    reply({message: "no file"});
  }
};
