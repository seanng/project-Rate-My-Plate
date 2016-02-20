$(document).ready(function () {
  $('#signup').on('submit', function (e) {
    e.preventDefault();
    $('#signup-form-message').text('');

    var user = {
      email : $('#signup [name="email"]').val(),
      name : $('#signup [name="name"]').val(),
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
        $('#signup [name="email"]').val('');
        $('#signup [name="name"]').val('');
        $('#signup [name="username"]').val('');
        $('#signup [name="password"]').val('');
        window.location.href = '/';
      },
      error: function(response) {
        console.log(response);
        $('#signup-form-message').text(response.responseJSON.message);
      }
    });
  });
});