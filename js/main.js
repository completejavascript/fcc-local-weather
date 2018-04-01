$(document).ready(() => {
  let defaultLocation = {
    lat: 21,
    lon: 105 
  };

  let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  init();

  function init() {
    getWeatherFromLocation(defaultLocation);
  }

  function getWeatherFromLocation(location) {
    let request = `https://fcc-weather-api.glitch.me/api/current?lat=${location.lat}&lon=${location.lon}`;
    $.getJSON(request, onGetWeatherSuccess);
  }

  function onGetWeatherSuccess(data) {
    console.log(data);
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => onGetLocationSuccess, 
        error => onGetLocationError, 
        options);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function onGetLocationSuccess(position) {
    currentLocation.lat = position.coords.latitude;
    currentLocation.lon = position.coords.longitude;
    console.log("Current location:", currentLocation);
  }

  function onGetLocationError(error) {
    console.log("Get location error:", error);
  }
});