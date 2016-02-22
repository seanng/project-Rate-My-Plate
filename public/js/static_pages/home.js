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
        // dishID:
        // dishRating: rating, <-- Not an array
        comment: $('textarea').val()
      };

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
    submitEntry();
  };

  //append restaurant ID to dish input box

  init();
});