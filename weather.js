var data;
const apiURL = "http://api.openweathermap.org/data/2.5/weather";
const appID = "a90133976c46059fee7922fcf02e5dba";




function kelvinToFarenhheit(k){
  return (((k-273.15)*1.8)+32).toFixed(2);
}

function kelvinToCelsius(k){
  return (k-273.15).toFixed(2);
}

// convert kelvin to selected unit
function convertTemperature(k){
  if (document.getElementById('imperial').checked == true) {
    return kelvinToFarenhheit(k) + ' °F';
  } else {
    return kelvinToCelsius(k) + ' °C';
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
  if (document.getElementById('imperial').checked == true) {
    return mpsToMPH(s) + ' MPH';
  } else {
    // default unit is meters per second
    return (s) + ' MPS';
  }
}

function showUI(data){
  document.getElementById('city').innerText=data.name;
  document.getElementById('weatherMain').innerText=data.weather[0].description;
  document.getElementById('tempNow').innerText=convertTemperature(data.main.temp);
  document.getElementById('windSpeed').innerText=convertSpeed(data.wind.speed);
  document.getElementById('windDegrees').innerText=data.wind.deg;
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

// When the dom is ready, wire up event handlers
document.addEventListener("DOMContentLoaded", function () {
  // button controls
  const london = document.querySelector('button.london');
  const seattle = document.querySelector('button.seattle');  
  const unitImperial = document.getElementById('imperial');
  const unitMetric = document.getElementById('metric');

  // event handlers
  london.addEventListener('click', showWeather);
  seattle.addEventListener('click', showWeather);

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
