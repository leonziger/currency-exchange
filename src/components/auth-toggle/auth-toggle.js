import $ from 'jquery';

$('.main-header__auth-toggle').click(function() {
  $('.auth-toggle').toggleClass('auth-toggle_active');
  $('.auth-menu').toggleClass('open');
  $('body').toggleClass('auth-open');
});
