if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  console.log("Geolocation is not supported by this browser.");
}




function showPosition(position) {
  var long = position.coords.longitude;
  var lat = position.coords.latitude;
  console.log("Latitude: " + lat + "Longitude: " + long);
  localStorage.setItem("latitude", lat);
  localStorage.setItem("longitude", long);

}






async function getLocation() {
  var loc = document.getElementById('address').value;
  localStorage.setItem('place',loc);
  var lat = localStorage.getItem('latitude');
  var long = localStorage.getItem('longitude');


  var res = await
    fetch(`https://api.foursquare.com/v2/venues/search?client_id=QRLKAMHX5ZALOT3BLHZ5HIAMALTMAYYPKA52CI1CVOCJZISH&client_secret=EQHLATYISNUKQ2J1CUL4OSLPYTB3AVKVFYPV40NIGOQ3LO3W&v=20180323&limit=5&ll=${lat},${long}&query=${loc}&intent=browse&radius=25000`);
  var data = await res.json();
  console.log(data);
  var areas = data.response.venues;

  var opt = document.querySelectorAll('option');



  if (areas.length) {
    for (var i = 0; i < areas.length; i++) {
      opt[i].value = opt[i].text = areas[i].name;
      opt[i].setAttribute('lat', areas[i].location.labeledLatLngs[0].lat);
      opt[i].setAttribute('lng', areas[i].location.labeledLatLngs[0].lng);


    }







  }
  console.log(data.response.venues);

  // var area = document.getElementById('locations').value;


}

async function getInfo() {
  var area = document.getElementById('locations');
  var opts = document.querySelectorAll('option');

  for (var i = 0; i < opts.length; i++) {
    if (area.value === opts[i].value) {
      area.setAttribute('lat', opts[i].getAttribute('lat'));
      area.setAttribute('lng', opts[i].getAttribute('lng'));
      localStorage.setItem('venue',area.value)

      console.log('true')
    }
  }
  console.log(area.value);
  var lat = area.getAttribute('lat');
  var lng = area.getAttribute('lng');

  localStorage.setItem("lat2",lat);
  localStorage.setItem("lng2",lng);



}

var res1=localStorage.getItem('lat2');
var res2=localStorage.getItem('lng2');


  console.log(res1);
  console.log(res2);

 

  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map1'), {
      center: { lat:Number(res1), lng:Number(res2) },
      // center: {lat: -34.397, lng: 150.644},
      zoom: 5
    });
    console.log('map')
  }
