// jQuery of Home Page

$(document).ready(function () {
  // Get User Page
  var submitEntry = function() {
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
  };

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
    getId: null,
    getLocation: null
  };

  var restaurantAutocomplete = function() {
    var input = document.getElementById('locationTextField');
    var autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addDomListener(window, 'load', autocomplete);

    google.maps.event.addListener(autocomplete, 'place_changed', function(){
      $('#dishNameTextField').removeAttr('disabled');
      var place = autocomplete.getPlace();
      restaurantInfo.getID = place.place_id;
      restaurantInfo.getLocation = place.geometry.location;
      console.log(restaurantInfo);
      getRestaurantDishes();

    });
  };

  // var restaurantDishes = [];

  // var getRestaurantDishes = function() {
  //   $.ajax({
  //     type: "GET",
  //     url: "/api/dishes",
  //     data: restaurantInfo,
  //     success: function (response, status) {
  //       console.log (response);
  //       response.forEach(function(dish) {
  //         restaurantDishes.push(dish);
  //       });
  //     },
  //     error: function (response, status){
  //       console.log ('there was an error in getting restaurant dishes. Here is the response.');
  //       console.log (response);
  //     }
  //   });
  // };

  var init = function(){
    // showCheckInModal();
    restaurantAutocomplete();
    submitEntry();
  };

  //append restaurant ID to dish input box

  init();
});