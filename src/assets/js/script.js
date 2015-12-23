$(function () {

  var $header = $('#hero');
  var $heroImage = $header.find('.img-bg');
  var $imprint = $('#imprint');

  var $vh = $(window).height();

  $imprint.css('height', $vh);

  onloadEvent();

  $(window).on('resize', function () {
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      setViewPortProperties();
    }
  });

  $(window).on('orientationchange', function (event) {
    var $viewportHeight = window.innerHeight;
    $header.css('height', $viewportHeight);
    //redraw
    $('body').offset().top - 1;
  });

  function onloadEvent() {
    $(window).on('load pagecontainerload', function () {
      setViewPortProperties();
    });
  }

  $('a[href*=#]:not([href=#])').click(function () {
    console.log('CLICKED');
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        scrollTo(target.offset().top);
        return false;
      }
    }
  });

  function scrollTo(position) {
    $('html,body').animate({
      scrollTop : Math.max(position, 0)
    }, 1000);
  }

  function setViewPortProperties() {
    var $viewportHeight = $(window).height();
    var $viewportWidth = $(window).width();

    if ($viewportWidth > 1920) {
      $heroImage.css('width', $viewportWidth);
      $header.css('height', $viewportHeight);
    } else {
      $header.css('height', $viewportHeight);
    }
  }

});