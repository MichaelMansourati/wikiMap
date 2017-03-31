let map = null;
let locationsArr = [];
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
   locationsArr.push([location.lat(),location.lng()]);
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
    console.log(index);
    if (index > -1) {
      locationsArr.splice(index,1);
    }
    // Remove marker
    marker.setMap(null);
   });
}

function populateMapsList(mapList) {
  // Clear first
  $('div.map-item').remove();
  $sidebar = $('.maps-sidebar');
  mapList.forEach((map) => {
    $el = $(`<div class="map-item">
            <span class="map-title">${map.name}</span>
            <div class="map-subitem">
              <span class="map-description">Description: ${map.description}</span><br>
              <span class="map-author">Author: ${map.owner_name}</span>
            </div>
          </div>`);
    $sidebar.append($el);
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
  $( '.navbav a .users').click(function(event) {
      
  })

  $('div.maps-sidebar').on('click','div.map-item',function(ev) {
    $(this).find('div.map-subitem').first().slideToggle();
  })

  $('input#mapSearch').on('keyup',function(ev) {
    $('div.map-item:not(:contains('+ $(this).val() +'))').hide(); 
    $('div.map-item:contains('+ $(this).val() +')').show(); 
  })
  $('input#mapSearch').on('submit',function(ev) {
      ev.preventDefault();
    })

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
      $(this).text('Activate');
      $(this).removeClass("editmap")
    }
    
})  

// Save markers on map to DB
// $('form#saveLocationsToDB').on('submit',(ev) => {
//   ev.preventDefault();

//   if (locationsArr.length > 0) {
//     locationsArr.forEach((location) => {
//       $.ajax({
//         url: '/lists/8/locations',
//         method: 'POST',
//         data: { title: 'Test title' + Math.round(Math.random() * 20),
//           description: 'Test description' + Math.round(Math.random() * 10),
//           latitude: location[0],
//           longitude: location[1],
//           }
//       }).done(function(msg) {
//         console.log(msg);
//       })    
//     })
// //   }
// })
  getMapLists();
// Get the list of maps from server
  $('.navbar a#btnMaps').click(function(ev) {
    ev.preventDefault();
    getMapLists();
  })
});

