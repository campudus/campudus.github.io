// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation({
  equalizer : {
    // Specify if Equalizer should make elements equal height once they become stacked.
    equalize_on_stack : true
  }

});

$(document).ready(function () {
  var request;

  var $kinds = $('.kind');
  $kinds.click(function (event) {
    event.preventDefault();
    event.stopPropagation();
    $kinds.removeClass('checked');
    $(this).addClass('checked');
  });

  var $techItems = $('.tech-item');
  $techItems.click(function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).toggleClass('checked');
  });

  $('#recruitment').submit(function (event) {
    event.preventDefault();

    // abort any pending request
    if (request) {
      request.abort();
    }
    var $form = $(this);
    var serializedData = $form.serializeArray();

    var selectedKind = '';
    $kinds.filter('.checked').each(function () {
      selectedKind = $(this).attr('id');
    });

    var skills = $techItems.filter('.checked');
    var skillArray = [];
    skills.each(function () {
      skillArray.push($(this).attr("id"));
    });

    serializedData.push({name : 'kind', value : selectedKind});
    serializedData.push({name : 'skills', value : skillArray.join(',')});

    request = $.ajax({
      "url" : "https://script.google.com/macros/s/AKfycbwy_70uxGw1hsNbgXN0K9Lnjt2vFriM14qfdQmE0dIyNq6Vbjo/exec",
      "content-type" : "application/json",
      "type" : "post",
      "data" : serializedData
    });

    request.done(function (response, textStatus, jqXHR) {
      if (response.result == 'success') {
      } else {
      }
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown) {
      // log the error to the console
      console.error(
        'The following error occured: ' +
        textStatus, errorThrown
      );
    });

    request.always(function () {
    });

  });
});