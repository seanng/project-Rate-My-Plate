var Path = require('path');
var Hapi = require('hapi');
var server = new Hapi.Server();

// configuring the server address
server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 8000
});

// plugins that needs to be registered
var plugins = [
  { register: require('vision')}, // views
  { register: require('inert')}, // public files hosting
  { register: require('./routes/static_pages.js')}, // Route to GET HTML files
  { register: require('./routes/auth.js')},
  { register: require('./routes/api/sessions.js')},
  { register: require('./routes/api/dishes.js')},
  { register: require('./routes/api/auth.js')},
  { register: require('./routes/api/entries.js')}, // Route for entries data
  { register: require('./routes/api/users.js')}, // Routes for user data
  { register: require('hapi-mongodb'), // setup the mongo connect
    options: {
      "url": process.env.MONGOLAB_URI || "mongodb://127.0.0.1:27017/ratemyplate", // CHANGED
      "settings": {
        "db": {
          "native_parser": false
        }
      }
    }
  },
  {
    register: require('./routes/image-uploads.js'),
    options: {
      views: {
        path: 'templates',
        engines: {
          html: 'handlebars'
        }
      },
      cors: true,
      payload: {
        output: 'stream',
        // multipart: {
        //   mode: "file",
        //   uploadDir: "./uploads"
        // },
        parse: true,
        maxBytes: 20485760,
      },
      timeout: {
        client: '500000',
        socket: '600000'
      }
    }
  },
  {
    register: require('yar'), // setup cookie stuff
    options: {
      cookieOptions: {
        password: process.env.COOKIE_PASSWORD || '12345678912345678912345678912345678912',
        isSecure: false
      }
    }
  }
];

// register plugins into the environment
server.register(plugins, function(err){
  if (err) { throw err; }

  // configure views
  server.views({
    engines: {html: require('ejs')},
    path: Path.join(__dirname, 'views'),
    layout: true,
    layoutPath: Path.join(__dirname, 'views/layouts')
  });

  // start the server
  server.start(function () {
    console.log("listening on..." + server.info.uri);
  });
});
