$(document).ready(() => {
  let $currentContent = $(".currently .content");
  let $location = $currentContent.find(".location");
  let $currentTemp = $currentContent.find(".temp");
  let $currentSummary = $currentContent.find(".summary");
  let $currentHumidity = $currentContent.find(".humidity .detail");

  let $next48hContent = $(".next-48h .content");
  let $time = $next48hContent.find(".time");
  let $next48hTemp = $next48hContent.find(".temp");
  let $next48hSummary = $next48hContent.find(".summary");
  let $next48hHumidity = $next48hContent.find(".humidity .detail");
  let $next48hSelect = $(".next-48h .heading .select-style select");
  let dataNext48h, indexNext48h = 1, next48hSelectInit = false;

  let $next7dContent = $(".next-7d .content");
  let $day = $next7dContent.find(".day");
  let $next7dTemp = $next7dContent.find(".temp");
  let $next7dSummary = $next7dContent.find(".summary");
  let $next7dHumidity = $next7dContent.find(".humidity .detail");
  let $next7dSelect = $(".next-7d .heading .select-style select");
  let dataNext7d, indexNext7d = 1, next7dSelectInit = false;
  
  let skycons = new Skycons({"color": "#3da4ab"});
  let F2C = F => ((F - 32) * 5 / 9).toFixed();
  let C2F = C => (C * 9 / 5 + 32).toFixed();
  let currentUnit = "F";

  $(".icon").on("click", event => {
    let $target = $(event.target);
    $target.closest(".heading").find(".menu").toggleClass("responsive");
  });

  $(".menu .item").on("click", event => {
    let $target = $(event.target);
    let unit = $target.attr("unit");
    $target.closest(".menu").children().removeClass("active");
    $target.addClass("active");
    
    if (unit !== currentUnit) {
      currentUnit = unit;
      switchTemperatureUnit();
    }
  });

  // Automatically enable cross-domain requests when needed
  $.ajaxPrefilter(options => {
    if (options.crossDomain && $.support.cors) {
      options.url = `https://cors-anywhere.herokuapp.com/${options.url}`;
    }
  });

  $.getJSON("https://ipinfo.io/", onLocationGot);

  function onLocationGot(info) {
    $location.text(`${info.city}, ${info.region}`);
    updateWeatherInfo.apply(null, info.loc.split(","));
  }

  function updateWeatherInfo(lat, lon) {
    let secretKey = "9b0af02f1ad5f739d0fd7a754e459238";
    let requestURL = `https://api.darksky.net/forecast/${secretKey}/${lat},${lon}`;

    $.getJSON(requestURL, info => {
      highlightView();
      updateWeatherCurrently(info.currently, $currentTemp, $currentSummary, $currentHumidity, "current-icon");
      updateWeatherNext48h(info.hourly.data, indexNext48h);
      updateWeatherNext7d(info.daily.data, indexNext7d);
    });
  }

  function highlightView() {
    $(".loading").css("display", "none");
    $(".main-app").css("opacity", 1);
  }

  function updateWeatherCurrently(infoCurrently, $temp, $summary, $humidity, idIcon) {
    let curTemp = infoCurrently.temperature.toFixed();
    $temp.text(`${curTemp}°${currentUnit}`); 
    $temp.attr("value", curTemp);

    $summary.text(infoCurrently.summary);
    $humidity.text(`${(infoCurrently.humidity * 100).toFixed()}%`);
    setWeatherIcon(idIcon, infoCurrently.icon);
  }

  function updateWeatherNext48h(infoHourlyData, index) {
    dataNext48h = infoHourlyData;
    let dataChoosen = dataNext48h[index];
    let date = new Date(dataChoosen.time * 1000);
    let formatDate = date.toLocaleString("en-US", {weekday: 'long', hour: '2-digit', minute:'2-digit'});
    $time.text(formatDate);

    updateWeatherCurrently(dataChoosen, $next48hTemp, $next48hSummary, $next48hHumidity, "next48h-icon");

    if(next48hSelectInit == false) {
      let dataSelect = [];
      for(let i = 1; i < dataNext48h.length; i += 6) {
        date = new Date(dataNext48h[i].time * 1000);
        formatDate = date.toLocaleString("en-US", {weekday: 'long', hour: '2-digit', minute:'2-digit'});
        dataSelect.push(formatDate);
      }
      initSelect($next48hSelect, dataSelect, updateWeatherNext48h, 6, dataNext48h);
      next48hSelectInit = true;
    }
  }

  function updateWeatherNext7d(infoDailyData, index) {
    dataNext7d = infoDailyData;
    let dataChoosen = dataNext7d[index];
    let date = new Date(dataChoosen.time * 1000);
    let formatDate = date.toLocaleString("en-US", {weekday: 'long'});
    $day.text(formatDate);

    let minTemp = dataChoosen.temperatureMin.toFixed();
    let maxTemp = dataChoosen.temperatureMax.toFixed();
    $next7dTemp.text(`${minTemp}°${currentUnit} / ${maxTemp}°${currentUnit}`);
    $next7dTemp.attr("min", minTemp);
    $next7dTemp.attr("max", maxTemp);

    $next7dSummary.text(dataChoosen.summary);
    $next7dHumidity.text(`${dataChoosen.humidity * 100}%`);
    setWeatherIcon("next7d-icon", dataChoosen.icon);

    if(next7dSelectInit == false) {
      let dataSelect = [];
      for(let i = 1; i < dataNext7d.length; i++) {
        date = new Date(dataNext7d[i].time * 1000);
        formatDate = date.toLocaleString("en-US", {weekday: 'long'});
        dataSelect.push(formatDate);
      }
      initSelect($next7dSelect, dataSelect, updateWeatherNext7d, 1, dataNext7d);
      next7dSelectInit = true;
    }
  }

  function initSelect($select, dataSelect, updateFunc, step, data) {
    dataSelect.forEach(element => {
      $select.append(`<option>${element}</option>`);
    });
    $select.on("change", (event) => {
      let $target = $(event.target);
      let index = $target[0].selectedIndex * step + 1;
      updateFunc(data, index);
    });
  }

  function setWeatherIcon(id, type) {
    if (type === "clear-day") {
      skycons.set(id, Skycons.CLEAR_DAY);
    } else if (type === "clear-night") {
      skycons.set(id, Skycons.CLEAR_NIGHT);
    } else if (type === "rain") {
      skycons.set(id, Skycons.RAIN);
    } else if (type === "snow") {
      skycons.set(id, Skycons.SNOW);
    } else if (type === "sleet") {
      skycons.set(id, Skycons.SLEET);
    } else if (type === "wind") {
      skycons.set(id, Skycons.WIND);
    } else if (type === "fog") {
      skycons.set(id, Skycons.FOG);
    } else if (type === "cloudy") {
      skycons.set(id, Skycons.CLOUDY);
    } else if (type === "partly-cloudy-day") {
      skycons.set(id, Skycons.PARTLY_CLOUDY_DAY);
    } else if (type === "partly-cloudy-night") {
      skycons.set(id, Skycons.PARTLY_CLOUDY_NIGHT);
    } else {
      console.log("Other Weather Icon");
    }
    skycons.play();
  }

  function switchTemperatureUnit() {
    switchTemperatureUnitByItem($currentTemp);
    switchTemperatureUnitByItem($next48hTemp);

    // next 7 days
    let minTemp = $next7dTemp.attr("min"), maxTemp = $next7dTemp.attr("max");
    let newMin, newMax;

    if(currentUnit === "F") {
      newMin = C2F(minTemp);
      newMax = C2F(maxTemp);
    }
    else {
      newMin = F2C(minTemp);
      newMax = F2C(maxTemp); 
    }
    $next7dTemp.text(`${newMin}°${currentUnit} / ${newMax}°${currentUnit}`);
    $next7dTemp.attr("min", newMin);
    $next7dTemp.attr("max", newMax);
  }

  function switchTemperatureUnitByItem($item) {
    let currentTemp = $item.attr("value"), newTemp;

    if(currentUnit === "F") newTemp = C2F(currentTemp);
    else newTemp = F2C(currentTemp);

    $item.text(`${newTemp}°${currentUnit}`);
    $item.attr("value", newTemp);
  }
});