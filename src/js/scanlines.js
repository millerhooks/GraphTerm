// JAVASCRIPT NOT NEEDED TO MAKE .scanlines WORKS. ONLY FOR PRESENTATION PURPOSES.

var $scanlines = $('.scanlines');
$scanlines
    .children().hide()
    .first().show();

// toggle scanlines
$('#togglescanlines').on('click', function(e) {
  e.preventDefault();
  $scanlines.toggleClass('scanlines');
});

// switch between demos
$('.sample-ctrl a').on('click', function(e) {
   e.preventDefault();
   $scanlines
       .children().hide()
       .filter('#'+ $(this).attr('data-ctrl')).show();
});