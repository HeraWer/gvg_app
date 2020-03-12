$(document).ready(function () {
    $("#btnLogin").click(logIn)
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
    console.log(email, pass);
    const request = require("request-promise"),
    //RUTA = "https://app-intercruises.herokuapp.com/login";
    RUTA = "http://localhost:3000/login"
request({
    uri: RUTA,
    json: true, // Para que lo decodifique automáticamente 
}).then(
    username,
    password
);
  }

app.initialize();