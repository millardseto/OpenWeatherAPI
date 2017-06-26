// button controls
const london = document.querySelector('button.london');
const seattle = document.querySelector('button.seattle');

function kelvinToFarenhheit(k){
  return (((k-273.15)*1.8)+32).toFixed(2);
}

function kelvinToCelsius(k){
  return (k-273.15).toFixed(2);
}

// convert kelvin to selected unit
function convertTemprature(k){
  if (document.getElementById('imperial').checked == true) {
    return kelvinToFarenhheit(k);
  } else {
    return kelvinToCelsius(k);
  }
}

// callback for api request
function reqListener () {
  //console.log(this.responseText);
  if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        /*
        name
        main.temp
        main.temp_min
        main.temp_max
        main.pressure
        main.humitidy
        weather[0].description
        sys.sunrise UTC
        sys.sunset UTC
        clouds.all cloud %
        wind.speed
         */

         showUI(data);
    }
}

function showUI(data){
  document.getElementById('city').innerText=data.name;
  document.getElementById('weatherMain').innerText=data.weather[0].description;
  document.getElementById('tempNow').innerText=convertTemprature(data.main.temp);
  document.getElementById('windSpeed').innerText=data.wind.speed;
}

function showWeather(){
  // debug - use hardcoded data to avoid overusing api and getting blocked.
  var data = JSON.parse('{"coord":{"lon":-122.32,"lat":47.68},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"base":"stations","main":{"temp":289.27,"pressure":1015,"humidity":87,"temp_min":288.15,"temp_max":290.15},"visibility":16093,"wind":{"speed":2.6,"deg":180},"clouds":{"all":90},"dt":1498490280,"sys":{"type":1,"id":2949,"message":0.0043,"country":"US","sunrise":1498479191,"sunset":1498536685},"id":7261476,"name":"Inglewood-Finn Hill","cod":200}');
  showUI(data);
  return;

  // get custom attributes from control
  let lat = this.getAttribute("data-lat");
  let lon = this.getAttribute("data-lon");

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  let apiCall = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=a90133976c46059fee7922fcf02e5dba`;
  oReq.open("GET", apiCall);
  oReq.send();

}

// When the dom is ready, wire up event handlers
document.addEventListener("DOMContentLoaded", function () {
  // event handlers
  london.addEventListener('click', showWeather);
  seattle.addEventListener('click', showWeather);
})
