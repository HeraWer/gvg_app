
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
            else if($("#inputPass").val()==""){
                console.log("Password invalido");
                $('.errorLogin').hide();
                $('#errorPass').show();

            }
            else {
                    $('.errorLogin').hide();
                    email = $("#inputEmail").val();
                    password = $("#inputPass").val();
                    console.log(email, password);
                    //RUTA = "https://app-intercruises.herokuapp.com/login";
            
                    $.ajax({
                type: "GET",
                url: 'https://app-intercruises.herokuapp.com/login',
                data: '{"username":"'+email+'", "password:":"'+password+'"}',
                crossDomain: true,
                dataType: "json"
            })
            .done(function (msg) {
                document.getElementById("frame-preload").style.display = "none"
                M.toast({
                    html: msg.mensaje
                })
                if (msg.mensaje === "El login se realizó correctamente.") {
                    console.log("OK");
                    location.href = `./pages/home/home.html?token=${msg.token}`
                }
            })
            .fail(function () {
                M.toast({
                    html: 'No se pudo establecer conexión con el servidor'
                })
            })
            }

         

            }

        app.initialize();