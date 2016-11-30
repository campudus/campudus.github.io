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

  var strings = {
    successNotify : {
      en : "<span>Good Job! </span> You have distributed all points.",
      de : "<span>Good Job! </span> Du hast alle Punkte verteilt."
    },
    pointsLeftNotify : function (pointsLeft) {
      return {
        en : "<p>You have still <span class='number'>" + pointsLeft + "</span> points left.</p>",
        de : "<p>Du hast noch <span class='number'>" + pointsLeft + "</span> Skillpunkte zu verteilen.</p>"
      }
    },
    addSkill : {
      en : "Add skill",
      de : "Fähigkeit hinzufügen"
    }
  };

  var lang = langs[getLanguage()];

  var kind = [];
  var capabilities = [];
  var MAX_POINTS = 7;
  var pointsLeft = 7;
  var sumOfAllPoints = 0;
  var skepticalDog = false;

  var $add = $('.add');
  var $reduce = $('.reduce');
  var $resetButton = $('.reset-points');
  var $langSwitcherBtn = $('.langSwitcherBtn');

  $langSwitcherBtn.click(function(){
    $(this).closest('.langSwitcher').find('.languageWrapper').toggle();
  });

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
      var $avatarIcon = $kindObject.find('.avatar-icon');

      var getKindObject = _.find(kind, function (value) {
        return value.kind === kindName;
      });
      pointsLeft += getKindObject.points;
      kind = removeKindByName(kindName, kind);
      sumOfAllPoints = getSumOfAllPoints(kind);
      scaleAvatar($avatarIcon, 1);
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

      kind = fillKindWithValues($kindObject, kind, kindName, operatorName);
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

    if (sumOfAllPoints >= 0 && sumOfAllPoints < MAX_POINTS) {
      $notifyObj.html(renderPointsLeftNotify(pointsLeft));
    } else if (sumOfAllPoints === MAX_POINTS) {
      $notifyObj.html(renderSuccessNotify());
    }
  }

  function renderPointsLeftNotify(pointsLeft) {
    return strings.pointsLeftNotify(pointsLeft)[lang.id];
  }

  function renderSuccessNotify() {
    return strings.successNotify[lang.id];
  }

  function scaleAvatar(avatarIcon, scaleRatio, avatar) {
    avatarIcon.css('transform', 'scale(' + scaleRatio + ')');
    avatarIcon.css('-webkit-transform', 'scale(' + scaleRatio + ')');
    if (avatar) {
      setAnimationClass(avatar, 'press');
    }
  }

  function setAnimationClass(avatar, animClass) {
    if (!avatar.hasClass(animClass)) {
      avatar.addClass(animClass);
      avatar.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        avatar.removeClass(animClass);
      });
    }
  }

  function fillKindWithValues($kindObj, array, kind, operator) {
    var kindIndex = _.findIndex(array, ['kind', kind]);
    var $avatarIcon = $kindObj.find('.avatar-icon');
    var $avatar = $kindObj.find('.avatar');
    var currentPoints = _.get(array[kindIndex], 'points');

    if (operator === 'reduce' && _.isEmpty(array)) {
      return array;
    }

    if (_.isEmpty(array) || kindIndex === -1 && sumOfAllPoints < MAX_POINTS) {
      array.push({kind : kind, points : 1});
      scaleAvatar($avatarIcon, 1.05, $avatar);
      --pointsLeft;
    } else {
      var kindObject = _.get(array, [kindIndex]);

      if (operator === 'add' && sumOfAllPoints <= MAX_POINTS) {
        add(kindObject, currentPoints, $avatarIcon, $avatar);
      }

      if (operator === 'reduce' && sumOfAllPoints >= 0) {
        reduce(kindObject, currentPoints);
      }

      array[kindIndex] = kindObject;
    }
    return array;
  }

  function add(kindObject, currentPoints, avatarIcon, $avatar) {
    if (sumOfAllPoints === MAX_POINTS) {
      pointsLeft = 0;
      setAnimationClass($avatar, 'shake');
    } else {
      kindObject.points = ++currentPoints;
      var scaleRatio = 1 + (currentPoints * 0.05);
      scaleAvatar(avatarIcon, scaleRatio, $avatar);
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

  $.fn.isOnScreen = function () {

    var win = $(window);

    var viewport = {
      top : win.scrollTop(),
      left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    var boundsTop = (bounds.top + bounds.top * 0.35);
    var boundsBottom = (bounds.bottom + bounds.bottom * 0.15);

    if (win.width() > 1024) {
      return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < boundsTop || viewport.bottom > boundsBottom));
    } else {
      return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < boundsTop || viewport.bottom > bounds.bottom));
    }
  };

  $(window).scroll(function () {
    var $notify = $('.notify');
    if ($('.character').isOnScreen() == true) {
      $notify.addClass('visible');
    } else {
      $notify.removeClass('visible');
    }
  });

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
        var $techItm = $capability.closest('.tech-item');
        $techItm.addClass('anim');
        $techItm.one('transitionend, webkitTransitionEnd', function () {
          $techItm.removeClass('anim');
        });
        capabilities = addCapabilities(capabilities, techName, capability);
        $(this).addClass('checked');
        handleSkepticalDog(this);
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
  var inputElementName = '.tech-icon input';
  var $continue = $('.continue');

  removeButton(removeButtonClassName);
  inputOnFocusHandler(inputElementName);
  inputOnFocusOutHandler(inputElementName);

  $continue.click(function () {
    $(this).closest('.popup').removeClass('active');
  });

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
        if (keyCode === 13) {
          event.preventDefault();
          focusNextInput(this);
        }

        handleSkepticalDog(this);

      } else if (!_.isEmpty(value)) {
        addButton($(this));
      }
    })
  }

  function handleSkepticalDog(_this) {
    var $customTechTiles = $(_this).closest('.tech-item-wrapper').find('.tech-item').filter('.own-tech-item');
    var $skills = $(_this).closest('.tech-item-wrapper').find('.choose-tech .checked').filter(function () {
      return $(this).data('capability') === 'skill';
    });

    var customSkillCount = $customTechTiles.length - 1;
    var skillsCount = $skills.length;
    var totalCount = customSkillCount + skillsCount;

    if (totalCount === 10) {
      if (!skepticalDog) {
        $('.popup').addClass('active');
        skepticalDog = true;
      }
    }
  }

  function focusNextInput(_this) {
    var $input = $('.own-tech input');
    var index = $input.index(_this) + 1;
    if (index >= $input.length) index;
    $input.eq(index).focus();
  }

  function removeEmptyValueTechItem($this) {
    $this.closest('.tech-item-wrapper').find('.own-tech-item').each(function (index, value) {
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
    var $techItemWrapper = $ownTech.closest('.tech-item-wrapper');
    var $ownTechItem = $techItemWrapper.find('.own-tech-item');

    $ownTech.removeClass('add-tech');
    $ownTech.addClass('custom-tech');
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
    var height = $('.tech-item').first().height();
    return '<li data-equalizer-watch class="tech-item own-tech-item large-4 medium-6 small-12 columns" style="height:' + height + 'px;">' +
      '<div class="own-tech tech-icon add-tech">' +
      '<i class="icon-times remove-button"></i>' +
      '<i class="icon-commenting-o"></i>' +
      '<i class="icon-bubble"></i>' +
      '<input placeholder="' + strings.addSkill[lang.id] + '"/>' +
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

    var skills = $techItems.filter('.checked');
    var custom = $('.tech-item').filter('.own-tech-item');

    var skillArray = [];
    skills.each(function (idx, value) {
      var techItem = $(value).closest('.tech-item');
      var skillName = $(techItem).attr('id');
      var capability = $(value).data('capability');
      skillArray.push({name : skillName, capability : capability});
    });

    var customSkillArray = [];
    custom.each(function (idx, value) {
      var inputValue = $(value).find('input').val();
      customSkillArray.push(_.lowerCase(inputValue));
    });

    serializedData.push({
      name : 'skills', value : _.map(skillArray, function (value) {
        return value.name + ': ' + value.capability
      }).join('\n')
    });
    serializedData.push({
      name : 'customSkills', value : customSkillArray.join('\n')
    });
    serializedData.push({
      name : 'kind', value : _.map(kind, function (value) {
        return value.kind + ': ' + value.points + ' points'
      }).join(',')
    });
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
        ga('send', 'event', 'Bewerbung', 'gesendet');
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