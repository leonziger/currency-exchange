import $ from 'jquery';

$('.main-header__menu-toggle').click(function() {
  $('.menu-toggle').toggleClass('menu-toggle_active');
  $('.main-menu').toggleClass('open');
  $('body').toggleClass('menu-open');
});
