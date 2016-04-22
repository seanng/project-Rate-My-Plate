var uploadHandler = require('../uploadHandler').upload;

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'POST',
      path: '/image/upload',
      handler: uploadHandler
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'image-uploads-route',
  version: '0.0.1'
};