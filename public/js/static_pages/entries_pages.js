// jQuery of User page
$(document).ready(function () {

  $(function() { //EVENT LISTENERS
    $('.commentbox').on('click', function(e) {
      e.preventDefault();
      console.log ('clicked');
      $(this).hide();
      $(this).parent().find('.txtBox').show();
      $(this).parent().find('.txtBox').focus();
    });

    $('.txtBox').on('blur', function(e) {
      e.preventDefault();
      var newText = $(this).val();
      var entryid = $(this).attr('alt');
      $(this).parent().find('.commentbox').text(newText);
      $(this).parent().find('.commentbox').show();
      $(this).hide();
      editPost(entryid, newText);
    });

    $('.txtBox').on('keyup', function(e) {
      e.preventDefault();
      if (e.keyCode == 13) {
        var newText = $(this).val();
        var entryid = $(this).attr('alt');
        $(this).parent().find('.commentbox').text(newText);
        $(this).parent().find('.commentbox').show();
        $(this).hide();
        editPost(entryid, newText);
      }
    });

    $('.entypo-cancel-squared').on('click', function (e) {
      e.preventDefault();
      var cancelicon = $(this);
      cancelicon.hide();
      var deleteConfirmation = '<div class="deleteconfirmation"> Delete this entry? <span class="entypo-thumbs-up"></span><span class="entypo-thumbs-down"></span></div>';
      cancelicon.parent().append(deleteConfirmation);

      $('.entypo-thumbs-down').on('click', function (e) {
        e.preventDefault();
        cancelicon.show();
        $(this).parent().remove();
      });

      $('.entypo-thumbs-up').on('click', function (e) {
        e.preventDefault();
        var entryid = cancelicon.attr('alt');
        var thisentry = cancelicon.parent().parent().parent();
        deletePost(entryid, thisentry);
      })
    });
  });

  var editPost = function(entryid, newText) {
    $.ajax({
      method: 'PUT',
      url: "/api/entries/updatethisentry",
      data: {
        newComment: newText,
        entryid: entryid
      },
      success: function (response, status) {
        console.log (response);
        console.log ('successful put!');
      },
      error: function(response, status){
        console.log (response);
        console.log ('fail put');
      }
    });
  };

  var deletePost = function(entryid, thisentry) {
    $.ajax({
      method: 'DELETE',
      url: '/api/entries/deletethisentry',
      data: {
        entryid: entryid
      },
      success: function (response, status) {
        console.log (response);
        console.log ('successfully removed entry!');
        thisentry.remove();
      },
      error: function (response, status) {
        console.log (response);
      }
    });
  };



});