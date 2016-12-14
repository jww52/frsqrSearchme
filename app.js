var latlon

//GetLocation Paste	

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(recordPosition, showError);
  } else {
    $(".area-results").innerHTML = "Geolocation is not supported by this browser.";
  }
}

function recordPosition(position) {
  latlon = position.coords.latitude.toFixed(2) + "," + position.coords.longitude.toFixed(2);
  console.log(latlon);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}
//**GetLocation Paste

function locationMsg() {
  var locaMsg = $(".area-results").append("</br> <h3 class='waitMsg'>Keep Pressing Buttons!</h3>");
  return locaMsg;
}

function getDataFromAPI(location, success) {
  var url = "https://api.foursquare.com/v2/venues/search";
  var settings = {
    ll: latlon,
    radius: "1000",
    limit: "10",
    client_id: "03A5EQ1B52O5UKVZJMXRX1SEFLNG3T5D4SBO5UV5BC0OWPLM",
    client_secret: "H3JUUBL0AM3DKLC4KI4R1ACX02PBGLYNZ4OJY3YZK2AP44CS",
    v: "20161208"
  };
  $.getJSON(url, settings, success);
}

function checkLatLon() {
  if (!latlon) {
    $(".area-results").append("<h2 class='laterMsg'>We don't have your location yet.  Press it again!</h2>");
  } else {
    $(".area-results").empty();
  }
}

function renderResults(data) {
  $(".area-results").empty();
  console.log(data);
  if (data.response.venues.length) {
    for (var i = 0; i < data.response.venues.length; i++) {
      var place = data.response.venues[i];
      $(".area-results").append("<div class='placeSec'><ul class='placeName'>" + place.name + "</ul></div>");
      if (place.location.address) {
        $(".area-results").append("<li>Near: " + place.location.address + "</li>");
      }
      if (place.location.city) {
        $(".area-results").append("<li>City: " + place.location.city + "</li>");
      }
      if (place.location.country) {
        $(".area-results").append("<li>" + place.location.country + "</li>");
      }
      if (place.url) {
        $(".area-results").append("<a href='" + place.url +"'class='placeURL'/a>");
      }
    }
  } else {
    $(".area-results").append("Sorry bro, your area sucks.");
  }
}

$(".give-local").click(function(e) {
  e.preventDefault();
  getLocation();
  $(".give-local").hide();
  $(".doAPI").show().css("display", "block");
  locationMsg();
});

$(".doAPI").click(function(e) {
  e.preventDefault();
  if (".area-results") {
    $(".area-results").empty();
  }
  checkLatLon();
  getDataFromAPI(latlon, renderResults);
});