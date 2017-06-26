// button controls
const london = document.querySelector('button.london');
const seattle = document.querySelector('button.seattle');

function reqListener () {
  console.log(this.responseText);
}

function showWeather(){
  let lat = this.getAttribute("data-lat");
  let lon = this.getAttribute("data-lon");
  // console.log(`Lat: ${lat} Lon: ${lon}`);
  //
  // api.openweathermap.org/data/2.5/weather?lat=35&lon=139
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
