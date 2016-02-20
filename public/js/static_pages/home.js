// jQuery of Home Page

$(document).ready(function () {
  // Get User Page
  $('#submitbutton').on('click', function (e){
    e.preventDefault();



// Post an Entry to backend
   var entry = {
      // userid: _____ ,
      // photoURL: ____ ,
      // restaurant: _____,
      dishname: $('.form-control').eq(1).val(),
      // rating: _____,
      comment: $('textarea').val()
   };

    $.ajax ({
      type: "POST",
      url: '/api/entries',
      data: entry,
      success: function (response) {
        console.log (response);
        window.location.href = '/userpage'; //Redirect to user page

      },
      error: function(response) {
        console.log(response);

      }
    });
  });

});