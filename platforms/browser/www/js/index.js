var token;
var email;

var RUTA_HEROKU = "https://app-intercruises.herokuapp.com";
var RUTA_LOCAL = "http://localhost:3000";
var token = localStorage.getItem("token");

$(document).ready(function () {
    checkToken();
    $('.errorLogin').hide();
    $('#btnLogin').click(function () {
        logIn();
    });
});

function checkToken() {
    console.log('checking token');
    $.ajax({
        url: RUTA_HEROKU + "/checkToken",
        headers: { "Authorization": token },
        type: "POST",
        processData: false,
        contentType: false
    }).done(function (data) {
        // Inicio sin token gracias al token en cookie
        if (data.mensaje == 'Token valido') {
            window.location.replace("main.html");
        }
    }).fail(function (msg) {

    });
}

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
}

function logIn() {
    if ($("#inputPass").val() == "" && $("#inputEmail").val() == "") {
        console.log("Email and password empty");
        $('.errorLogin').hide();
        $('#errorEmailPass').show();
    }
    // if we incorpore mail checking :
    /*else if(!$("#inputEmail").val().includes('@')&&!$("#inputEmail").val().includes('.')){
        console.log("Email invalido");
        $('.errorLogin').hide();
        $('#errorEmail').show();

    }*/
    else if ($("#inputEmail").val() == "") {
        console.log("Email invalido");
        $('.errorLogin').hide();
        $('#errorEmail').show();
    }
    else if ($("#inputPass").val() == "") {
        console.log("Password invalido");
        $('.errorLogin').hide();
        $('#errorPass').show();
    }
    else {
        $('.errorLogin').hide();
        email = $("#inputEmail").val();
        password = $("#inputPass").val();

        var userName = '{"username":"' + email + '", "password":"' + password + '"}';
        var data = JSON.parse(userName);
        $.ajax({
            method: "POST",
            url: RUTA_HEROKU + "/login",
            data: data,
            dataType: "json",
            // On request error:
            error: function(xhr, ajaxOptions, thrownError) {
                $('.errorLogin').hide();
                $('#errorEmailPass').show();
              },
        }).done(function (data) {
            console.log(data);
            token = data.token;
            localStorage.setItem("token", token);
            console.log(data.token);
            if (data.token) {
                localStorage.setItem("currentUser", email);
                window.location.replace("main.html");
            }
            else {
                $('.errorLogin').hide();
                $('#errorEmailPass').show();
            }
        }).fail(function (msg) {
            if(!($('#errorEmailPass').is(":hidden"))){
                
            }else {
                console.log("ERROR LLAMADA AJAX");
                M.toast({html: 'Error en la conexion'})
            }

        });
    }
}

app.initialize();
