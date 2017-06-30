var data;
const debug = true;

//const apiURL = "http://api.openweathermap.org/data/2.5/weather";
// To host on github, use API Proxy
const apiURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather";
const appID = "a90133976c46059fee7922fcf02e5dba";


function kelvinToFarenhheit(k){
  return (((k-273.15)*1.8)+32).toFixed(1);
}

function kelvinToCelsius(k){
  return (k-273.15).toFixed(1);
}

// convert kelvin to selected unit
function convertTemperature(k){
  if (isImperial()) {
    return kelvinToFarenhheit(k);
  } else {
    return kelvinToCelsius(k);
  }
}

function isImperial(){
  return (document.getElementById('imperial').checked == true);
}

function getTempUnit(){
  if (isImperial()) {
    return '°F';
  } else {
    return '°C';
  }
}

// callback for api request
function reqListener () {
  //console.log(this.responseText);
  if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText);
         showUI(data);
    }
}

function mpsToMPH(s){
  // 1 mps = 2.23694 mph
  return (s * 2.23694).toFixed(2);
}

function convertSpeed(s){
  if (isImperial()) {
    return mpsToMPH(s) + ' MPH';
  } else {
    // default unit is meters per second
    return (s) + ' MPS';
  }
}

function calculateChillF(tempF, speed) {
		var chill = (35.74 + (.6215 * tempF)) - (35.75 * Math.pow(speed, .16)) + (.4275 * (tempF * Math.pow(speed, .16)));
		return chill;
}

function celciusToFarenheit(c){
  return c * 9 / 5 + 32;
}

function farenheitToCelcius(f){
  return f - 32 * 5 / 9;
}

function calculateChill(k){
  let t = convertTemperature(k);

  // t is either celcius or farenheit
  // the chillfactor only works in farenheit so we need logic to handle celcius.

  let chill = 0;
  let f = 0;

  // make sure temperature is in farenheit
  if (isImperial()){
    // t is already in farenheit
    f = t;
  } else {
    // convert t (celcius) to farenheit
    f = celciusToFarenheit(t);
  }

  // get temperature with chill factor (in f)
  chill = calculateChillF(f);


  // if user selected imperial, return chill (already in f)
  if (isImperial()){
    return chill;
  }
  else {
    // else convert chill (f) to c and return it
    return farenheitToCelcius(chill);
  }

}


function showUI(data){
  document.getElementById('city').innerText=data.name;
  document.getElementById('weatherMain').innerText=data.weather[0].main;
  document.getElementById('tempNow').innerText=convertTemperature(data.main.temp);
  document.getElementById('windSpeed').innerText=convertSpeed(data.wind.speed);
  document.getElementById('windDegrees').innerText=data.wind.deg;
  document.getElementById('tempUnit').innerText=getTempUnit();
  document.getElementById('feelsLike').innertext=`Feels like ${calculateChill(data.main.temp)} ${getTempUnit()}`;

  /* testing owfont
  let icon = document.getElementById('icon');
  let iconCode = data.weather[0].id;
  let iconClass = `owf-${iconCode}`;
  icon.className="";
  icon.classList.add("owf", iconClass, "owf-5x");
  */

  // Set the weather image
  let icon2 = document.createElement('img');
  let iconSource = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  icon2.setAttribute("src", iconSource);
  icon2.setAttribute("alt", data.weather[0].description);
  //icon2.setAttribute("class", "flex-column");

  let iconDiv = document.getElementById('iconDiv');
  iconDiv.innerHTML = "";
  iconDiv.appendChild(icon2);
}



function showWeather(){
  // debug - use hardcoded data to avoid overusing api and getting blocked.
  /*
  data = JSON.parse('{"coord":{"lon":-122.32,"lat":47.68},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"base":"stations","main":{"temp":289.27,"pressure":1015,"humidity":87,"temp_min":288.15,"temp_max":290.15},"visibility":16093,"wind":{"speed":2.6,"deg":180},"clouds":{"all":90},"dt":1498490280,"sys":{"type":1,"id":2949,"message":0.0043,"country":"US","sunrise":1498479191,"sunset":1498536685},"id":7261476,"name":"Inglewood-Finn Hill","cod":200}');
  showUI(data);
  return;
  */

  // get custom attributes from control
  let lat = this.getAttribute("data-lat");
  let lon = this.getAttribute("data-lon");

  params = {"lat":lat, "lon":lon, "APPID": appID};
  let query = queryBuilder(params);

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  let apiCall = apiURL + query;
  oReq.open("GET", apiCall);
  oReq.send();

}

function positionSuccess(position){
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  myLocation.setAttribute("data-lat", lat);
  myLocation.setAttribute("data-lon", lon);

}

function positionError(failure){
  console.log("code: " + failure.code);
  console.log("message: " + failure.message);
}

// When the dom is ready, wire up event handlers
document.addEventListener("DOMContentLoaded", function () {
  // button controls
  const london = document.querySelector('button.london');
  const seattle = document.querySelector('button.seattle');
  const myLocation = document.querySelector('button.myLocation');

  // getCurrentPosition doesnt always work on local machine, hardcode test values
  if (debug){
    // 47.5721227,-121.9972376
    myLocation.setAttribute("data-lat", 47.5721227);
    myLocation.setAttribute("data-lon", -121.9972376);
  } else {
    // get user lat/lon now and set custom attributes on the myLocation button.
    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
  }

  const unitImperial = document.getElementById('imperial');
  const unitMetric = document.getElementById('metric');



  // event handlers
  london.addEventListener('click', showWeather);
  seattle.addEventListener('click', showWeather);
  myLocation.addEventListener('click', showWeather)

  unitMetric.addEventListener('click', function(){
    showUI(data);
  });
  unitImperial.addEventListener('click', function(){
    showUI(data);
  });
})


// input {name: "elvis", location: "seattle"}
// output: ?name=elvis&location=seattle
function queryBuilder(queryObj){
  let holder = [];

  // loop through key values
  for (let key in queryObj) {

    // make each one into "key=value", encode to handle special characters like &
    let convert = `${encodeURIComponent(key)}=${queryObj[encodeURIComponent(key)]}`

    //console.log(convert);
    holder.push(convert);
  }

  // return value
  return '?'+holder.join("&");
}
