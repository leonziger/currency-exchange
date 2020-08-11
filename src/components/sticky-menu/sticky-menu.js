import $ from 'jquery';

$(window).scroll(function (){
  if ($(this).scrollTop() > 0){
    $('.main-header').addClass('main-header_sticky');
  } else{
    $('.main-header').removeClass('main-header_sticky');
  }
});
