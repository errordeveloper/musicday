'use strict';

angular.module('musicdayApp')
  .controller('MainCtrl', ['$scope', 'GoogleMapApi'.ns(), function ($scope, GoogleMapApi) {

    $scope.map = {
      center: { latitude: 54.0622661, longitude: -3.4827427 },
      zoom: 6,
    };

    $scope.markers = [];

    $scope.mainLocations = [
      [
        281,
        "Music Day at Springfield Park",
        "Springfield Park",
        "The team from Music Day HQ head up 3 stages of music in the beautiful surrounds of Markfield Park, overlooking the River Lea and marshes.",
        51.5716018677,
        -0.05789199844,
      ],
      [
        282,
        "London Jazz Night",
        "Vortex Jazz Club",
        "",
        51.5487098694,
        -0.0764990001917,
      ],
      [
        286,
        null,
        null,
        "",
        52.6293907166,
        1.29594802856,
      ],
      [
        290,
        "Music Day - Bristol",
        "Thee Fleece",
        "Coming Soon...",
        51.4520072937,
        -2.5893099308,
      ],
    ];

    GoogleMapApi.then(function(maps) {
      console.log("Maps are ready!");
    });

    /*
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    google.maps.event.addDomListener(window, 'load', allEventsMap(locations, 'home'));
    */

    var logoswap = function(){
      if ( $(window).width() < 762) {
        $('img.musiclogo').attr('src', 'images/mdlogo-new-center.png')
          .css({
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '0'
          });
      } else {
        $('img.musiclogo')
          .attr('src', '/images/md-headers-home.png')
          .css('margin-top', '-50px');
      }
    }
    logoswap();
    $(window).resize(logoswap);

    var st = $(window).scrollTop();
    $(window).waypoint(function(direction) {
      $(window).on('scroll', function() {
        st = $(this).scrollTop();
        $('.homeback').css({ 'opacity' : (0.1 + st/900) });
          $('.star').css({
          opacity : (0.0 + st/250),
          // width: (50 + st/20) + "px"
        });
      });
    });

    $('.star').waypoint('sticky', {
      offset: 152
    });

    // News ticker
    var aniSpd01 = 4500;
    var fadeSpd01 = 500;

    $(function() {
        var startIndex = -1;
        var endIndex = $('#aniHolder div').length -1;
        $('#aniHolder div:first').fadeIn(fadeSpd01);

        window.setInterval(function() {
        $('#aniHolder div:eq(' + startIndex + ')').delay(fadeSpd01).fadeOut(fadeSpd01);
            startIndex++;
            $('#aniHolder div:eq(' + startIndex + ')').delay(fadeSpd01).fadeIn(fadeSpd01);

            if (endIndex == startIndex) startIndex = -1;
        }, aniSpd01);
    });

    // SignUp Form
    $('form.signup_form').on('submit', function(event) {
      event.preventDefault();
      var $form = $(this);
      //var $target = $($form.attr('data-target'));
      $.ajax({
        type: $form.attr('method'),
        url: 'signup.php',
        data: $form.serialize(),
        beforeSend: function(){
           $('form.signup_form .btn').html('<span class="icon-spin4 animate-spin"></span>');
           $('body input, body button').prop("disabled", true);
        },
        success: function(data, status) {
          if(data.substring(0, 1) !== "1"){
            $('#signupError').html(data).removeClass('hidden');
            $('form.signup_form .btn').html('Create your profile');
            $('body input, body button').prop("disabled", false);
          }else{
            $('body input, body button').prop("disabled", false)
            $('form.signup_form').unbind('submit').submit();
          }
        }
      });
    });

    // PWStrength
    /*
    var pwOptions = {};

    pwOptions.common = {
      minChar: 6,
      usernameField: "#signup_email",

    };

    pwOptions.ui = {
      bootstrap2: false,
      showErrors: true,
      showProgressBar: true,
      showStatus: true,
      showVerdictsInsideProgressBar: true,
      container: "#pwstrength",
      viewports: {
        progress: ".pwstrength_viewport_progress",
        verdict: undefined,
        errors: ".pwstrength_error"
      }
    };

    if($('#signup_pass').is(':visible')){
      $('#signup_pass').pwstrength(pwOptions);
    }
    // NAVBAR SCROLLSPY
    $('body').scrollspy({ target: '.mainNav' })
    */
  }]);
