$(document).ready(function () {
  var bindSignout = function () {
    $('#signout-btn').on('click', function (e) {
      console.log ('signout button');
      $.ajax({
        type: "DELETE",
        url: "/api/signout",
        success: function (response) {
          window.location.href = '/';
        }
      });
    });
  };



  // Sign in Modal
  $('#signin-modal').on('hidden.bs.modal', function (e) {
    var inputs = $('form input');
    var title = $('.modal-title');
    var progressBar = $('.progress-bar');
    var button = $('#modal-footer-sign-in button');

    inputs.removeAttr("disabled");

    progressBar.css({ "width" : "0%" });

    button.removeClass("btn-success")
        .addClass("btn-primary")
        .text("Ok")
        .removeAttr("data-dismiss");

  });

  // Upon clicking button to Sign In
  $('#modal-footer-sign-in button').click(function(e){
    e.preventDefault();
    console.log ('clicked');
    var button = $(this);

    var user = {
      username: $('#uLogin').val(),
      password: $('#uPassword').val()
    };

    console.log(user);

    // Check if the fields match up.


    // If not authenticated, YOUR CODE HERE



    // If successfully authenticated,
    if ( button.attr("data-dismiss") != "modal" ){
      var inputs      = $('.loginmodalforms');
      var title       = $('.modal-title');
      var progress    = $('.progress');
      var progressBar = $('.progress-bar');

      var showButton  = function(){
        progress.hide();
        button.show();
        progressBar.css({ "width" : "0%" });
      };


      // Render progressbar animation
      inputs.attr("disabled", "disabled");
      button.hide();
      progress.show();
      progressBar.animate({width : "100%"}, 100);
      progress.delay(1000)
        .fadeOut(600, showButton);

      // button.text("Close")
      //   .removeClass("btn-primary")
      //   .addClass("btn-success")
      //     .blur()
      //   .delay(1600)
      //   .fadeIn(function(){
      //     title.text("Log in is successful");
      //     button.attr("data-dismiss", "modal");
      //   });

      $.ajax({ // Create a new session
        type: "POST",
        url: "/api/sessions",
        data: user,
        dataType: 'JSON',
        xhrFields: {
          withCredentials: true
        },
        success: function(response){
          console.log("create session / logged in", response.userid);
          window.location.href = '/userpage/'+ response.userid;  //NEED TO go to /userpage/{userid}
        },
        error: function(response) {
          console.log ('there is an error, mate');
          console.log(response);
        }
      });
    }
  });


  // var signinbutton = function() {
  //   $('#signinbutton').on('click', function(e) {

  //     $.ajax({ // Create a new session
  //       type: "POST",
  //       url: "/api/sessions",
  //       data: user,
  //       dataType: 'JSON',
  //       xhrFields: {
  //         withCredentials: true
  //       },
  //       success: function(response){
  //         console.log("create session / logged in", response);
  //         window.location.href = '/userpage';
  //       },
  //       error: function(response) {
  //         console.log ('there is an error, mate');
  //         console.log(response);
  //       }
  //     });
  //   });
  // };

  var searchforthings = function() {
    $('input').eq(0).on('submit', function(e) {
      console.log ('this works');


    });
  };

  var init = function () {
    bindSignout();
    searchforthings();
  };

  init();
});