var token = localStorage.getItem("token");
RUTA_HEROKU = "https://app-intercruises.herokuapp.com/allEvents";
RUTA_LOCAL = "http://localhost:3000/allEvents";

$(document).ready(function(){
	$('.sidenav').sidenav();
	console.log(token);
	getNews();
});

function getNews () {
	$.ajax({
		method: "GET",
		url: RUTA_LOCAL,
		dataType: "json",
	}).done(function (data) {
		console.log(data);
	
	}).fail(function (msg) {
		console.log("ERROR LLAMADA AJAX");
		M.toast({html: 'Error en la conexión'})
	});
}
