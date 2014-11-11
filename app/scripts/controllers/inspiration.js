'use strict';

angular.module('musicdayApp')
  .controller('InspirationCtrl', function ($scope) {
    $('.ideaBox:not(.shpeel)').each(function(index, el) {
      var pic = $('.ideaImg', this);
      var picSrc = pic.attr('src');
      // alert(pic.attr('src'));
      $(this).prepend('<div class="ideaBig"><img src="'+picSrc+'"></div>')
    });
    $('.ideasSpread').imagesLoaded(function() {
      $('.ideasSpread').masonry({
        "itemSelector": '.ideaBox',
        "columnWidth": ".ideaBox",
        "stamp": ".stamp"
      })
    });
  });
