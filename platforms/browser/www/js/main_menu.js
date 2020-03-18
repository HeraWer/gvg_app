var token = localStorage.getItem("token");

$(document).ready(function(){
  $('.sidenav').sidenav();
  console.log(token);
});

/*$(document).ready(function(){
  $('.menuButton').click(function(){
    $(this).css('background-color','yellow');
});
});*/
