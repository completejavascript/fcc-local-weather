$(document).ready(() => {
  $(".icon").on("click", event => {
    let $target = $(event.target);
    $target.closest(".heading").find(".menu").toggleClass("responsive");
  });

  $(".menu .item").on("click", event => {
    let $target = $(event.target);
    $target.closest(".heading").find(".menu").addClass("responsive");
  });

  // let defaultLocation = {
  //   lat: 21,
  //   lon: 105 
  // };

  // let options = {
  //   enableHighAccuracy: true,
  //   timeout: 5000,
  //   maximumAge: 0
  // };

  // let $temp = $("#temp"), $pressure = $("#pressure"),
  //     $humidity = $("#humidity"), $sun = $("#sun");

  // // init();

  // function init() {
  //   getWeatherFromLocation(defaultLocation);
  // }

  // function getWeatherFromLocation(location) {
  //   let request = `https://fcc-weather-api.glitch.me/api/current?lat=${location.lat}&lon=${location.lon}`;
  //   $.getJSON(request, onGetWeatherSuccess);
  // }

  // function onGetWeatherSuccess(data) {
  //   console.log(data);

  //   let main = data.main;
  //   $temp.text(main.temp.toFixed());
  //   $pressure.text(`${main.pressure}mb`);
  //   $humidity.text(`${main.humidity}%`);

  //   let sys = data.sys;
  //   let sunrise = sys.sunrise;
  //   let sunset = sys.sunset;
  //   $sun.text(`${getTime(sunrise)} | ${getTime(sunset)}`);
  // }

  // function getTime(ms) {
  //   let date = new Date(ms);
  //   let hour = date.getHours();
  //   let minutes = date.getMinutes();
  //   return `${hour} : ${minutes}`;
  // }

  // function getLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       position => onGetLocationSuccess, 
  //       error => onGetLocationError, 
  //       options);
  //   } else {
  //     console.log("Geolocation is not supported by this browser.");
  //   }
  // }

  // function onGetLocationSuccess(position) {
  //   currentLocation.lat = position.coords.latitude;
  //   currentLocation.lon = position.coords.longitude;
  //   console.log("Current location:", currentLocation);
  // }

  // function onGetLocationError(error) {
  //   console.log("Get location error:", error);
  // }
});