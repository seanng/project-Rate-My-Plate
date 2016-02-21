// TO HANDLE STATIC PAGES REQUESTS

var Authenticated = require("./modules/Authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    { // serving static files
      method: 'GET',
      path: "/public/{path*}",
      handler: {
        directory: {
          path: 'public'
        }
      }
    },
    { // Home Page
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var data = { authenticated: result.authenticated };

          if (result.authenticated) { //if authenticated,
            var userid = result.userid.toString();
            data = {
              authenticated: result.authenticated,
              userid: userid
            };
            return reply.view('static_pages/home', data).code(200);
          }
          else
            console.log (data, 123123123);
            reply.view('static_pages/home', data).code(200);
        });
      }
    },
    { // User Page
      method: 'GET',
      path: '/userpage',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var data = result;
          reply.view('static_pages/userpage', data).code(200);
          console.log (data);
        });
      }
    },
    { // Account registration
      method: 'GET',
      path: '/signup',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var data = result;
          reply.view('static_pages/signup', data).code(200);
        });
      }
    },
    { // Search Results Page
      method: 'GET',
      path: '/results',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var data = result;
          reply.view('static_pages/results', data).code(200);
        });
      }
    }

  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-views',
  version: '0.0.1'
};
