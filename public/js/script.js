let map = null;
let locationsArr = [];
let allMarkers = [];
function myMap() {
  var mapCanvas = document.getElementById("map");
  var myCenter=new google.maps.LatLng(51.508742,-0.120850);
  var mapOptions = {center: myCenter, zoom: 7};
  map = new google.maps.Map(mapCanvas, mapOptions);
}

function placeMarker(map, location) {
   var marker = new google.maps.Marker({
    position: location,
    map: map
  });
   locationsArr.push([location.lat(),location.lng()]);
   allMarkers.push(marker);

   // $('#selectedPoints').append(`<li class='locations' data-lat=${location.lat()} data-lng=${location.lng()}>Lat: ${location.lat()}, Lgn: ${location.lng()}</li>`);
   marker.addListener('click',function() {
    // Remove the location from the locations array
    let index = -1;
    for (var i = 0; i < locationsArr.length; i++) {
      if (locationsArr[i][0] == location.lat() && locationsArr[i][1] == location.lng()) {
        index = i;
        break;
      }
    };
    if (index > -1) {
      locationsArr.splice(index,1);
    }
    index = allMarkers.indexOf(marker);
    if (index > -1) {
      allMarkers.splice(index,1);
    }
    // Remove marker
    marker.setMap(null);
   });
}

function populateMapsList(mapList) {
  // Clear first
  $('div.map-item').remove();
  $mapGroup = $('.map-item-group');
  mapList.forEach((map) => {
    $el = $(`<div class="map-item" data-mapid='${map.id}'>
            <span class="map-title">${map.name}</span>
            <div class="map-subitem">
              <span class="map-description">Description: ${map.description}</span><br>
              <span class="map-author">Author: ${map.owner_name}</span>
            </div>
          </div>`);
    $mapGroup.append($el);
  })
}

function clearMarkers() {
  allMarkers.forEach((marker) => marker.setMap(null));
  allMarkers = locationsArr = [];
}

function populateListMarkers(mapId) {
  $.ajax(`/lists/${mapId}/locations`).done((allLocations) => {
    clearMarkers();  
    allLocations.forEach((location) => {
      let marker = new google.maps.Marker({
        position: { lat: Number(location.latitude), lng: Number(location.longitude) },
        map: map
      })
      allMarkers.push(marker);
    });
  })
}

function getMapLists() {
  $.ajax('/lists').done(function(data) {
      populateMapsList(data);
    })
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

$(document).ready(function() {

  $('div.maps-sidebar').on('click','div.map-item',function(ev) {
    $(this).find('div.map-subitem').first().slideToggle();
  })
  // Search bar
  $('input#mapSearch').on('keyup',function(ev) {
    $('div.map-item:not(:contains('+ $(this).val() +'))').hide(); 
    $('div.map-item:contains('+ $(this).val() +')').show(); 
  });
  $('input#mapSearch').on('submit',function(ev) {
      ev.preventDefault();
  });

// Activate map button
$('#teste').click(function(ev) {
    if (!$(this).hasClass("editmap")){
      google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(map, event.latLng);
      });
      $(this).text('Deactivate');
      $(this).addClass("editmap")
    } else {
      google.maps.event.clearListeners(map, 'click');
      $(this).text('Place Markers');
      $(this).removeClass("editmap")
    }
    
})  

$('div.map-item-group').on('click','div.map-item',function(ev) {
  populateListMarkers($(this).data().mapid);
});

// Save mqrkers on map to DB
$('form#saveLocationsToDB').on('submit',(ev) => {
  ev.preventDefault();

  if (locationsArr.length > 0) {
    locationsArr.forEach((location) => {
      $.ajax({
        url: '/lists/9/locations',
        method: 'POST',
        data: { title: 'Test title' + Math.round(Math.random() * 20),
          description: 'Test description' + Math.round(Math.random() * 10),
          latitude: location[0],
          longitude: location[1],
          }
      }).done(function(msg) {
        console.log(msg);
      })    
    })
  }
})
  getMapLists();
// Get the list of maps from server
  $('.navbar a#btnMaps').click(function(ev) {
    ev.preventDefault();
    getMapLists();
  })
});

