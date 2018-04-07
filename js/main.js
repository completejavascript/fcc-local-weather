$(document).ready(() => {
  let $currentContent = $(".currently .content");
  let $location = $currentContent.find(".location");
  let $currentTemp = $currentContent.find(".temp");
  let $currentSummary = $currentContent.find(".summary");
  let $currentHumidity = $currentContent.find(".humidity .detail");
  
  let skycons = new Skycons({"color": "#404040"});
  let F2C = F => ((F - 32) * 5 / 9).toFixed();
  let C2F = C => (C * 9 / 5 + 32).toFixed();
  let currentUnit = "F";

  $(".icon").on("click", event => {
    let $target = $(event.target);
    $target.closest(".heading").find(".menu").toggleClass("responsive");
  });

  $(".menu .item").on("click", event => {
    let $target = $(event.target);
    let $menu = $target.closest(".heading").find(".menu");
    $menu.addClass("responsive");

    let unit = $target.attr("unit");
    if (unit !== currentUnit) {
      switchTemperatureUnit();
      currentUnit = unit;
    }
  });

  // Automatically enable cross-domain requests when needed
  $.ajaxPrefilter(options => {
    if (options.crossDomain && $.support.cors) {
      options.url = `https://cors-anywhere.herokuapp.com/${options.url}`;
    }
  });

  $.getJSON("https://ipinfo.io/", response => onLocationGot(response));

  function onLocationGot(info) {
    $location.text(`${info.city}, ${info.region}`);
    updateWeatherInfo.apply(null, info.loc.split(","));
  }

  function updateWeatherInfo(lat, lon) {
    let secretKey = "9b0af02f1ad5f739d0fd7a754e459238";
    let requestURL = `https://api.darksky.net/forecast/${secretKey}/${lat},${lon}`;
    $.getJSON(requestURL, weatherInfo => {
      updateWeatherCurrently(weatherInfo.currently);
      updateWeatherNext48h(weatherInfo.hourly);
      updateWeatherNext7d(weatherInfo.daily);
    });
  }

  function updateWeatherCurrently(infoCurrently) {
    let curTemp = infoCurrently.temperature.toFixed();
    $currentTemp.text(`${curTemp}°F`); 
    $currentTemp.attr("value", curTemp);
    $currentTemp.attr("unit", "F");

    $currentSummary.text(infoCurrently.summary);
    $currentHumidity.text(`${infoCurrently.humidity * 100}%`);
    addWeatherIcon("current-icon", infoCurrently.icon);
  }

  function updateWeatherNext48h(infoHourly) {
    console.log("hourly", infoHourly);
  }

  function updateWeatherNext7d(infoDaily) {
    console.log("daily", infoDaily);
  }

  function addWeatherIcon(id, type) {
    if (type === "clear-day") {
      skycons.add(id, Skycons.CLEAR_DAY);
    } else if (type === "clear-night") {
      skycons.add(id, Skycons.CLEAR_NIGHT);
    } else if (type === "rain") {
      skycons.add(id, Skycons.RAIN);
    } else if (type === "snow") {
      skycons.add(id, Skycons.SNOW);
    } else if (type === "sleet") {
      skycons.add(id, Skycons.SLEET);
    } else if (type === "wind") {
      skycons.add(id, Skycons.WIND);
    } else if (type === "fog") {
      skycons.add(id, Skycons.FOG);
    } else if (type === "cloudy") {
      skycons.add(id, Skycons.CLOUDY);
    } else if (type === "partly-cloudy-day") {
      skycons.add(id, Skycons.PARTLY_CLOUDY_DAY);
    } else if (type === "partly-cloudy-night") {
      skycons.add(id, Skycons.PARTLY_CLOUDY_NIGHT);
    } else {
      console.log("Other Weather Icon");
    }
    skycons.play();
  }

  function switchTemperatureUnit() {
    switchTemperatureUnitByItem($currentTemp);
  }

  function switchTemperatureUnitByItem($item, unit) {
    let currentTemp = $item.attr("value");
    let currentUnit = $item.attr("unit");
    let newUnit, newTemp;

    if(currentUnit === "F") {
      newUnit = "C";
      newTemp = F2C(currentTemp);
    } else {
      newUnit = "F";
      newTemp = C2F(currentTemp);
    }

    $item.text(`${newTemp}°${newUnit}`); 
    $item.attr("value", newTemp);
    $item.attr("unit", newUnit);
  }
});