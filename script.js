const url = "https://api.openweathermap.org/data/2.5/";
import { key } from "./key.js";

const dialLines = document.getElementsByClassName("diallines");
const clockEl = document.getElementsByClassName("clock")[0];
let searchValue = document.getElementById("searchBar");

for (let i = 1; i < 60; i++) {
  clockEl.innerHTML += "<div class='diallines'></div>";
  dialLines[i].style.transform = "rotate(" + 6 * i + "deg)";
}

function clock() {
  let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    d = new Date(),
    hour = d.getHours(),
    minute = d.getMinutes(),
    second = d.getSeconds(),
    date = d.getDate(),
    month = d.getMonth() + 1,
    year = d.getFullYear(),
    hourDeg = hour * 30 + minute * (360 / 720),
    minuteDeg = minute * 6 + second * (360 / 3600),
    secondDeg = second * 6,
    hourEl = document.querySelector(".hour-hand"),
    minuteEl = document.querySelector(".minute-hand"),
    secondEl = document.querySelector(".second-hand"),
    dateEl = document.querySelector(".date"),
    dayEl = document.querySelector(".day");

  const day = days[d.getDay()];

  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }

  hourEl.style.transform = "rotate(" + hourDeg + "deg)";
  minuteEl.style.transform = "rotate(" + minuteDeg + "deg)";
  secondEl.style.transform = "rotate(" + secondDeg + "deg)";
  dateEl.innerHTML = date + "/" + month + "/" + year;
  dayEl.innerHTML = day;
}

setInterval(clock, 100);

async function getResult(cityName) {
  const query = `${url}weather?q=${cityName}&appid=${key}&units=metric&lang`;
  const response = await fetch(query);
  try {
    if (!response.ok) {
      displayNoData();
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const weather = await response.json();
    return displayResult(weather);
  } catch (err) {
    console.error(err);
  } finally {
    searchValue.value = "";
  }
}

const displayResult = (result) => {
  const city = document.querySelector(".city");
  city.innerText = `${result.name}, ${result.sys.country}`;
  const temp = document.querySelector(".temp");
  temp.innerText = `${Math.round(result.main.temp)}°C`;
  const desc = document.querySelector(".desc");
  desc.innerText = result.weather[0].description;
  const minmax = document.querySelector(".minmax");
  minmax.innerText = `${Math.round(result.main.temp_min)}°C/
  ${Math.round(result.main.temp_max)}°C`;
};

const displayNoData = () => {
  const city = document.querySelector(".city");
  city.innerText = "Ooops, enter a valid city";
  const temp = document.querySelector(".temp");
  temp.innerText = "";
  const desc = document.querySelector(".desc");
  desc.innerText = "";
  const minmax = document.querySelector(".minmax");
  minmax.innerText = "";
};

const setQuery = (e) => {
  if (e.keyCode == 13) getResult(searchBar.value);
};
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keypress", setQuery);
