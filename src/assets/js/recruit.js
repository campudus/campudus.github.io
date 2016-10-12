// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation({
  equalizer : {
    // Specify if Equalizer should make elements equal height once they become stacked.
    equalize_on_stack : false
  }

});

$(document).ready(function () {
  var request;

  var langs = {
    de : {
      id : 'de',
      loading : 'Bewerbe',
      success : 'Beworben!',
      retry : 'Erneut senden'
    },
    en : {
      id : 'en',
      loading : 'Applying',
      success : 'Applied!',
      retry : 'Retry sending'
    }
  };

  var kind = [];
  var MAX_POINTS = 10;
  var pointsLeft = 10;
  var sumOfAllPoints;

  var lang = langs[getLanguage()];

  var $add = $('.add');
  var $reduce = $('.reduce');

  callPointsFN($add);
  callPointsFN($reduce);

  function callPointsFN(jqueryObj) {
    jqueryObj.click(function (event) {
      event.preventDefault();
      event.stopPropagation();

      var $kindObject = $(this).closest('.kind');
      var kindName = $kindObject.attr('id');
      var operatorName = $(this).data('operator');
      kind = fillKindWithValues(kind, kindName, operatorName);
      sumOfAllPoints = getSumOfAllPoints(kind);

      var getKindObject = _.find(kind, function (value) {
        return value.kind === kindName;
      });
      var $pointValueObject = $kindObject.find('.value span');

      if (!_.isEmpty(getKindObject)) {
        var points = getKindObject.points;
        $pointValueObject.text(points);

        var $pointsContainer = $pointValueObject.closest('.pointsContainer');

        console.log("$pointsContainer: ", $pointsContainer);
        if (points > 0) {
          $pointsContainer.addClass('highlight');
        } else {
          $pointsContainer.removeClass('highlight');
        }
      }
    });
  }

  function fillKindWithValues(array, kind, operator) {
    var kindIndex = _.findIndex(array, ['kind', kind]);

    if (operator === 'reduce' && _.isEmpty(array)) {
      return array;
    }

    if (_.isEmpty(array) || kindIndex === -1 && sumOfAllPoints < MAX_POINTS) {
      array.push({kind : kind, points : 1});
      --pointsLeft;
    } else {
      var currentPoints = _.get(array[kindIndex], 'points');
      var kindObject = _.get(array, [kindIndex]);

      if (operator === 'add' && sumOfAllPoints <= MAX_POINTS) {
        add(kindObject, currentPoints);
      }

      if (operator === 'reduce' && sumOfAllPoints >= 0) {
        reduce(kindObject, currentPoints);
      }

      array[kindIndex] = kindObject;
    }
    return array;

  }

  function add(kindObject, currentPoints) {
    if (sumOfAllPoints === MAX_POINTS) {
      pointsLeft = 0;
    } else {
      kindObject.points = ++currentPoints;
      --pointsLeft;
    }
  }

  function reduce(kindObject, currentPoints) {
    if (currentPoints > 0) {
      kindObject.points = --currentPoints;
      ++pointsLeft;
    }
  }

  function getSumOfAllPoints(array) {
    if (!_.isEmpty(array)) {
      var sum = _.reduce(array, function (result, value) {
        result.push(value.points);
        return result;
      }, []);
      return _.sum(sum);
    } else {
      return 0;
    }
  }


  var $techItems = $('.tech-item');
  $techItems.click(function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).toggleClass('checked');
  });

  var $recruitment = $('#recruitment');
  var $button = $recruitment.find('button');

  $recruitment.submit(function (event) {
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
    serializedData.push({name : 'language', value : lang.id});

    request = $.ajax({
      "url" : "https://script.google.com/macros/s/AKfycbwy_70uxGw1hsNbgXN0K9Lnjt2vFriM14qfdQmE0dIyNq6Vbjo/exec",
      jsonp : "prefix",
      dataType : "jsonp",
      "type" : "GET",
      "data" : serializedData
    });

    $button.attr('disabled', 'disabled');
    $button.text(lang.loading);

    request.done(function (response, textStatus, jqXHR) {
      if (response.result == 'success') {
        $button.text(lang.success);
      } else {
        console.error('The following error occured from script: ' + textStatus);
        resetAfterFail();
      }
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown) {
      // log the error to the console
      console.error('The following error occured from server: ' + textStatus, errorThrown);
      resetAfterFail();
    });

    request.always(function () {
    });

    function resetAfterFail() {
      $button.text(lang.retry);
      $button.removeAttr('disabled');
    }

  });

  function getLanguage() {
    return (location.href.match(/.*\/en\/.*/) ? 'en' : 'de');
  }
});