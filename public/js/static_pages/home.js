// jQuery of Home Page

$(document).ready(function () {

  // Modals
  // var showCheckInModal = function() {
  //   $('#enterrestaurant').on('click', function(e) {
  //     e.preventDefault();
  //     $('#checkinmodal').modal('show');

  //     var focusBox = function(){
  //       $('#checkinmodal').on('shown.bs.modal', function(e) {
  //         $('input[class="searchbox"]')[0].select();
  //       });
  //     };
  //     focusBox();

  //   });
  // };

  var restaurantInfo = {
    getID: null
  };

  var user_id = $('#submitbutton').attr('alt');

  var restaurantAutocomplete = function() {
    var input = document.getElementById('locationTextField');
    var autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addDomListener(window, 'load', autocomplete);

    google.maps.event.addListener(autocomplete, 'place_changed', function(){
      $('#dishNameTextField').removeAttr('disabled');
      $('#dishNameTextField').attr('placeholder','Now enter dish name!')
      var place = autocomplete.getPlace();
      restaurantInfo.getID = place.place_id;
      // restaurantInfo.getLocation = place.geometry.location;
      getRestaurantDishes();
    });
  };

  var restaurantDishes = [];

  var getRestaurantDishes = function() {
    $.ajax({
      type: 'POST',
      url: '/api/dishesforautocomplete',
      data: restaurantInfo,
      error: function (response, status) {
        console.log ('there was an error in posting restaurant dishes.');
        console.log (response);
      },
      success: function (response, status) {
        console.log ('success posting');
        restaurantDishes = [];
        response.forEach(function(elem) {
          restaurantDishes.push(elem.dishName);
        });
        console.log(restaurantDishes);

        $(function() {
          $("#dishNameTextField").autocomplete({
            source: restaurantDishes
          });
        });
      }
    });
  };

  var dishGrade = null; // will change everytime a different star is clicked.

  var clickStars = function() {
    $('#rating1').on('click', function(e){
      e.preventDefault();
      $(this).html('★');
      $('#rating2').html('☆');
      $('#rating3').html('☆');
      $('#rating4').html('☆');
      $('#rating5').html('☆');
      dishGrade = 1;
    });
    $('#rating2').on('click', function(e){
      e.preventDefault();
      $('#rating1').html('★');
      $(this).html('★');
      $('#rating3').html('☆');
      $('#rating4').html('☆');
      $('#rating5').html('☆');
      dishGrade = 2;
    });
    $('#rating3').on('click', function(e){
      e.preventDefault();
      $('#rating1').html('★');
      $('#rating2').html('★');
      $(this).html('★');
      $('#rating4').html('☆');
      $('#rating5').html('☆');
      dishGrade = 3;
    });
    $('#rating4').on('click', function(e){
      e.preventDefault();
      $('#rating1').html('★');
      $('#rating2').html('★');
      $('#rating3').html('★');
      $(this).html('★');
      $('#rating5').html('☆');
      dishGrade = 4;
    });
    $('#rating5').on('click', function(e){
      e.preventDefault();
      $('#rating1').html('★');
      $('#rating2').html('★');
      $('#rating3').html('★');
      $('#rating4').html('★');
      $(this).html('★');
      dishGrade = 5;
    });
  };

  var submitEntry = function() {
    $('#submitbutton').on('click', function (e){
      e.preventDefault();
      // Post an Entry to backend
      var entry = {
        user_id: user_id.toString(),
        // photoURL: ____ ,
        restaurantID: restaurantInfo.getID,
        restaurantName: $('#locationTextField').val(),
        dishName: $('#dishNameTextField').val(),
        comment: $('textarea').val()
      };

      if (dishGrade) {
        entry.dishRating = dishGrade;
      }
      console.log (entry);
      $.ajax ({
        type: "POST",
        url: '/api/entries',
        data: entry,
        success: function (response) {
          console.log (response);
          console.log ('great success to post entry.');
          window.location.href = '/'; //Redirect to user page
        },
        error: function(response) {
          console.log(response);
        }
      });
    });
  };

  var init = function(){
    // showCheckInModal();
    restaurantAutocomplete();
    clickStars();
    submitEntry();
  };

  //append restaurant ID to dish input box

  init();
});