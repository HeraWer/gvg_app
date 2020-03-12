
$(document).ready(function(){
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
    email = $("#inputEmail").val();
    password = $("#inputPass").val();
    console.log(email, password);
    //RUTA = "https://app-intercruises.herokuapp.com/login";
    
   $.ajax({
            type: "POST",
             //beforeSend: function(xhr){xhr.setRequestHeader('X-Test-Header', 'test-value');},
            contentType: 'application/json',
            accept: 'application/json',
            crossDomain: true,
            //url: 'https://app-intercruises.herokuapp.com/login',
            url: 'http://localhost:3000/login',
            data: {
                "username": email,
                "password": password
            },
            success: function(data)
            {
                if (data === 'Correct') {
                    console.log("SUCCESS");
                }
                else {
                    console.log("ERROR");
                    alert(data);
                }
            }
        });

    }

app.initialize();