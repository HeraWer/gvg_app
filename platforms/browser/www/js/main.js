var RUTA_HEROKU = 'https://app-intercruises.herokuapp.com';
var RUTA_LOCAL = 'http://localhost:3000';

var token = localStorage.getItem('token');
var currentUser = localStorage.getItem('currentUser');
var imInPage = 'newsfeedPage';
var butonVirgin;
var foto;
var notifications;

$(document).ready(function () {
  onFirstStart();
  $('#errorPasswords').hide();
  $('div.sidenav-overlay').addClass("pantallaOscura");
  $('.sidenav').sidenav();
  // handling click event on slideMenu
  $('.botones').click(function (e) { openPage(e) });
  // handling click event on settings panel to make the logOut
  $('.settingsButtons').click(function (e) { openPage(e) });
  // handling click event on image, calling function input hided type file (select photo)
  $('body').on('click', 'img#profileImage', function () { $('#fileUpload').click() });
  // Manage notifications status with local storage
  $('#notificationsSwitch').on('click', function () {
    console.log('--------'+$('#notificationsSwitch').prop('checked'));
    if ($('#notificationsSwitch').prop('checked')==true) {
      localStorage.setItem('notificactions', 'on');
    }
    else {
      localStorage.setItem('notificactions', 'off');
    }
  });

  $("#btnConfirm").click(function () { changePassword(), saveImage() });
  $(document).on('click', '.liListener', function (e) {
    siONo(e);
  });
});

function siONo(element) {
  if (confirm('Vols apunter-te a la oferta?')) {
    let lel = $(element.target).text().substring(1, 3);
    getUser(currentUser, function (user) {
      apuntameEvento(lel, user);
    });
  } else {
    console.log('No has volgut apuntarte a la oferta...');
  }
}

function apuntameEvento(numeroEvento, user) {
  let userrr = JSON.stringify(user);

  let lel = JSON.parse('{"number":"' + numeroEvento + '", "user": [' + userrr + ']}');
  console.log(lel);

  $.ajax({
    url: RUTA_LOCAL + "/apuntarseAEvent",
    headers: {
      "Authorization": token
    },
    type: "POST",
    data: lel
  }).done(function (data) {
    alert('Has sigut apuntat a aquesta oferta!');
  }).fail(function (msg) {
    alert('No has sigut apuntat a aquesta oferta :(')
  });
}

function onFirstStart() {
  checkToken();
  console.log('token checked');

  // If the token is valid (on first start) open directly the newsFeed page
  if (checkToken()) {
    $('.pages').hide();
    $('#' + imInPage).show();
    console.log(token);
    getNews();
  } else {
    console.log("token false");
  }
  notifications=localStorage.getItem('notifications');
  if(notifications=='on'){
    $('#notificationsSwitch').prop('checked',true);
  }
  else {
    $('#notificationsSwitch').prop('checked',false);
  }
}

function checkToken() {
  let data = JSON.parse('{"username":"' + currentUser + '"}');
  console.log('checking token');
  $.ajax({
    url: RUTA_LOCAL + "/checkToken",
    headers: {
      "Authorization": token
    },
    type: "POST",
    data: data,
    dataType: "json",
  }).done(function (data) {
    if (data.mensaje == 'Token invalido') {
      logOut();
    }

    if (token == '') {
      logOut();
    }

    if (data.mensaje == '') {
      logOut();
    }
  }).fail(function (msg) {
    logOut();
  });

  return true;
}

function checkImageSelected() {
  $("#fileUpload").change(function () {
    foto = document.getElementById('fileUpload').files[0];
    document.getElementById('profileImage').src = URL.createObjectURL(foto);
  });
}

function changePassword() {
  password1 = $('#inputPass').val();
  password2 = $('#inputPass2').val();

  if (password1 == password2 && password1 != "" && password2 != "") {
    $('#errorPasswords').hide();
    var userPass = '{"username":"' + currentUser + '","password":"' + password1 + '"}';

    var data = JSON.parse(userPass);
    $.ajax({
      url: RUTA_LOCAL + "/updatePassword",
      headers: { "Authorization": token },
      type: "POST",
      data: data,
      dataType: "json",
    }).done(function (data) {
      console.log(data);
      M.toast({ html: "Success !" });
      setTimeout(() => {
        imInPage = "newsFeedPage";
        console.log(imInPage);
        getUser(currentUser, function (datos) {
          insertProfile(datos);
        });
        $('.pages').hide();
        $('#newsfeedPage').show();
        closeMenu();
      }, 2000);

    }).fail(function (msg) {
      console.log(msg);
    });
  } else {
    $('#errorPasswords').show();
  }
}

function saveImage() {
  var form = $('#profileForm')[0]; // You need to use standard javascript object here
  var formData = new FormData(form);

  $.ajax({
    url: RUTA_LOCAL + "/setPhoto",
    headers: { "Authorization": token },
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      console.log("foto enviada")
    },
    error: function (jqXHR, textStatus, errorMessage) {
      console.log(errorMessage); // Optional
    }
  });
}

// This function opens the page hiding and showing divs by Jquery 
function openPage(e) {
  var id = e.target.id;
  if (id == 'profileButton' && imInPage != 'profilePage') {
    imInPage = "profilePage";
    console.log(imInPage);
    getUser(currentUser, function (datos) {
      insertProfile(datos);
    });
    $('.pages').hide();
    $('#profilePage').show();
    closeMenu();
  }
  else if (id == 'newsfeedButton' && imInPage != 'newsFeedPage') {
    getNews();
    imInPage = "newsFeedPage";
    console.log(imInPage);
    $('.pages').hide();
    $('#newsfeedPage').show();
    closeMenu();
  }
  else if (id == 'settingsButton' && imInPage != 'settingsPage') {
    imInPage = "settingsPage";
    console.log(imInPage);
    $('.pages').hide();
    $('#settingsPage').show();
    closeMenu();
  }
  else if (id == 'mapButton' && imInPage != 'mapFeedPage') {
    imInPage = "mapPage";
    console.log(imInPage);
    $('.pages').hide();
    $('#mapPage').show();
    closeMenu();
  }
  else if (id == 'jobsButton' && imInPage != 'jobsPage') {
    getOffers();
    imInPage = "jobsPage";
    console.log(imInPage);
    $('.pages').hide();
    $('#jobsPage').show();
    closeMenu();
  }
  else if (id == 'calendarButton' && imInPage != 'calendarPage') {
    imInPage = "calendarPage";
    console.log(imInPage);
    $('.pages').hide();
    $('#calendarPage').show();
    closeMenu();
  }
  else if (id == 'logOut') {
    logOut();
  }
}

function logOut() {
  // Remove token and user from browser storage and open login page
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  imInPage = "loginPage";
  console.log(imInPage);
  window.location.replace("index.html");
}

function closeMenu() {
  // function for close menu after click into a menu element
  console.log('closing menu');
  $('.menuGeneral').attr('style', 'transform: translateX(-105%)');
  $('div.sidenav-overlay').attr('style', 'display: none; opacity: 0;');
  $('.main_menu').removeAttr('style');
  $('.sidenav').sidenav();
}

function getNews() {
  console.log('getting news');
  $.ajax({
    method: "GET",
    headers: { "Authorization": token },
    url: RUTA_LOCAL + "/allEvents",
    dataType: "json",
  }).done(function (data) {
    console.log(data);
    insertNews(data);

  }).fail(function (msg) {
    console.log("ERROR LLAMADA AJAX");
    M.toast({ html: 'Error en la conexion' })
  });
}

function getUser(username, manejaData) {
  console.log('getting user info');
  let data = hacerUsernameJson(username);
  console.log('data: ' + data)
  $.ajax({
    method: "POST",
    headers: { "Authorization": token },
    url: RUTA_LOCAL + "/getUser",
    data: data,
    dataType: "json"
  }).done(function (data) {
    manejaData(data);
  }).fail(function (msg) {
    console.log("ERROR LLAMADA AJAX" + JSON.stringify(msg));
    M.toast({ html: 'Error en la conexión' })
  });
}

function hacerUsernameJson(nombreUsuairo) {
  return JSON.parse('{"username":"' + nombreUsuairo + '"}');
}

async function getPhoto(username, manejaData) {
  console.log('getting user photo');
  let dades = hacerUsernameJson(username);
  console.log(JSON.stringify(dades));
  $.ajax({
    method: "POST",
    headers: { "Authorization": token },
    url: RUTA_LOCAL + "/getPhoto",
    data: dades
  }).done(function (data) {
    if (data == "File Not Found") {
      // If user haven't image, load default image
      console.log("getPhoto: returning default photo");
      manejaData("img/defaultProfile.png");
    }
    else {
      //console.log('getPhoto devolviendo: ' + data)
      manejaData(data);
    }
  }).fail(function (msg) {
    console.log("ERROR LLAMADA AJAX" + JSON.stringify(msg));
    M.toast({ html: 'Error en la conexión' })
  });
}

function cargarFotoUserProfile(foto) {
  document.getElementById('profileImage').src = foto;
}

function getOffers() {
  console.log('getting offers');
  $.ajax({
    method: "GET",
    headers: { "Authorization": token },
    url: RUTA_LOCAL + "/allOffers",
    dataType: "json",
  }).done(function (data) {
    console.log(data);
    insertOffers(data);

  }).fail(function (msg) {
    console.log("ERROR LLAMADA AJAX");
    M.toast({ html: 'Error en la conexion' })
  });
}

function insertOffers(datos) {
  $('.jobsCollection').empty();
  for (var i = 0; i < datos.length; i++) {
    $('.jobsCollection').append('<li class="collection-item avatar waves-effect waves-light"><img src="img/image14.png" class="circle"><span class="title">' + '#' + datos[i].number + ' ' + datos[i].description + ' de ' + datos[i].schedule[0].hour_start + 'H a ' + datos[i].schedule[0].hour_end + 'H </span></li>');
  }
}

async function insertNews(datos) {
  $('.newsFeedCollection').empty();
  for (var i = 0; i < datos.length; i++) {
    let photo, number = datos[i].number, description = datos[i].description, scheduleStartHour = datos[i].schedule[0].hour_start, scheduleEndHour = datos[i].schedule[0].hour_end;
    console.log(datos);
    getPhoto(datos[i].publisher.username, function (foto) {
      photo = foto;
      if (photo == null) {
        photo = "img/image14.png";
        console.log('predeterminando foto');
      }
      $('.newsFeedCollection').append('<li class="collection-item avatar waves-effect waves-light liListener"><img src= ' + photo + ' class="circle"><span class="title">' + '#' + number + ' ' + description + ' de ' + scheduleStartHour + 'H a ' + scheduleEndHour + 'H </span></li>');
    });

  }

}

function insertProfile(datos) {
  $('#profileImageDiv').empty();
  $('#profileImageDiv').append('<img id="profileImage" src="img/defaultProfile.png" class="circle imageProfile"/> <input type="file" name="avatar" accept="image/png, image/jpeg, image/jpg" id="fileUpload" style="display: none"/>');
  checkImageSelected();
  console.log('pre-getPhoto: ' + currentUser)
  getPhoto(currentUser, function (foto) {
    cargarFotoUserProfile(foto);
  });
  $('#profileNameDiv').empty();
  $('#profileNameDiv').append('<b>Name: </b>' + datos.name);
  $('#profileLastNameDiv').empty();
  $('#profileLastNameDiv').append('<b>Last Name: </b>' + datos.lastname);
  $('#profileUserDiv').empty();
  $('#profileUserDiv').append('<b>Username: </b>' + datos.username);
}
