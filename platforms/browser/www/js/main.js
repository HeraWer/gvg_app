var token = localStorage.getItem("token");
var imInPage="newsFeedPage";
RUTA_HEROKU = "https://app-intercruises.herokuapp.com/allEvents";
RUTA_LOCAL = "http://localhost:3000/allEvents";

$(document).ready(function(){
	$('.secondaryPages').hide();
	$('.sidenav').sidenav();
	console.log(token);
	getNews();

	// capturando evento click menu lateral
	$('.botones').click(function(e){openPage(e)});
});

function openPage(e){
	var id = e.target.id;
	if(id == 'profileButton'&& imInPage!='profilePage') {
		imInPage="profilePage";
		console.log(imInPage);
		$('.pages').hide();
		$('#profilePage').show();
	}
	else if(id == 'newsfeedButton' && imInPage!='newsFeedPage') {
		imInPage="newsFeedPage";
		console.log(imInPage);
		$('.pages').hide();
		$('#newsfeedPage').show();
	}
	else if(id == 'settingsButton' && imInPage!='settingsPage') {
		imInPage="settingsPage";
		console.log(imInPage);
		$('.pages').hide();
		$('#settingsPage').show();
	}
	else if(id == 'mapButton' && imInPage!='mapFeedPage') {
		imInPage="mapPage";
		console.log(imInPage);
		$('.pages').hide();
		$('#mapPage').show();
	}
	else if(id == 'chatButton' && imInPage!='chatPage') {
		imInPage="chatPage";
		console.log(imInPage);
		$('.pages').hide();
		$('#chatPage').show();
	}
	else if(id == 'calendarButton' && imInPage!='calendarPage') {
		imInPage="calendarPage";
		console.log(imInPage);
		$('.pages').hide();
		$('#calendarPage').show();
	}
}

function getNews () {
	$.ajax({
		method: "GET",
		url: RUTA_LOCAL,
		dataType: "json",
	}).done(function (data) {
		console.log(data);
		//var datos = JSON.parse(data);
		insertNews(data);

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
	for (var i=0; i<datos.length; i++) {
		
		$('.collection').append('<li class="collection-item avatar waves-effect waves-light"><img src="img/image14.png" class="circle"><span class="title">'+'#'+datos[i].number+' '+datos[i].description+' de '+datos[i].schedule[0].hour_start+'H a '+datos[i].schedule[0].hour_end+'H </span></li>');

	}
}