var token;
$(document).ready(function(){
  $('.errorLogin').hide();
  $('#btnLogin').click(function(){
    logIn();
});
});


var app = {
                // Application Constructor
                initialize: function() {
                    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
                },

                // deviceready Event Handler
                //
                // Bind any cordova events here. Common events are:
                // 'pause', 'resume', etc.
                onDeviceReady: function() {
                    this.receivedEvent('deviceready');
                },

                // Update DOM on a Received Event
                receivedEvent: function(id) {
                    var parentElement = document.getElementById(id);
                    var listeningElement = parentElement.querySelector('.listening');
                    var receivedElement = parentElement.querySelector('.received');

                    listeningElement.setAttribute('style', 'display:none;');
                    receivedElement.setAttribute('style', 'display:block;');

                    console.log('Received Event: ' + id);
                }

            }
            /*
            function onSignIn(googleUser) {
                var profile = googleUser.getBasicProfile();
                console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
              }
              */



              function logIn (){
                console.log("entra function login jquery");
                if($("#inputPass").val()==""&&$("#inputEmail").val()==""){
                    console.log("Email and password empty");
                    $('.errorLogin').hide();
                    $('#errorEmailPass').show();
                }
                /*else if(!$("#inputEmail").val().includes('@')&&!$("#inputEmail").val().includes('.')){
                    console.log("Email invalido");
                    $('.errorLogin').hide();
                    $('#errorEmail').show();

                }*/
                else if($("#inputEmail").val()==""){
                    console.log("Email invalido");
                    $('.errorLogin').hide();
                    $('#errorEmail').show();

                }
                else if($("#inputPass").val()==""){
                    console.log("Password invalido");
                    $('.errorLogin').hide();
                    $('#errorPass').show();

                }
                else {
                    $('.errorLogin').hide();
                    email = $("#inputEmail").val();
                    password = $("#inputPass").val();

                    var userName = '{"username":"'+email+'", "password":"'+password+'"}';
                    var data = JSON.parse(userName); 
                    RUTA_HEROKU = "https://app-intercruises.herokuapp.com/login";
                    RUTA_LOCAL = "http://localhost:3000/login";
                    
            $.ajax({
                method: "POST",
                url: RUTA_HEROKU,
                data: data,
                dataType: "json",
              }).done(function (data) {
                token = data.token;
                localStorage.setItem("token",token);
                console.log(data.token);
                if(data.token){
                    window.location.replace("main_menu.html");
                }
                else {
                    $('.errorLogin').hide();
                    $('#errorEmailPass').show();
                }
              }).fail(function (msg) {
                console.log("ERROR LLAMADA AJAX");
                M.toast({html: 'Error en la conexión'})
              });
            }
            }    

        app.initialize();
