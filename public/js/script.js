let map = null;
function myMap() {
  var mapCanvas = document.getElementById("map");
  var myCenter=new google.maps.LatLng(51.508742,-0.120850);
  var mapOptions = {center: myCenter, zoom: 5};
  map = new google.maps.Map(mapCanvas, mapOptions);
}

function placeMarker(map, location) {
   var marker = new google.maps.Marker({
    position: location,
    map: map
  });
   $('#selectedPoints').append(`<li class='locations' data-lat=${location.lat()} data-lng=${location.lng()}>Lat: ${location.lat()}, Lgn: ${location.lng()}</li>`);
   marker.addListener('click',function() {
    marker.setMap(null);
   });
  // var infowindow = new google.maps.InfoWindow({
  //   content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
  // });
  // infowindow.open(map,marker);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

$(document).ready(function() {
  $( '.navbav a .users').click(function(event) {
      
  })

$('#teste').click(function(ev) {
    if (!$(this).hasClass("editmap")){
      google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(map, event.latLng);
      });
      $(this).text('Deactivate');
      $(this).addClass("editmap")
    } else {
      google.maps.event.clearListeners(map, 'click');
      $(this).text('Activate');
      $(this).removeClass("editmap")
    }
    
})  

  $('.navbar a#btnMaps').click(function(ev) {
    ev.preventDefault();
    $.ajax('/lists').done(function(data) {
      $sidebar = $('nav.sidebar');
      data.forEach((el) => {
        $sidebar.append($(`<p>${el.name}</p>`));
      })
    })
  })
});

