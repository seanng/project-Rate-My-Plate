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
          var data = result; // need to have authenticated inorder to show signout button
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
