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

  var lang = langs[getLanguage()];

  var kind = [];
  var capabilities = [];
  var MAX_POINTS = 10;
  var pointsLeft = 10;
  var sumOfAllPoints = 0;

  var $add = $('.add');
  var $reduce = $('.reduce');
  var $resetButton = $('.reset-points');

  callPointsFN($add);
  callPointsFN($reduce);
  resetButton($resetButton);

  function resetButton(jqueryObj) {
    jqueryObj.click(function (event) {
      event.preventDefault();
      event.stopPropagation();

      var $kindObject = $(this).closest('.kind');
      var $pointValueObject = $kindObject.find('.value span');
      var kindName = $kindObject.attr('id');

      var getKindObject = _.find(kind, function (value) {
        return value.kind === kindName;
      });
      pointsLeft += getKindObject.points;
      kind = removeKindByName(kindName, kind);
      sumOfAllPoints = getSumOfAllPoints(kind);

      checkPoints(kindName, $pointValueObject, $kindObject);
      renderNotification($kindObject, sumOfAllPoints, pointsLeft);
    });
  }

  function removeKindByName(kindName, kind) {
    return _.filter(kind, function (value) {
      return value.kind !== kindName
    });
  }

  function callPointsFN(jqueryObj) {
    jqueryObj.click(function (event) {
      event.preventDefault();
      event.stopPropagation();

      var $kindObject = $(this).closest('.kind');
      var $pointValueObject = $kindObject.find('.value span');

      var kindName = $kindObject.attr('id');
      var operatorName = $(this).data('operator');

      kind = fillKindWithValues(kind, kindName, operatorName);
      sumOfAllPoints = getSumOfAllPoints(kind);

      checkPoints(kindName, $pointValueObject, $kindObject);
      renderNotification($kindObject, sumOfAllPoints, pointsLeft);
    });
  }

  function checkPoints(kindName, pointValueObj, kindObj) {
    var getKindObject = _.find(kind, function (value) {
      return value.kind === kindName;
    });
    var $pointsContainer = pointValueObj.closest('.pointsContainer');

    if (!_.isEmpty(getKindObject)) {
      var points = getKindObject.points;
      pointValueObj.text(points);
      checkClasses(points, $pointsContainer, kindObj);
    } else {
      pointValueObj.text(0);
      checkClasses(0, $pointsContainer, kindObj)
    }
  }

  function checkClasses(points, pointsContainer, kindObj) {
    if (points > 0) {
      pointsContainer.addClass('highlight');
      kindObj.addClass('checked');
    } else {
      pointsContainer.removeClass('highlight');
      kindObj.removeClass('checked');
    }
  }

  function renderNotification(kindObj, sumOfAllPoints, pointsLeft) {
    var $notifyObj = kindObj.closest('.character').find('.notify');

    if (sumOfAllPoints >= 0 && sumOfAllPoints < 10) {
      $notifyObj.html(renderPointsLeftNotify(pointsLeft));
    } else if (sumOfAllPoints === 10) {
      $notifyObj.html(renderSuccessNotify());
    }
  }

  function renderPointsLeftNotify(pointsLeft) {
    return "Du hast noch <span class='number'>" + pointsLeft + "</span> Skillpunkte zu verteilen."
  }

  function renderSuccessNotify() {
    return "<span>Good Job! </span> Du hast alle Punkte verteilt.";
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

  var $techItems = $('.choose-tech span');

  chooseTechCapabilities($techItems);

  function chooseTechCapabilities(jqueryObj) {
    jqueryObj.click(function (event) {
      event.preventDefault();
      event.stopPropagation();
      var $techItem = $(this).closest('.tech-item');
      var $capability = $(this).closest('.choose-tech').find('span');

      var techName = $techItem.attr('id');
      var capability = $(this).data('capability');

      if ($(this).hasClass('checked')) {
        capabilities = removeCapability(capabilities, techName);
        $capability.removeClass('checked');
      } else {
        $.each($capability, function (index, elem) {
          var $item = $(elem);
          if ($item.hasClass('checked')) {
            $item.removeClass('checked');
          }
        });
        capabilities = addCapabilities(capabilities, techName, capability);
        $(this).addClass('checked');
      }
    });
  }

  function removeCapability(capabilityArr, name) {
    return _.remove(capabilityArr, function (val) {
      return !val[name]
    });
  }

  function addCapabilities(capabilityArr, name, capability) {
    var capabilityEntry = {};
    var index;
    var capabilityObject = _.find(capabilityArr, function (value, idx) {
      if (value[name]) {
        index = idx;
        return value[name];
      }
    });

    if (_.isEmpty(capabilityArr) || _.isNil(capabilityObject)) {
      capabilityEntry[name] = capability;
      capabilityArr.push(capabilityEntry);
      return capabilityArr;
    } else if (capabilityObject[name] !== capability && !_.isNil(index)) {
      capabilityEntry[name] = capability;
      capabilityArr[index] = capabilityEntry;
      return capabilityArr;
    }
    return capabilityArr;
  }

  var $recruitment = $('#recruitment');
  var $button = $recruitment.find('button');
  var removeButtonClassName = '.remove-button';
  var inputElementName = 'input';

  removeButton(removeButtonClassName);
  inputOnFocusHandler(inputElementName);
  inputOnFocusOutHandler(inputElementName);

  function inputOnFocusHandler(inputElementName) {
    $(document).on('focus', inputElementName, function (event) {
      event.preventDefault();
      event.stopPropagation();
      inputKeyUpHandler($(this));
    });
  }

  function inputOnFocusOutHandler(inputElementName) {
    $(document).on('focusout', inputElementName, function (event) {
      event.preventDefault();
      event.stopPropagation();
      removeEmptyValueTechItem($(this));
    });
  }

  function inputKeyUpHandler(jqueryObj) {
    jqueryObj.keyup(function (event) {
      var keyCode = event.keyCode;
      var value = this.value;

      var keyCodeArr = [13, 9];
      var keyCodeIndex = _.indexOf(keyCodeArr, keyCode);
      if (keyCodeIndex !== -1) {
        removeEmptyValueTechItem($(this));
      } else if (!_.isEmpty(value)) {
        addButton($(this));
      }
    })
  }

  function removeEmptyValueTechItem($this) {
    $this.closest('.custom-capabilities').find('.own-tech-item').each(function (index, value) {
      var $ownTech = $(value).find('.own-tech');
      var $input = $ownTech.find('input');
      var hasAddTechClass = $ownTech.hasClass('add-tech');
      if (!hasAddTechClass && !$input.val()) {
        $ownTech.closest('.own-tech-item').remove();
      }
    });
  }

  function addButton($this) {
    var hasClassArr = [];
    var $ownTech = $this.closest('.own-tech');
    var $customCapabilities = $ownTech.closest('.custom-capabilities');
    var $ownTechItem = $customCapabilities.find('.own-tech-item');

    $ownTech.removeClass('add-tech');
    $ownTechItem.each(function (index, val) {
      var $valOwnTech = $(val).find('.own-tech');
      var hasClass = $valOwnTech.hasClass('add-tech');
      hasClassArr.push(hasClass);
    });

    var appendAddCustomTechTile = _.every(hasClassArr, function (value) {
      return value === false;
    });

    if (appendAddCustomTechTile) {
      $ownTechItem.last().after(renderNewAddSkillTile());
    }
  }

  function removeButton(removeButtonClassName) {
    $(document).on('click', removeButtonClassName, function (event) {
      event.preventDefault();
      event.stopPropagation();
      $(this).closest('.own-tech-item').remove();
    })
  }

  function renderNewAddSkillTile() {
    return '<li data-equalizer-watch="" class="tech-item own-tech-item" style="height: inherit;">' +
      '<div class="own-tech tech-icon add-tech">' +
      '<i class="icon-times remove-button"></i>' +
      '<i class="icon-commenting-o"></i>' +
      '<i class="icon-bubble"></i>' +
      '<input placeholder="Fähigkeit hinzufügen"/>' +
      '</div></li>'
  }

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