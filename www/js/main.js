var RUTA_HEROKU = 'https://app-intercruises.herokuapp.com';
var RUTA_LOCAL = 'http://localhost:3000';

var token = localStorage.getItem('token');
var currentUser = localStorage.getItem('currentUser');
var imInPage = 'newsfeedPage';
var butonVirgin;
var foto;
var notifications;
var number,description,scheduleStartHour,scheduleEndHour,publisher;


$(document).ready(function () {
  onFirstStart();
  $('#labelAddress').addClass('active');
  $('#errorPasswords').hide();
  $('div.sidenav-overlay').addClass("pantallaOscura");
  $('.sidenav').sidenav();
  // handling click event on slideMenu
  $('.botones').click(function (e) { openPage(e) });
  // handling click event on settings panel to make the logOut
  $('.settingsButtons').click(function (e) { openPage(e) });
  // handling click event on image, calling function input hided type file (select photo)
  $('body').on('click', 'img#profileImage', function () { $('#fileUpload').click() });
  // Manage notifications status with local storage (TO IMPLEMENT: store value into db because localStorage is not persistent)
  $('#notificationsSwitch').on('click', function () {
    if ($('#notificationsSwitch').prop('checked') == true) {

      var notification = true;
      var updateUserNotification = '{"username":"' + currentUser + '","notifications":"' + notification + '"}';

    }
    else {

      var notification = false;
      var updateUserNotification = '{"username":"' + currentUser + '","notifications":"' + notification + '"}';
    }

    var data = JSON.parse(updateUserNotification);
    $.ajax({
      url: RUTA_LOCAL + "/updateNotifications",
      headers: { "Authorization": token },
      type: "POST",
      data: data,
      dataType: "json"
    });

  });

  $("#btnConfirm").click(function () {
    saveImage();
    changePassword();
  });
  $(document).on('click', '.liListener', function (e) {
    siONo(e);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
  /* Create function to initialize the correct view */
  function mobileCheck() {
    if (window.innerWidth >= 768) {
      return false;
    } else {
      return true;
    }
  }

  getUser_Id(function (d) {
    getUserEvents(d, function (de) {
      localStorage.setItem('eventosUsuario', JSON.stringify(de));
    });
  });
  getUserJobs_Id(function (d) {
    getUserOffers(d, function (de) {
      localStorage.setItem('jobsUsuario', JSON.stringify(de));
    });
  });

  let lel = JSON.parse(localStorage.getItem('eventosUsuario'));
  let userEvents = [];


  for (let i = 0; i < lel.length; i++) {

    let descripciooo = lel[i].description;

    for (let q = 0; q < lel[i].schedule.length; q++) {
      let dia = lel[i].schedule[q];
      descripciooo += '\n' + dia.day + ': ' + dia.hour_start + ' - ' + dia.hour_end;
    }

    let newEvent = {
      'title': descripciooo,
      'description': descripciooo,
      'start': lel[i].schedule[0].day,
      'end': lel[i].schedule[lel[i].schedule.length - 1].day
    }
    userEvents.push(newEvent);
  }

  console.log('userEvents: ' + JSON.stringify(userEvents));

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['interaction', 'dayGrid', 'timeGrid'],
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    defaultDate: '2020-02-12',
    navLinks: true, // can click day/week names to navigate views
    selectable: true,
    selectMirror: true,
    select: function (arg) {
      var title = prompt('Event Title:');
      if (title) {
        calendar.addEvent({
          title: title,
          start: arg.start,
          end: arg.end,
          allDay: arg.allDay
        })
      }
      calendar.unselect()
    },
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    events: userEvents,
    eventRender: function (info) {
      $('.parent').attr('data-tooltip', info.event.extendedProps.description);
    }
  });

  calendar.render();
});


function checkPasswordsEmpty() {
  if ($('#inputPass') != "" && $('#inputPass2') != "") {
    return false;
  }
  else {
    return true;
  }
}

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
  notifications = localStorage.getItem('notifications');
  if (notifications == 'on') {
    $('#notificationsSwitch').prop('checked', true);
  }
  else {
    $('#notificationsSwitch').prop('checked', false);
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
  address = $('#inputAddress').val();
  passwordUndefined = "sindefinir"

  if (password1 == password2 && password1 != "" && password2 != "") {
    $('#errorPasswords').hide();
    var userPass = '{"username":"' + currentUser + '","password":"' + password1 + '","address":"' + address + '"}';
  } else {
    var userPass = '{"username":"' + currentUser + '","password":"' + passwordUndefined + '","address":"' + address + '"}';
    $('#errorPasswords').show();
  }

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
    getUser(currentUser, function (datos) {
      console.log(datos["notifications"]);
      $('#notificationsSwitch').prop('checked', datos["notifications"]);
    })
    imInPage = "settingsPage";
    console.log(imInPage);
    $('.pages').hide();
    $('#settingsPage').show();
    closeMenu();
  }
  else if (id == 'mapButton' && imInPage != 'mapFeedPage') {
    imInPage = "map";
    $('.pages').hide();
    $('#map').show();
    closeMenu();
  }
  else if (id == 'jobsButton' && imInPage != 'jobsPage') {
    getOffers();
    imInPage = "jobsPage";
    console.log(imInPage);
    getUserOffersJunt();
    $('.pages').hide();
    $('#jobsPage').show();
    closeMenu();
  }
  else if (id == 'calendarButton' && imInPage != 'calendarPage') {
    imInPage = "calendarPage";
    console.log(imInPage);
    getUserEventsJunt();
    $('.pages').hide();
    $('#calendarPage').show();
    closeMenu();
    $('.fc_title').tooltip();
    $('.fc_title').addClass('tooltipped');
    $('.fc-today-button').click()
  }
  else if (id == 'logOut') {
    console.log("logging out..");
    logOut();
  }
  else if (id == 'help'){
    $('#settingsPage').hide();
    $('#helpPage').show();
  }
  else if (id == 'adminUsers') {
    getUser(currentUser, function (datos){
      if(datos["role"]["role_name"] == "Responsible"){
        getAllUsers(function (datos){
          $('#listUsers').empty();
          for(var i = 0; i < datos.length; i++){
            $('#listUsers').append('<li class="collection-item avatar waves-effect waves-light"><img src="img/hombre.png" class="circle"><span class="title"><b>' + datos[i].username + '</b></span></li>')
          }
        })
        $('#settingsPage').hide();
        $('#adminUsersPage').show();
      }else {
        M.toast({ html: 'No tienes permisos para este apartado' })
      }
    })
    
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
  let dades = hacerUsernameJson(username);
  console.log(JSON.stringify(dades));
  $.ajax({
    method: "POST",
    headers: { "Authorization": token },
    url: RUTA_LOCAL + "/getPhoto",
    data: dades
  }).done(function (data) {
    if (data == "File Not Found") {
      // If user hasn't image, load default image
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

function getUserEventsJunt() {
  getUser_Id(function (d) {
    console.log(d);
  });
}

function getUserOffersJunt() {
  getUserJobs_Id(function (d) {
    console.log(d);
  });
}

function getUserById(d,flag) {
  let dades = JSON.parse('{"_id":"' + d + '"}');
  $.ajax({
    method: "POST",
    headers: { "Authorization": token },
    url: RUTA_LOCAL + "/getUserById",
    dataType: "json",
    data: dades
  }).done(function (data) {
    if(flag=="jobOffers"){
      setPublisherFoto(data,"jobOffers");
    }else if(flag=="newsFeed"){
      setPublisherFoto(data,"newsFeed");
    }
    console.log("XX" + JSON.stringify(data));
  }).fail(function (msg) {
    console.log("ERROR LLAMADA AJAX");
    M.toast({ html: 'Error en la conexion' })
  });
}

function getUser_Id(manejaData) {
  let dades = JSON.parse('{"username":"' + currentUser + '"}');
  console.log(dades);
  $.ajax({
    method: "POST",
    headers: { "Authorization": token },
    url: RUTA_LOCAL + "/getUser_Id",
    dataType: "json",
    data: dades
  }).done(function (data) {
    manejaData(data);
  }).fail(function (msg) {
    console.log("ERROR LLAMADA AJAX");
    M.toast({ html: 'Error en la conexion' })
  });
}

function getUserJobs_Id(manejaData) {
  let dades = JSON.parse('{"username":"' + currentUser + '"}');
  console.log(dades);
  $.ajax({
    method: "POST",
    headers: { "Authorization": token },
    url: RUTA_LOCAL + "/getUserJobs_Id",
    dataType: "json",
    data: dades
  }).done(function (data) {
    manejaData(data);
  }).fail(function (msg) {
    console.log("ERROR LLAMADA AJAX");
    M.toast({ html: 'Error en la conexion' })
  });
}

function getUserEvents(userId, manejaData) {
  let data = JSON.parse('{"_id":"' + userId + '"}');
  $.ajax({
    method: "POST",
    headers: { "Authorization": token },
    data: data,
    url: RUTA_LOCAL + "/getUserEvents",
    dataType: "json",
  }).done(function (data) {
    manejaData(data);
  }).fail(function (msg) {
    console.log("ERROR LLAMADA AJAX");
    M.toast({ html: 'Error en la conexion' })
  }).then(function (data) {

  });
}

function getUserOffers(userId, manejaData) {
  let data = JSON.parse('{"_id":"' + userId + '"}');
  $.ajax({
    method: "POST",
    headers: { "Authorization": token },
    data: data,
    url: RUTA_LOCAL + "/getUserOffers",
    dataType: "json",
  }).done(function (data) {
    manejaData(data);
  }).fail(function (msg) {
    console.log("ERROR LLAMADA AJAX");
    M.toast({ html: 'Error en la conexion' })
  }).then(function (data) {

  });
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
    var publisherId = JSON.stringify(datos[i].publisher);
    publisherId = publisherId.split("\\").join("");
    publisherId = publisherId.split('"').join("");
    //publisherId = publisherId.split("\\").join("");
    console.log("POP " + publisherId);
    let number = datos[i].number, description = datos[i].description, scheduleStartHour = datos[i].schedule[0].hour_start, scheduleEndHour = datos[i].schedule[0].hour_end, publisher = datos[i].publisher;
    foto = "img/defaultProfile.png";
    getUserById(publisherId,"jobOffers");
  }
}

async function insertNews(datos) {
  $('.newsFeedCollection').empty();
  for (var i = 0; i < datos.length; i++) {
    let publisherId = JSON.stringify(datos[i].publisher);
    publisherId = publisherId.split("\\").join("");
    publisherId = publisherId.split('"').join("");
    console.log("POP " + publisherId);
    number = datos[i].number, description = datos[i].description, scheduleStartHour = datos[i].schedule[0].hour_start, scheduleEndHour = datos[i].schedule[0].hour_end, publisher = datos[i].publisher;
    foto = "img/defaultProfile.png";
    getUserById(publisherId,"newsFeed");
  }
}

function setPublisherFoto(data, flag) {
  console.log("JAJAJA " + JSON.stringify(data));
  console.log("PUBLISH "+data.username);
  getPhoto(data.username, function (foto) {
    if (foto == null&&flag=="newsFeed") {
      console.log('predeterminando foto');
      foto = "img/defaultProfile.png";
      $('.newsFeedCollection').append('<li class="collection-item avatar waves-effect waves-light liListener"><img src= ' + foto + ' class="circle"><span class="title">' + '#' + number + ' ' + description + ' de ' + scheduleStartHour + 'H a ' + scheduleEndHour + 'H </span></li>');
    }
    if (foto == null&&flag=="jobsOffer") {
      console.log('predeterminando foto');
      foto = "img/defaultProfile.png";
      $('.jobsCollection').append('<li class="collection-item avatar waves-effect waves-light"><img src='+foto+' class="circle"><span class="title">' + '#' + number + ' ' + description + ' de ' + scheduleStartHour + 'H a ' + scheduleEndHour + 'H </span></li>');
    }
    else {
      console.log('FOTO OK');
      if(flag=="newsFeed") {
        $('.newsFeedCollection').append('<li class="collection-item avatar waves-effect waves-light liListener"><img src= ' + foto + ' class="circle"><span class="title">' + '#' + number + ' ' + description + ' de ' + scheduleStartHour + 'H a ' + scheduleEndHour + 'H </span></li>');
      }
      else if(flag=="jobOffers") {
        $('.jobsCollection').append('<li class="collection-item avatar waves-effect waves-light"><img src='+foto+' class="circle"><span class="title">' + '#' + number + ' ' + description + ' de ' + scheduleStartHour + 'H a ' + scheduleEndHour + 'H </span></li>');
      }
    }
    checkOfferState();
  });
}
function checkOfferState() {

}
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
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
  $('#inputAddress').empty();
  $('#inputAddress').val(datos.location.address);
}

function getAllUsers(manejaData){
  $.ajax({
    method: "GET",
    headers: { "Authorization": token },
    url: RUTA_LOCAL + "/allUsers",
    dataType: "json"
  }).done(function (data) {
    manejaData(data);
  }).fail(function (msg) {
    console.log("ERROR LLAMADA AJAX" + JSON.stringify(msg));
    M.toast({ html: 'Error en la conexión' })
  });
}

function iniciarMap(){
  var coord = {lat:-34.5956145 ,lng: -58.4431949};
  var map = new google.maps.Map(document.getElementById('map'),{
    zoom: 10,
    center: coord
  });
  var marker = new google.maps.Marker({
    position: coord,
    map: map
  });
}

