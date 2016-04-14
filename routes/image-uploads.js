exports.register = function(server, options, next) {
  server.route([
    {
      method: 'POST',
      path: '/image/upload',
      config: {
        handler: uploadHandler.upload
      }
    },
  ]);
};

exports.register.attributes = {
  name: 'image-uploads-route',
  version: '0.0.1'
};