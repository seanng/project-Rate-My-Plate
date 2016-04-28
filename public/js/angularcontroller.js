var app = angular.module('RateMyPlateApp', ['ngFileUpload']);
var finishedImage;
var user_id;
var restaurantInfo = {
  latitude: null,
  longitude: null,
  getID: null
};
var dishGrade = null;

app.controller('HomeCtrl',['$scope', '$http', 'Upload', function($scope, $http, Upload){

  $scope.finishedImage = {};

  $scope.gobutton = function(){
    console.log(user_id);

    Upload.upload({
      url: '/image/upload',
      type: 'post',
      fields: $scope.finishedImage
    }).success(function(response){
      console.log('success uploading');
      console.log(response);
      var entry = {
        user_id: user_id,
        imageURL: response.imageURL,
        restaurantID: restaurantInfo.getID,
        restaurantName: $scope.restaurantName,
        restaurantLat: restaurantInfo.latitude,
        restaurantLong: restaurantInfo.longitude,
        dishName: $scope.dishName,
        comment: $scope.userComment
      };
      if (dishGrade){
        entry.dishRating = dishGrade;
      }
      $http({
        method: 'POST',
        url: '/api/entries',
        data: entry
      }).success(function(response){
        console.log (response);
        console.log ('great success to post entry.');
        window.location.href = '/userpage/'+user_id; //Redirect to user page
      }).error(function(response){
        console.log(response);
      });
    });
  };


}]);

$(document).ready(function () {

  user_id = $('#submitbutton').attr('data-id');

  var restaurantAutocomplete = function() {
    var input = document.getElementById('locationTextField');
    var autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addDomListener(window, 'load', autocomplete);

    google.maps.event.addListener(autocomplete, 'place_changed', function(){
      $('#dishNameTextField').removeAttr('disabled');
      $('#dishNameTextField').attr('placeholder','Now enter dish name!');
      var place = autocomplete.getPlace();

      restaurantInfo.getID = place.place_id;
      console.log (place);
      restaurantInfo.latitude = place.geometry.location.lat();
      restaurantInfo.longitude = place.geometry.location.lng();
      getRestaurantDishes(restaurantInfo);
    });
  };

  var restaurantDishes = [];

  var getRestaurantDishes = function(restaurantInfo) {
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

  var init = function(){
    // showCheckInModal();
    restaurantAutocomplete();
    clickStars();
    // submitEntry();
  };

  //append restaurant ID to dish input box

  init();
});