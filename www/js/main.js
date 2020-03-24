var RUTA_HEROKU = "https://app-intercruises.herokuapp.com";
var RUTA_LOCAL = "http://localhost:3000";

var token = localStorage.getItem("token");
var currentUser = localStorage.getItem("currentUser");
var imInPage="newsfeedPage";
var butonVirgin;
var foto;

$(document).ready(function(){
	onFirstStart();
	$('div.sidenav-overlay').addClass("pantallaOscura");
	$('.sidenav').sidenav();
	// capturando evento click menu lateral
	$('.botones').click(function(e){openPage(e)});
	// capturando evento click panel settings para hacer logout
	$('.settingsButtons').click(function(e){openPage(e)});
	// capturando evento click en imagen llamamos funcion input oculto tipo file (seleccionar foto)
	$('body').on('click','img#profileImage',function(){$('#fileUpload').click()});

	$("#btnConfirm").click(function(){saveImage()});

});

function onFirstStart() {
	console.log(currentUser);
	$('.pages').hide();
	$('#'+imInPage).show();
	console.log(token);
	getNews();
}

function checkImageSelected () {
	// Esto es una preview (es un URL BLOB, un apuntador, no es el BLOB original, no se puede almacenar)
	$("#fileUpload").change(function(){
	foto = document.getElementById('fileUpload').files[0];
	document.getElementById('profileImage').src = URL.createObjectURL(foto);
	console.log(foto);
});
}

function saveImage () {
	var form = $('#profileForm')[0]; // You need to use standard javascript object here
	var formData = new FormData(form);

    $.ajax({
       url: RUTA_LOCAL+"/setPhoto",
       type: "POST",
       data: formData,
       processData: false,
       contentType: false,
       success: function(response) {
           console.log("foto enviada")
       },
       error: function(jqXHR, textStatus, errorMessage) {
           console.log(errorMessage); // Optional
       }
    });
}


function openPage(e){
	var id = e.target.id;
	if(id == 'profileButton'&& imInPage!='profilePage') {
		imInPage="profilePage";
		console.log(imInPage);
		getUser();
		$('.pages').hide();
		$('#profilePage').show();
		closeMenu();
	}
	else if(id == 'newsfeedButton' && imInPage!='newsFeedPage') {
		getNews();
		imInPage="newsFeedPage";
		console.log(imInPage);
		$('.pages').hide();
		$('#newsfeedPage').show();
		closeMenu();
	}
	else if(id == 'settingsButton' && imInPage!='settingsPage') {
		imInPage="settingsPage";
		console.log(imInPage);
		$('.pages').hide();
		$('#settingsPage').show();
		closeMenu();
	}
	else if(id == 'mapButton' && imInPage!='mapFeedPage') {
		imInPage="mapPage";
		console.log(imInPage);
		$('.pages').hide();
		$('#mapPage').show();
		closeMenu();
	}
	else if(id == 'chatButton' && imInPage!='chatPage') {
		imInPage="chatPage";
		console.log(imInPage);
		$('.pages').hide();
		$('#chatPage').show();
		closeMenu();
	}
	else if(id == 'calendarButton' && imInPage!='calendarPage') {
		imInPage="calendarPage";
		console.log(imInPage);
		$('.pages').hide();
		$('#calendarPage').show();
		closeMenu();
	}
	else if(id == 'logOut') {
		imInPage="loginPage";
		console.log(imInPage);
		window.location.replace("index.html");
	}
}

function closeMenu() {
	console.log('closing menu');
	$('.menuGeneral').attr('style','transform: translateX(-105%)');
	$('div.sidenav-overlay').attr('style','display: none; opacity: 0;');
	$('.main_menu').removeAttr('style');
	$('.sidenav').sidenav();
}

function getNews () {
	console.log('getting news');
	$.ajax({
		method: "GET",
		url: RUTA_HEROKU+"/allEvents",
		dataType: "json",
	}).done(function (data) {
		console.log(data);
		insertNews(data);

	}).fail(function (msg) {
		console.log("ERROR LLAMADA AJAX");
		M.toast({html: 'Error en la conexion'})
	});
}

function getUser () {
	console.log('getting user info');
	var userName = '{"username":"'+currentUser+'"}';
	var data = JSON.parse(userName); 

	$.ajax({
		method: "POST",
		url: RUTA_HEROKU+"/getUser",
		data: data,
		dataType: "json",
	}).done(function (data) {
		console.log(data);
		insertProfile(data);

	}).fail(function (msg) {
		console.log("ERROR LLAMADA AJAX");
		M.toast({html: 'Error en la conexión'})
	});
}

function pageIsActive (iden) {
	if($('div.'+iden).hasClass('active')) {
		return true;
	}
	else {
		return false;
	}
} 

function insertNews(datos) {
	$('.newsFeedCollection').empty();
	for (var i=0; i<datos.length; i++) {
		$('.newsFeedCollection').append('<li class="collection-item avatar waves-effect waves-light"><img src="img/image14.png" class="circle"><span class="title">'+'#'+datos[i].number+' '+datos[i].description+' de '+datos[i].schedule[0].hour_start+'H a '+datos[i].schedule[0].hour_end+'H </span></li>');
	}
}

function insertProfile(datos) {
	$('#profileImageDiv').empty();
	$('#profileImageDiv').append('<img id="profileImage" src="img/image14.png" alt="img/profile.png" class="circle imageProfile"/> <input type="file" name="avatar" accept="image/png, image/jpeg, image/jpg" id="fileUpload" style="display: none"/>');
	checkImageSelected();
	$('#profileNameDiv').empty();
	$('#profileNameDiv').append('<b>Name: </b>'+datos.name);
	$('#profileLastNameDiv').empty();
	$('#profileLastNameDiv').append('<b>Last Name: </b>'+datos.lastname);
	$('#profileUserDiv').empty();
	$('#profileUserDiv').append('<b>Username: </b>'+datos.username);
}