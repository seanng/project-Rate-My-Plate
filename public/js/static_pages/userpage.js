// jQuery of User page
$(document).ready(function () {

//Sign Out

  var bindSignout = function() {
    $('.fontawesome-signout').on('click', function (e) {
      console.log('listening');
      $.ajax({
        type: 'DELETE',
        url: '/api/sessions',
        success: function (response) {
          console.log (response);
          window.location.href = '/';
        }
      });
    });
  };

  var init = function(){
    bindSignout();
  };

  init();

});