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
	$("#fileUpload").change(function(){
		foto = document.getElementById('fileUpload').files[0];
		document.getElementById('profileImage').src = URL.createObjectURL(foto);
	});
}

function saveImage () {
	//var fd = new FormData();
        //var file = $('#fileUpload').prop('files');
     var form = $('#profileForm')[0]; // You need to use standard javascript object here
	var formData = new FormData(form);

    $.ajax({
       url: RUTA_HEROKU + "/setPhoto",
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
		url: RUTA_HEROKU+"/getPhoto",
		processData: false,
       contentType: false
	}).done(function (data) {
		//var formData = new FormData(data);
		if(data=="File Not Found") {
			// If user haven't image, load default image
			document.getElementById('profileImage').src = "img/defaultProfile.png";
		}
		else {
			var binaryData = [];
			binaryData.push(data);
			var blob = new Blob(binaryData);
			
			var reader = new FileReader();
			reader.readAsDataURL(blob); 
 			reader.onloadend = function() {
     		var base64data = reader.result;
     		var urlCreator = window.URL || window.webkitURL;
   			//var imageUrl = urlCreator.createObjectURL(base64data);
			//$("#profileImage").attr("data:image/png;base64,", imageUrl);
			finalBase = base64data.replace("data:application/octet-stream;base64,","");                
     		document.querySelector("#profileImage").src = "data:image/png;base64,"+finalBase;
     		console.log(finalBase);	
 			}

			
		}

	}).fail(function (msg) {
		console.log("ERROR LLAMADA AJAX");
		M.toast({html: 'Error en la conexión'})
	});
}
function base64Encode(str) {
        var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = "", i = 0, len = str.length, c1, c2, c3;
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += CHARS.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += CHARS.charAt(c3 & 0x3F);
        }
        return out;
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