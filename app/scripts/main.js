var dots = 0;
$(document).ready(function(){
"use strict";

// Nav

// Prepend hrefs
// $(function() {
//   $('a').each(function() {
//     var href = $(this).attr('href');
//     $(this).attr('href', '/temp' + href);
//   });
// });

//$('#blueimp-gallery').data('useBootstrapModal', false);

  $(".navbar ul li a[href^='#'], .jumbotron a[href^='#']").on('click', function(e) {
   e.preventDefault();
   var hash = this.hash;
   if(typeof hash !== 'undefined'){
    $('html, body').animate({
    scrollTop: $(this.hash).offset().top // - 50
  }, 500, 'easieEaseOut', function(){
   window.location.hash = hash;
   $('.navbar ul li').removeClass('active');
   $('.navbar ul li a[href^="'+ hash +'"]').parent().addClass('active');
   if($('.navbar-collapse').hasClass('in') === true){
        $('.navbar-collapse').collapse('hide');
    }
 });
   }
   
 });

  $(window).resize(function(event) {
    if ($(this).width() >= 767){
      $('.mainNav').removeClass('in').addClass('collapse');
    }
  });

// Sign-in box fade
// $('.dropdown-toggle').click(function() {
//         $(this).next('.dropdown-menu').fadeToggle(250);
//     });

// var st = $(window).scrollTop();
// $(window).on('scroll', function() {
//    st = $(this).scrollTop();
//     $('.homeback').css({ 'opacity' : (0.1 + st/130) });
// });

var url = window.location.pathname.split("/");
var currentPage = (url[1]);
var userType = (url[2]);

// NAV LOGIN FORM
$( "#login" ).submit(function( event ) {
  // alert( "Handler for .submit() called." );
  event.preventDefault();
  var deets = $(this).serialize();
  $.ajax({
    url: '/login.php',
    type: 'POST',
    data: deets,
    beforeSend: function(){
      $("#login .btn").val('Please wait...').attr('disabled', 'disabled');
    }
  })
  .done(function(data) {
    if(data.charAt(0) === '1'){
      var dataSplit = data.split('-');
      window.location.replace("/profile/" + dataSplit[1] + "/");
    }else{
      $("#login .btn").val('Sign In').removeAttr('disabled');
      $('.loginForm .error').html(data).fadeIn(500);
    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
  
});

// GALLERY PAGE
if(currentPage === 'gallery'){
  $('.nav li').removeClass('active');
  $('.galleryDrop').addClass('active');
}

// INVOLVED PAGES
if(currentPage === 'inspiration' || currentPage === 'resources'){
  $('.nav li').removeClass('active');
  $('.involvedDrop').addClass('active');
}


// HOME PAGE
if(currentPage === ''){

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


  $.ajax({
    url: 'actions.php',
    type: 'POST',
    data: {act: 'mapAllEvents'},
    success: function(data){
      if(data === undefined || data === null || data.length === 0){
        var mapOptions = {
          center: new google.maps.LatLng(54.0622661,-3.4827427),
          zoom: 6
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
      }else{
        var locations = $.parseJSON(data);
        google.maps.event.addDomListener(window, 'load', allEventsMap(locations, 'home'));
      } 
    }
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
  
}
// END OF HOME PAGE

// INSPIRATION PAGE
if(currentPage === 'inspiration'){

}
// END OF INSPIRATION PAGE

$('.contact-toggle').click(function(event) {
  $('.contact-menu.dropdown-menu').toggle();
});

// Profiles Talent Search
if(currentPage === 'talentsearch.php'){

  // Table sorting
  $('#eventsTable').tablesorter({
          theme : "dropbox",
          sortList: [[1,0],[2,0]],
          widgets: ["uitheme", "columns", "zebra", "filter"],
          widgetOptions : {
          // filter_anyMatch replaced! Instead use the filter_external option
          // Set to use a jQuery selector (or jQuery object) pointing to the
          // external filter (column specific or any match)
          filter_external : '.search',
          // include column filters
          filter_columnFilters: false,
          filter_saveFilters : false,
          filter_reset: '.reset'
          },
          initialized: function(table){
                        $('table').bind('filterInit', function(){
              $('button.reset')
                      .detach()
                      .appendTo('.tablesorter-filter-row td:first');
            });
          },
          headerTemplate : '{content} {icon}'
        }).tablesorterPager({
          // target the pager markup - see the HTML block below
            container: $(".pager"),
            // output string - default is '{page}/{totalPages}'; possible variables: {page}, {totalPages}, {startRow}, {endRow} and {totalRows}
            output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
            // if true, the table will remain the same height no matter how many records are displayed. The space is made up by an empty
            // table row set to a height to compensate; default is false
            fixedHeight: true,
            // remove rows from the table to speed up the sort of large tables.
            // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
            removeRows: false,
            size: 25,
            // go to page selector - select dropdown that sets the current page
            cssGoto:   '.gotoPage'
        });

        // Modal event details
        $('.eventRow').on('click', '.eventInfo, .contactBut', function(event) {
          event.preventDefault();
          var eventId = $(this).data('id');
          var musicStyles = $(this).parent().prev().html();
          //console.log(eventId);
          $.ajax({
            url: '/eventactions.php',
            type: 'POST',
            dataType: 'json',
            data: {id: eventId, act: 'artists'},
            beforeSend: function(){

            },
            success: function(data) {
              //console.log(data);
              $('#eventTitle, .artistName').html(data[0].artist_name);
              if(data[0].imgfile.length){
              $('.eventImg').prop('src', '/profileimg/' + data[0].imgfile);
              }else{
                $('.eventImg').prop('src', '/img/md-icon-listings.png');
              }
              // $('.eventLocat').html(data[0].address);
              $('.eventDescrip').html(stripslashes(data[0].description));
              $('.eventMusic').html(musicStyles);

            }
          })
          .done(function() {
            console.log("success");
          })
          .fail(function(data) {
            console.log("error");
          })
          .always(function() {
            console.log("complete");
          });

        });

}

// EVENTS PAGE
if(currentPage === 'events'){

var states = new Array("Aberdeen City", "Aberdeenshire", "Angus", "Argyll & Bute", "Bath & North East Somerset", "Bedfordshire", "Berkshire", "Blaenau Gwent", "Bridgend", "Bristol", "Buckinghamshire", "Caerphilly", "Cambridgeshire", "Cardiff", "Carmarthenshire", "Ceredidgion", "Cheshire", "ClackMannanshire", "Conwy", "Cornwall", "Cumbria", "Denbighshire", "Derbyshire", "Devon", "Dorset", "Dumfries & Galloway", "Dundee City", "Durham", "East Ayrshire", "East Dunbartonshire", "East Lothian", "East Renfrewshire", "East Riding of Yorkshire", "East Sussex", "Edinburgh", "Essex", "Falkirk", "Fife", "Flintshire", "Glasgow", "Gloucestershire", "Greater Manchester", "Gwynedd", "Hampshire", "Herefordshire", "Highlands", "Inverclyde", "Isle of Anglesey", "Kent", "Lancashire", "Leicestershire", "Lincolnshire", "London", "Merseyside", "Merthyr Tydfil", "Midlothian", "Monmouthshire", "Moray", "Neath Port Talbot", "Newport", "Norfolk", "North Ayrshire", "North Lanarkshire", "North Somerset", "North Somerset", "Northamptonshire", "Northumberland", "Nottinghamshire", "Orkney", "Oxfordshire", "Pembrokeshire", "Perth & Kinross", "Powys", "Renfrewshire", "Rhondda Cynon Taff", "Rutland", "Scottish Borders", "Shetland", "Shropshire", "Somerset", "South Lanarkshire", "South Yorkshire", "Staffordshire", "Stirling", "Suffolk", "Surrey", "Swansea", "Teesside", "Torfaen", "Tyne & Wear", "Vale of Glamorgan", "Warwickshire", "West Dunbartonshire", "West Lothian", "West Midlands", "West Sussex", "West Yorkshire", "Western Isles", "Wiltshire", "Worcestershire", "Wrexham");
var options = '';
var i;

$('.nav li').removeClass('active');
$('.eventsDrop').addClass('active');


  // Events map
    $.ajax({
    url: '/actions.php',
    type: 'POST',
    data: {act: 'mapAllEvents'},
    success: function(data){
      if(data === undefined || data === null || data.length === 0){
        var mapOptions = {
          center: new google.maps.LatLng(54.0622661,-3.4827427),
          zoom: 6
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
      }else{
        var locations = $.parseJSON(data);
        google.maps.event.addDomListener(window, 'load', allEventsMap(locations));
      } 
    }
  });

  // Location list
  // for(i=0; i<states.length; i++){
  //   options += '<option value="' + states[i] + '">' + states[i] + '</option>';
  // }
  // $('#slist').append(options);

// Table sorting

// BIT DEDICATED TO PULLING MUSIC STYLES
// $.ajax({
//   url: '/eventactions.php',
//   type: 'POST',
//   dataType: 'json',
//   data: {act: 'muStyles'},
// })
// .done(function(data) {

//   styleList = '{ 
//      ';
//   $.each(data, function(index, val) {
//      styleList += '"' + data[index].genre + '" : ' + 'function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
//      '
//   });
//   styleList += '}';
//   //console.log(styleList);
//   $tblSorter.trigger('refreshWidgets', [true, true]); //REMOVE ALL WIDGETS
//   $tblSorter[0].config.widgets = ["uitheme", "group", "columns", "zebra", 'stickyHeaders', "filter"]; //add also scroller
//   $tblSorter[0].config.widgetOptions  = {
  // filter_columnFilters: true,
  // filter_saveFilters : true,
  // filter_reset: '.reset',
  // filter_functions: {
  // 4: styleList
  // },
//   };
//   $tblSorter.trigger('applyWidgets');
//    //$('#eventsTable')[0].config.$filters;

//    // $('#eventsTable')[0].config.widgets = [];
//   //var JSONStyles = $.parseJSON(styleList);
// })
// .fail(function() {
//   console.log("error");
// })
// .always(function() {
//   console.log("complete");
// });

  var styleList = '';
  var $tblSorter;
    $tblSorter = $('#eventsTable').tablesorter({
          theme : "dropbox",
          sortList: [[1,0],[3,0]],
          widgets: ["uitheme", "group", "columns", "filter", "zebra", 'stickyHeaders'],
          widthFixed : true,
          initWidgets : false,
          widgetOptions : {
            stickyHeaders : '',
            stickyHeaders_offset : 50,
            //filter_external : '.search',
            zebra : [ "normal-row", "alt-row" ],
              filter_columnFilters: true,
  filter_saveFilters : false,
  filter_reset: '.reset',
  filter_functions: {
  4: {
      "Acoustic" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "African" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Asian" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Avant-Garde" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Blues" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Caribbean" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Choral" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Classical" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Comedy" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Country" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Easy Listening" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Electronic Downtempo" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Electronic Uptempo" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Folk" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Hip hop" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Jam Session" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Jazz" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Latin American" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Metal" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Open Mic" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Other" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Pop" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Punk" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Reggae/Ska" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; },
      "Rock" : function(e,n,f,i,$r){ return e.indexOf(f) >= 0; }
    }
  }
          },
          initialized: function(){
            // Check for event number in URL
            if(userType !== '' && !isNaN(userType) ){
              // Open Modal (simulate click)
              setTimeout(function() {$('.eventInfo[data-id="'+userType+'"]').click();}, 1000);
              
            }
            $('table').bind('filterInit', function(){
              $('button.reset')
                      .detach()
                      .appendTo('.tablesorter-filter-row td:first');
            });
            
          },
          headerTemplate : '{content} {icon}'
        }).tablesorterPager({
          // target the pager markup - see the HTML block below
            container: $(".pager"),
            // output string - default is '{page}/{totalPages}'; possible variables: {page}, {totalPages}, {startRow}, {endRow} and {totalRows}
            output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
            // if true, the table will remain the same height no matter how many records are displayed. The space is made up by an empty
            // table row set to a height to compensate; default is false
            fixedHeight: false,
            // remove rows from the table to speed up the sort of large tables.
            // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
            removeRows: true,
            size: 25,
            processAjaxOnInit: false,
            // go to page selector - select dropdown that sets the current page
            cssGoto:   '.gotoPage'
        });

// END TABLESORTER




  $("#slist").bind('change', function (e) {
   var cols=[]
   cols[3] = $(this).val()
  $('table').trigger('search', [cols]);
  // Filter map and zoom in

  });

$('.eventRow').hover(function(event) {
  $(this).find('.eventName strong').addClass('blue');
},function(){
  $(this).find('.eventName strong').removeClass('blue');
});

        // Modal event details
        $('#eventsTable, #map-canvas').on('click', '.eventInfo', function(event) {
          event.preventDefault();
          var eventId = $(this).data('id');
          var musicStyles = $('.eventRow[data-id="'+eventId+'"] .muStyle').html();
          var explodedStyles = musicStyles.split('<br>');

          //console.log(eventId);
          $.ajax({
            url: '/eventactions.php',
            type: 'POST',
            dataType: 'json',
            data: {id: eventId, act: 'venues'},
            beforeSend: function(){
              $('#eventTitle').html('<small>Loading...</small>');
              $('.eventLocat').html('<small>Loading...</small>');
              $('.eventDescrip').html('<small>Loading...</small>');
              $('.eventMusic').html('<small>Loading...</small>');
              $('.modLoad').show();
            },
            success: function(data) {
              //console.log(data);
              if(data[0].event_name){
                $('#eventTitle').html(data[0].event_name);
              }else{
                $('#eventTitle').html('<small>&nbsp;</small>');
              }
              
              if(data[0].imgfile){
                $('.eventImg').prop('src', '/profileimg/' + data[0].imgfile);
              }else{
                $('.eventImg').prop('src', '/img/md-icon-listings.png');
              }
              $('.directions').prop('href', 'http://maps.google.com/maps?daddr=' + encodeURIComponent(data[0].address).replace(/%20/g, "+"))
              
              $('.eventLocat').html('<strong>' + data[0].venue_name + '</strong><br>' + '<small>' + data[0].address + '</small>');

              //Social links
              $('#eventDetails .social').html('');
              if(data[0].venue_facebook){
                $('#eventDetails .social').append('<a href="http://www.facebook.com/'+data[0].venue_facebook+'" target="_blank"><span class="icon-facebook-rect"></span></a>');
              };
              if(data[0].venue_twitter){
                $('#eventDetails .social').append('<a href="http://twitter.com/#!/'+data[0].venue_twitter+'" target="_blank"><span class="icon-twitter-bird"></span></a>');
              };
              if(data[0].venue_url){
                $('#eventDetails .social').append('<a href="http://'+data[0].venue_url+'" target="_blank"><span class="icon-globe"></span></a>');
              };

              $('.eventDescrip').html(stripslashes(data[0].long_desc.replace(/\n/g, '<br>')));
              var stylesList = '';
              $.each(explodedStyles, function(index, val) {
                stylesList += '<li class="styleItem">'+val+'</li>';
              });
              $('.eventMusic').html(stylesList);

              var fromTime = new Date(Date.parse(data[0].from_time.replace(/\-/g, "/")));
              var tilTime = new Date(Date.parse(data[0].till_time.replace(/\-/g, "/")));

              $('.eventTimes').html("<small>" + fromTime.getHours()  + ":" + (fromTime.getMinutes()<10?'0':'') + fromTime.getMinutes() + ' – ' + tilTime.getHours() + ":" + (tilTime.getMinutes()<10?'0':'') + tilTime.getMinutes() + "</small>");
            }
          })
          .done(function() {
            console.log("success");
            $('.modLoad').fadeOut('fast');
          })
          .fail(function(data) {
            console.log("error");
          })
          .always(function() {
            console.log("complete");
          });

        });

}

// PROFILES PAGE
if(currentPage === 'profile'){

var request;

  // Loading
  setInterval (typeDots, 600);
  $(window).load(function() {
      var winh = $(window).height();
      $("#loadOverlay h1").html('Done!');
      // .animate({
      //  top: '-' + winh + 'px'
      //}, 1000)
      $("#loadOverlay").fadeOut('fast');
    });
  
  // Check if event is in DB
  $('.profinfo').on('click', '.enableEvent', function(event) {
    event.preventDefault();
    /* Act on the event */
    $.ajax({
      url: '/actions.php',
      type: 'post',
      data: {
        act: 'enableEvent',
        userid: userId,
      },
      success: function(data){
        $('.locationPanel, .eventDiv, .publishEvent').slideDown(function(){
          populateMusicStyles(userId, userType);
          maxLength();
        });
        $('.enableEvent').hide();
        google.maps.visualRefresh = true;

      }
    })
  });
  
  // Tooltips
  $('.protip').tooltip();

  // Checkbox switches
  $("[name='publish_event']").bootstrapSwitch({
    size: "normal",
    onColor: "success",
    onText: "On",
    offText: "Off",
    onInit: function(event, state){
      if($("[name='publish_event']").prop("checked")){
        $('.switchBack').removeClass('alert-warning').addClass('alert-success');
        $('.pubText').html('');
        $('.pubTitle').html('Event Published');
      }else{
        $('.switchBack').removeClass('alert-success').addClass('alert-warning');
        $('.pubText').html('<small>This will display your event live on the website.<br><strong>Only turn this on when your event is confirmed to be happening!</strong></small>');
        $('.pubTitle').html('Publish Your Event');
      }
    },
    onSwitchChange: function(event, state){
      if(state === false){
        $.ajax({
          url: '/actions.php',
          type: 'POST',
          data: {
            userid: userId,
            usertype: userType,
            act: 'publishOnly', 
            state: '0'
          },
        })
        .done(function(data) {
          //console.log(data);
        });       
        $('.switchBack').removeClass('alert-success').addClass('alert-warning');
        $('.pubText').html('<small>This will display your event live on the website.<br><strong>Only turn this on when your event is confirmed to be happening!</strong></small>');
        $('.pubTitle').html('Publish Your Event');

      }else{

        $.ajax({
          url: '/actions.php',
          type: 'POST',
          data: {
            userid: userId,
            usertype: userType,
            act: 'publishOnly', 
            state: '1'
          },
        })
        .done(function(data) {
          //console.log(data);
        });
        $('.switchBack').removeClass('alert-warning').addClass('alert-success');
        $('.pubText').html('');
        $('.pubTitle').html('Event Published');
      }
    }
  });

  // Prevent slashes in some inputs
  $('.prevSlash input').keydown(function(event){
    if(event.which == 191 || event.which == 220){
      event.preventDefault();
      //return false;
    } else {
      
    }
  });

  // Change password
  $('#pwChangeForm').on('submit', function(event) {
    event.preventDefault();
    var $form = $(this);
    var $inputs = $form.find("input, select, button, textarea");
    var serializedData = $form.serialize();
    $inputs.prop("disabled", true);
    request = $.ajax({
        url: "/update.php",
        type: "post",
        data: serializedData,
        beforeSend: function(){
          $('.pwChangeSubmit').html('<span class="icon-spin4 animate-spin"></span>');
        }
    });
    request.done(function (response, textStatus, jqXHR){
        // Successfull post
        if(response === '1'){
          // success
          $('#pwChangeForm .modal-body').html('<div class="alert alert-success">Password changed successfully!</div>');
          $('#pwChangeForm .modal-body .errorBox, .pwChangeSubmit').hide();
        }else if(response === '2'){
          // wrong old pw
          $('#pwChangeForm .modal-body .errorBox').html('<p>Your old password is wrong. Have you <a href="#" class="alert-link">forgotten it</a>?</p>').fadeIn();
          $('#pwChangeForm .modal-body .oldPwd').addClass('has-error');
        }else if(response === '3'){
          // not matching
           $('#pwChangeForm .modal-body .errorBox').html('<p>The passwords don\'t match! Please try again.</p>').fadeIn();
           $('#pwChangeForm .modal-body .newPwdRpt').addClass('has-error');
        }
        else if(response === '4'){
          // too short
           $('#pwChangeForm .modal-body .errorBox').html('<p>Your password is too short. Please enter a password more than 6 characters long.</p>').fadeIn();
           $('#pwChangeForm .modal-body .newPwd').addClass('has-error');
        }
    });
    request.fail(function (jqXHR, textStatus, errorThrown){
        // log the error to the console
        console.error(
            "The following error occured: "+
            textStatus, errorThrown
        );
    });
    request.always(function () {
        // reenable the inputs
        $inputs.prop("disabled", false);
        $('.pwChangeSubmit').html('Save changes');
    });
    
  });

  $('.pwModal').on('hidden.bs.modal', function () {
      $('.pwModal .modal-body').html('<div class="form-group row">
          <label for="oldPwd" class="col-sm-4">Old password:</label>
          <input type="password" name="oldPwd" class="oldPwd col-sm-6" placeholder="Enter old password" required><br>
          <span class="col-sm-4"></span>
          <a href="#" class="forgotPw col-sm-6">Don\'t know your password?</a>
        </div>
        <div class="form-group row">
          <label for="newPwd" class="col-sm-4">New password:</label>
          <input type="password" name="newPwd" class="newPwd col-sm-6" placeholder="Enter new password" required>
        </div>
        <div class="form-group row">
          <label for="newPwdRpt" class="col-sm-4">Repeat password:</label>
          <input type="password" name="newPwdRpt" class="newPwd col-sm-6" placeholder="Re-enter new password" required>
        </div>
        <div class="alert alert-danger errorBox"></div>');
  })

  $('.deleteAcctModal').on('hidden.bs.modal', function () {
      $('.deleteAcctModal .modal-content').html('<div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">Delete Account?</h4>
      </div>
      <form id="deleteAcctForm" method="POST" action="#">
      <div class="modal-body">
      <div class="alert alert-warning"><p>Are you really sure you want to delete your account?</p></div>
      </div>
      <div class="modal-footer">
      <input type="hidden" name="formSubmit" value="pwForm">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary deleteAcctSubmit">Yes</button>
      </div>
    </form>');
  })

// Delete account
  $('.deleteAcctModal').on('click', '.deleteAcctSubmit', function(event){
    event.preventDefault();
    $('.deleteAcctModal .modal-title').html('DELETE ACCOUNT');
    $('.deleteAcctModal .modal-body').html('<div class="alert alert-danger"><p>Are you really, REALLY SURE you want to delete your account? <br>No turning back..!<br>
      <small>(All traces of your account, data and information will be deleted)</small></p></div>');
    $('.deleteAcctModal .deleteAcctSubmit')
    .removeClass('btn-primary')
    .addClass('btn-danger')
    .html('YES, delete my account already')
    .addClass('deleteFinal');
  });

  $('.deleteAcctModal').on('click', '.deleteFinal', function(event){
    event.preventDefault();
    $.ajax({
      url: '/actions.php',
      type: 'POST',
      data: {act: 'delaccount',
        userid: userId,
        usertype: userType},
      beforeSend: function(){
        $('.deleteAcctModal .deleteAcctSubmit').html('<span class="icon-spin4 animate-spin"></span>');
        $('.deleteAcctModal .modal-body').html('<div class="alert alert-warning"><p>Please wait...</p></div>');
        $('body input, body button').prop("disabled", true);
      }
    })
    .done(function() {
      //console.log("success");
      window.location.replace("/");
    })
    .fail(function() {
      //console.log("error");
    })
    .always(function() {
      //console.log("complete");
    });
    
  })

  // Input change & submit
  $('.profile_form').on('submit', function(event) {
    event.preventDefault();
    if (request) {
        request.abort();
    }
    var $form = $(this);
    var $inputs = $form.find("input:not(#contact_email), select, button, textarea");
    var serializedData = $form.serialize();
    $inputs.prop("disabled", true);
    request = $.ajax({
        url: "/update.php",
        type: "post",
        data: serializedData,
        beforeSend: function(){

          $('.updateDetails, .updateEvent').html('<span class="icon-spin4 animate-spin"></span>');
        }
    });
    request.done(function (response, textStatus, jqXHR){
        // Successfull post
        $('.updateDetails').html('Update Details');
        $('.updateEvent').html('Update Information');
        // alert(response);
    });
    request.fail(function (jqXHR, textStatus, errorThrown){
        // log the error to the console
        console.error(
            "The following error occured: "+
            textStatus, errorThrown
        );
    });
    request.always(function () {
        // reenable the inputs
        $inputs.prop("disabled", false);

    });
  });

  $('.profile_form').on('change', '#imgfile', function(event) { //input:not("#addressInput"):not("#contact_email"):not("input.performer"):not("input[type="checkbox"]"), textarea
    event.preventDefault();
    var input = $(this);
    var inputName = input.attr('name');
    var inputVal = input.val();

    $.ajax({
      url: '/actions.php',
      type: 'post',
      data: {
        inputname: inputName,
        value: inputVal,
        userid: userId,
        usertype: userType
      },
      beforeSend: function(jqXHR, settings){
        input.removeClass('saved').addClass('saving').closest('.panel-primary').find('.panel-title').addClass('panelSave');
      },
      success: function(data){
      //console.log(data);
      if(data === '1'){
        if(inputName === 'imgfile'){
          var imgData = $('.fileinput-preview img').attr('src');
          $.ajax({
            url: '/actions.php',
            type: 'post',
            data: {
              imgdata: imgData,
              userid: userId
            },
            beforeSend: function(jqXHR, settings){
              $('#fileUploader').append('<p class="waitText">PLEASE WAIT...</p>');
            },
            success: function(data){
              $('.waitText').html(data);
              if(data === '1'){
              //alert('image uploaded!');
              input.closest('.panel-primary').find('.panel-title').removeClass('panelSave');
            }else{
              input.closest('.panel-primary').find('.panel-title').removeClass('panelSave');
            }
          },
            error: function(jqXHR, textStatus, errorThrown){
              alert(textStatus + ': ' + errorThrown);
            }
          });
        }else{
          input.removeClass('saving').addClass('saved').closest('.panel-primary').find('.panel-title').removeClass('panelSave');
        }
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert(textStatus + ': ' + errorThrown);
    }
  });
});

// DateTime picker
$('.form_datetime').datetimepicker({
  format: "HH:ii P - d/m/yy",
  autoclose: true,
  pickerPosition: "bottom-left",
  startDate: "2014-06-21 00:00" ,      // set a minimum date
  endDate: "2014-06-22 13:00",
  startView: 1,
  minView: 0,
  maxView: 1,
  forceParse: 0,
  minuteStep: 15,
  showMeridian: true
});

// Remove image button
$('.profile_form').on('click', '#removeImg', function(event) {
  event.preventDefault();
  $.ajax({
    url: '/actions.php',
    type: 'post',
    data: {
      act: 'rm',
      userid: userId,
      usertype: userType
    },
    success: function(data){
      if(data === '1'){
        // alert('deleted!');
      }else{
        // alert(data);
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert(textStatus + ': ' + errorThrown);
    }
  });
});

  // Prevent enter in shortDesc
  $('textarea.shortDesc').keydown(function(event){
    if(event.which == 13){
      event.preventDefault();
      //return false;
    } else {
      
    }
  });

// Modal image
$('.fileinput-preview a').on('click', function (e) {
    $('#imgPop img').attr('src', $(this).attr('data-img-url'));
});

// Get music styles and populate box
if($('#music-options').is(':visible')){
  populateMusicStyles(userId, userType);
  maxLength();
}

// Google Maps stuff

google.maps.event.addDomListener(window, 'load', initialize(userType));

var marker = {};
var circle = {};

$('input#addressInput').keydown(function(e) {
  if (e.keyCode == 13) {
    $('#map_search').trigger('click');
        e.preventDefault();
  }
});

  google.maps.visualRefresh = true;
  $('#map_search').click(function(){
if(document.getElementById("addressInput").value !== ''){
   var address = document.getElementById("addressInput").value;
   var geocoder = new google.maps.Geocoder();
   var marker = {};
   var name = 'Your Location';
   var map;
   var radiusInMetres;
   geocoder.geocode({"address": address, "componentRestrictions": {"country":"UK"}}, function(results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
      var myLatlng = results[0].geometry.location;
      var mapOptions = {
        zoom: 16
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      map.panTo(new google.maps.LatLng(myLatlng.lat(), myLatlng.lng()));
      marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Your location'
     });
      if($('input#'+userType+'_name').val() !== ''){
        name = $('input#'+userType+'_name').val();
      }
      var address = results[0].formatted_address;
      var locality, i;

      for (i = 0; i < results[0].address_components.length; ++i) {
        var component = results[0].address_components[i];
        if (!locality && component.types.indexOf("administrative_area_level_2") > -1)
          locality = component.long_name;
      }

      var locat_info = "<b>" + name + "</b> <br/>" + address;
      var infoWindow = new google.maps.InfoWindow({
      content: locat_info
      });
      infoWindow.open(map, marker);
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
      });

      if(userType === 'artist'){
      if($('#distance').val() !== ''){
      radiusInMetres = parseFloat($('#distance').val()) / 0.00062137;
    }else{
      radiusInMetres = parseFloat(1609.34708789);
    }
      circle = new google.maps.Circle({
        map: map,
        radius: radiusInMetres,
        fillColor: '#8eb3c1',
        fillOpacity: 0.35,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        center: marker.position
      });
      map.fitBounds(circle.getBounds());
      
$('input#distance').change(function(event) {
    if(typeof marker !== "undefined"){
      if(typeof circle !== "undefined"){
        circle.setMap(null);
        circle=null;
      }
      var radiusInMetres = parseFloat($(this).val()) / 0.00062137;
      circle = new google.maps.Circle({
        map: map,
        radius: radiusInMetres,
        fillColor: '#8eb3c1',
        fillOpacity: 0.35,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        center: marker.position
      });
      map.fitBounds(circle.getBounds());
    }
  });
}
      // Put LatLong and Addy in DB
      $.ajax({
        url: '/actions.php',
        type: 'POST',
        data: {
          userid: userId,
          usertype: userType,
          lat: myLatlng.lat(),
          lng: myLatlng.lng(),
          addy: address,
          city: locality
        },
        success: function(data){
          $('#locationText').html('Your location is set to <a href="#" class="alert-link">' + address + '</a>');
        },
        error: function(jqXHR, textStatus, errorThrown){
          $('#locationText').html(textStatus + ': ' + errorThrown);
        }
      });
    } else {
     alert(document.getElementById("addressInput").value + ' not found');
   }

 });
}
 });

  // Maps Radius
$('input#distance').keydown(function(e) {
  if (e.keyCode == 13 && $('input#distance').val !== '') {
    $('input#distance').trigger('change');
      e.preventDefault();
  }else if (e.keyCode == 13 && $('input#distance').val === '') {
      e.preventDefault();
  }
});

  // Change Email / Password

$('input#contact_email').keydown(function(e) {
  if (e.keyCode == 13 && $('input#contact_email').val !== '') {
    $('input#contact_email').trigger('change');
      e.preventDefault();
  }else if (e.keyCode == 13 && $('input#contact_email').val === '') {
      e.preventDefault();
  }
});

  var currentEmail = $('input#contact_email').val();
  $('input#contact_email').popover({
    trigger: 'focus'
  });
  $('button.changeEmail').clicktoggle(function() {
    $('input#contact_email').prop('disabled', false).focus();
    $('button.changeEmail')
    .html('Update Email')
    .removeClass('btn-default')
    .addClass('btn-danger');
  }, function() {

    if($('input#contact_email').val() !== currentEmail){
      $.ajax({
      url: '/actions.php',
      type: 'post',
      data: {
        inputname: 'emailUpdate',
        value: $('input#contact_email').val(),
        userid: userId,
        usertype: userType
      },
      beforeSend: function(jqXHR, settings){
        $('input#contact_email').removeClass('saved').addClass('saving').closest('.panel-primary').find('.panel-title').addClass('panelSave');
      },
      success: function(data){
      //console.log(data);
      if(data === '1'){
        var changedEmail = $('input#contact_email').val();
        if (changedEmail.length > 12){
          changedEmail = changedEmail.substring(0,9) + '...';
        }
          $('input#contact_email').removeClass('saving').addClass('saved').closest('.panel-primary').find('.panel-title').removeClass('panelSave');
          $('.signInBut small').html(changedEmail);
          }else{
            alert(data);
            $('input#contact_email').removeClass('saving').addClass('saved').closest('.panel-primary').find('.panel-title').removeClass('panelSave');
            $('input#contact_email').val(currentEmail);
          }
      },
      error: function(jqXHR, textStatus, errorThrown){
        alert(textStatus + ': ' + errorThrown);
      }
      });
    }
    $('input#contact_email').prop('disabled', true);
    $('button.changeEmail')
    .html('<span class="icon-lock"></span> Change')
    .removeClass('btn-danger')
    .addClass('btn-default');

  });
$('.performersList').on('click', '.addArtist', function(event) {
  event.preventDefault();
  addItem('');
});

}
// END OF PROFILE PAGE

});
// END OF document.ready

function maxLength() {
  // MaxLength
  $('.shortDesc').maxlength({
    alwaysShow: true,
    validate: true,
    placement: 'bottom'
  });
}

function populateMusicStyles(userId, userType) {
  $.ajax({
    url: '/popbox.php',
    type: 'post',
    data: {userid: userId, usertype: userType},
    success: function(data){
      var styleData = data.split('|');
      var musicList = styleData[0];
      var selectedValues = styleData[1];
        $('#music-options').editable({
          type: 'checklist',
          value: selectedValues,
          source: musicList,
          mode: 'popup',
          onblur: 'submit',
          showbuttons: 'bottom',
          title: 'Select music styles',
          placement: 'bottom',
          params: function(params) {
            //originally params contain pk, name and value
            params.userid = userId;
            params.usertype = userType;
            return params;
          },
          display: function(value, sourceData) {
          var $el = $('div.musicList'),
              checked, html = '';
          if(!value) {
              $el.empty();
              return;
          }
          checked = $.grep(sourceData, function(o){
              return $.grep(value, function(v){
                   return v == o.value;
              }).length;
        });
        
        $.each(checked, function(i, v) {
            html+= '<li class="styleItem text-warning">'+$.fn.editableutils.escape(v.text)+'</li>';
            // if (i != checked.length - 1) { // For unstyled items
            //   html+= '<li>/</li>';
            // }
        });
        if(html) html = '<ul class="styleList">'+html+'</ul>';
        $el.html(html);
          },
          success: function(response, newValue){
           
          }
        });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert(textStatus + ': ' + errorThrown);
    }
  });
}

function allEventsMap(locations, page) {
  var infowindow = null;
  var marker;
  var mapOptions = {
    center: new google.maps.LatLng(54.0622661,-3.4827427),
    zoom: 5
  };
  var image = '/img/red-note.png';

  var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

  infowindow = new google.maps.InfoWindow({
    content: "holding...",
    maxWidth: 160
  });

  var markers = [];

  // Add the markers and infowindows to the map
  for (var i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][4], locations[i][5]),
      map: map,
      animation: google.maps.Animation.DROP,
      icon: image
    });

    markers.push(marker);

    google.maps.event.addListener(map, "click", function(){
      infowindow.close();
    });
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        if(page === 'home'){
          infowindow.setContent('<a href=\"/events/' + locations[i][0] + '\" class="eventInfo"><h5>' + locations[i][1] + '</h5><br><h6>@ ' + locations[i][2] + '</h6></a><br><small class="short_desc">' + locations[i][3] + '</small>');
        infowindow.open(map, marker);
        }else{
        infowindow.setContent('<a href="#" class="eventInfo" data-toggle=\"modal\" data-target=\"#eventDetails\" data-id=\"' + locations[i][0] + '\"><h5>' + locations[i][1] + '</h5><br><h6>@ ' + locations[i][2] + '</h6></a><br><small class="short_desc">' + locations[i][3] + '</small>');
        infowindow.open(map, marker);
        }
      };
    })(marker, i));

  }
}

function initialize(userType) { // GMaps Init function
  var thisLat;
  var thisLng;
  var thisZoom;

  if ( $('input#lat').val() !== '' && $('input#lng').val() !== '' ){
    thisLat = $('input#lat').val();
    thisLng = $('input#lng').val();
    thisZoom = 16;
    var mapOptions = {
    center: new google.maps.LatLng(thisLat,thisLng),
    zoom: thisZoom
  };
  var name = 'Your Location';
  var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
    marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Your location'
     });

    if($('input#'+userType+'_name').val() === ''){
        // Do nothing
      }else{
        name = $('input#'+userType+'_name').val();
      }
      var address = $('#addressInput').attr('placeholder');
      var locat_info = '<div class="xxxx"><b>' + name + '</b><br/>' + address + '</div>';
      var infoWindow = new google.maps.InfoWindow({
      content: locat_info
      });
      infoWindow.open(map, marker);

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
      });
      if(userType === 'artist'){
// Maps Radius
    var radiusInMetres = parseFloat($('#distance').val()) / 0.00062137;
    circle = new google.maps.Circle({
      map: map,
      radius: radiusInMetres,
      fillColor: '#8eb3c1',
      fillOpacity: 0.35,
      strokeColor: '#FFFFFF',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      center: marker.position
    });
    map.fitBounds(circle.getBounds());
    
      $('input#distance').change(function(event) {
    if(typeof marker !== "undefined"){
      if(typeof circle !== "undefined"){
        circle.setMap(null);
        circle=null;
      }
      var radiusInMetres = parseFloat($(this).val()) / 0.00062137;
      circle = new google.maps.Circle({
        map: map,
        radius: radiusInMetres,
        fillColor: '#8eb3c1',
        fillOpacity: 0.35,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        center: marker.position
      });
      map.fitBounds(circle.getBounds());
    }
  });
}
  }else{
    thisLat = 54.0622661;
    thisLng = -3.4827427;
    thisZoom = 5;
    var mapOptions = {
    center: new google.maps.LatLng(thisLat,thisLng),
    zoom: thisZoom
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
  }
}

function deleteCircle() {
    circle.setMap(null);
    circle=null;
}

function logoswap(){
	if ( $(window).width() < 762) {

		$('img.musiclogo').attr('src', '/img/mdlogo-new-center.png')
		.css({
			marginLeft: 'auto',
			marginRight: 'auto',
      marginTop: '0'
		});

	}else{

		$('img.musiclogo').attr('src', '/img/md-headers-home.png')
    .css('margin-top', '-50px');
		
	}
}

function typeDots() {
    if(dots < 3) {
        $('#dots').append('.');
        dots++;
    } else {
        $('#dots').html('');
        dots = 0;
    }
  }

function addItem(item){
  var typeaheadOpts = {
  name: 'performers',
  local: [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ]
};
    $("#artistList").append('<li><input type="text" data-provide="typeahead" class="form-control performer" name="performer[]" placeholder="Enter performer name" value="'+item+'"></li>');
    $('#artistList li').last().typeahead(typeaheadOpts);
}

function stripslashes(str) {
  return (str + '')
    .replace(/\\(.?)/g, function (s, n1) {
      switch (n1) {
      case '\\':
        return '\\';
      case '0':
        return '\u0000';
      case '':
        return '';
      default:
        return n1;
      }
    });
}

    $.fn.clicktoggle = function(a, b) {
    return this.each(function() {
        var clicked = false;
        $(this).click(function() {
            if (clicked) {
                clicked = false;
                return b.apply(this, arguments);
            }
            clicked = true;
            return a.apply(this, arguments);
        });
    });
};
