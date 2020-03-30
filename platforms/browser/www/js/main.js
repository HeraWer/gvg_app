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
	// handling click event on slideMenu
	$('.botones').click(function(e){openPage(e)});
	// handling click event on settings panel to make the logOut
	$('.settingsButtons').click(function(e){openPage(e)});
	// handling click event on image, calling function input hided type file (select photo)
	$('body').on('click','img#profileImage',function(){$('#fileUpload').click()});
	
	$("#btnConfirm").click(function(){saveImage()});
});

function onFirstStart() {
	checkToken();
	console.log("token checked");
	// If the token is valid (on first start) open directly the newsFeed page
	if(checkToken()){
		$('.pages').hide();
		$('#'+imInPage).show();
		console.log(token);
		getNews();
	}
	else {
		console.log("token false");
	}
}
function checkToken() {
	console.log('checking token');
	$.ajax({
		url: RUTA_LOCAL+"/checkToken",
		headers: {"Authorization": token},
		type: "POST",
		processData: false,
		contentType: false
	}).done(function (data) {
		if(data.mensaje == 'Token invalido') {
			logOut();
		}
		if (token == "") {
			logOut();
		}
		if (data.mensaje == "") {
			logOut();
		}
	}).fail(function (msg) {
		logOut();
	});
	return true;
}

function checkImageSelected () {
	$("#fileUpload").change(function(){
		foto = document.getElementById('fileUpload').files[0];
		document.getElementById('profileImage').src = URL.createObjectURL(foto);
	});
}

function saveImage () {
     var form = $('#profileForm')[0]; // You need to use standard javascript object here
     var formData = new FormData(form);

     $.ajax({
     	url: RUTA_LOCAL+"/setPhoto",
     	headers: {"Authorization": token},
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

 // This function opens the page hiding and showing divs by Jquery 
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
 		logOut();
 	}
 }

 function logOut () {
 	// Remove token and user from browser storage and open login page
 	localStorage.removeItem("token");
 	localStorage.removeItem("currentUser");
 	imInPage="loginPage";
 	console.log(imInPage);
 	window.location.replace("index.html");
 }

 function closeMenu() {
 	// function for close menu after click into a menu element
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
 		headers: {"Authorization": token},
 		url: RUTA_LOCAL+"/allEvents",
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
 		headers: {"Authorization": token},
 		url: RUTA_LOCAL+"/getUser",
 		data: data,
 		dataType: "json",
 	}).done(function (data) {
 		insertProfile(data);

 	}).fail(function (msg) {
 		console.log("ERROR LLAMADA AJAX");
 		M.toast({html: 'Error en la conexión'})
 	});
 }
 function getPhoto () {
 	console.log('getting user photo');

 	$.ajax({
 		method: "GET",
 		headers: {"Authorization": token},
 		url: RUTA_LOCAL+"/getPhoto",
 		processData: false,
 		contentType: false
 	}).done(function (data) {
		//var formData = new FormData(data);
		if(data=="File Not Found") {
			// If user haven't image, load default image
			console.log("loading default photo");
			document.getElementById('profileImage').src = "img/defaultProfile.png";
		}
		else {
			var binaryData = [];
			binaryData.push(data);
			var blob = new Blob(binaryData);
			const blobUrl = URL.createObjectURL(blob)
			//var reader = new FileReader();
			//reader.readAsDataURL(blob); 
 			//reader.onloadend = function() {
     		//var base64data = reader.result;
     		var urlCreator = window.URL || window.webkitURL;
   			//var imageUrl = urlCreator.createObjectURL(base64data);
			//$("#profileImage").attr("data:image/png;base64,", imageUrl);
			//finalBase = base64data.replace("data:application/octet-stream;base64,","");                
     		//document.querySelector("#profileImage").src = "data:image/png;base64,"+finalBase;
     		document.querySelector("#profileImage").src = /*'data:image/jpeg;base64,' + */blobUrl;
     		console.log(blobUrl);	
 			//}
 		}

 	}).fail(function (msg) {
 		console.log("ERROR LLAMADA AJAX");
 		M.toast({html: 'Error en la conexión'})
 	});
 }

 function insertNews(datos) {
 	$('.newsFeedCollection').empty();
 	for (var i=0; i<datos.length; i++) {
 		$('.newsFeedCollection').append('<li class="collection-item avatar waves-effect waves-light"><img src="img/image14.png" class="circle"><span class="title">'+'#'+datos[i].number+' '+datos[i].description+' de '+datos[i].schedule[0].hour_start+'H a '+datos[i].schedule[0].hour_end+'H </span></li>');
 	}
 }

 function insertProfile(datos) {
 	$('#profileImageDiv').empty();
 	$('#profileImageDiv').append('<img id="profileImage" src="img/defaultProfile.png" class="circle imageProfile"/> <input type="file" name="avatar" accept="image/png, image/jpeg, image/jpg" id="fileUpload" style="display: none"/>');
 	checkImageSelected();
 	getPhoto();
 	$('#profileNameDiv').empty();
 	$('#profileNameDiv').append('<b>Name: </b>'+datos.name);
 	$('#profileLastNameDiv').empty();
 	$('#profileLastNameDiv').append('<b>Last Name: </b>'+datos.lastname);
 	$('#profileUserDiv').empty();
 	$('#profileUserDiv').append('<b>Username: </b>'+datos.username);
 }