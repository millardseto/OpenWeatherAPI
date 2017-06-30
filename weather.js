var data;
const debug = false;

//const apiURL = "http://api.openweathermap.org/data/2.5/weather";
// To host on github, use API Proxy
const apiURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather";
const appID = "a90133976c46059fee7922fcf02e5dba";


function kelvinToFarenhheit(k){
  return (((k-273.15)*1.8)+32).toFixed(1);
}

function getTempUnit(){
    return '°F';
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
    return mpsToMPH(s) + ' MPH';
}


function showUI(data){
  document.getElementById('city').innerText=data.name;

  document.getElementById('weatherMain').innerText=data.weather[0].main;
  document.getElementById('tempNow').innerText=kelvinToFarenhheit(data.main.temp);
  document.getElementById('tempUnit').innerText=getTempUnit();
  document.getElementById('windSpeed').innerText=convertSpeed(data.wind.speed);

  document.getElementById('humidity').innerText=`Humidity ${data.main.humidity}`;
  document.getElementById('windDegrees').innerText=`Direction:  ${data.wind.deg}`;

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
  icon2.setAttribute("class", "icon");
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
  const myLocation = document.querySelector('button.myLocation');
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
  myLocation.addEventListener('click', showWeather);
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
