$(document).ready(function () {
  $('#signup').on('submit', function (e) {
    e.preventDefault();
    $('#signup-form-message').text('');

    var user = {
      email : $('#signup [name="email"]').val(),
      username : $('#signup [name="username"]').val(),
      password : $('#signup [name="password"]').val()
    };

    $.ajax ({
      type: "POST",
      url: '/api/users',
      data: user,
      success: function (response) {
        console.log (response);
        $('#signup-form-message').text('Created User!');
        // Clear input fields
        $('#signup [name="email"]').val('');
        $('#signup [name="username"]').val('');
        $('#signup [name="password"]').val('');

        $.ajax({ // Create a new session
          type: "POST",
          url: "/api/sessions",
          data: user,
          dataType: 'JSON',
          xhrFields: {
            withCredentials: true
          },
          success: function(response){
            window.location.href = '/';
          },
          error: function(response) {
            console.log ('there is an error, mate');
            console.log(response);
          }
        });

      },
      error: function(response) {
        console.log(response);
        $('#signup-form-message').text(response.responseJSON.message);
      }
    });
  });
});