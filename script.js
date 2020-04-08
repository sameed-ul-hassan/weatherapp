// Element Selectors

var submitBtn = document.querySelector(".submit");
var textBox = document.querySelector(".cityName");
var dataDiv = document.querySelector(".cityData");
var city = document.querySelector(".city");
var dateTime = document.querySelector(".dateTime");
var des = document.querySelector(".des");
var icon = document.querySelector(".icon");
var temp = document.querySelector(".temp");
var hum = document.querySelector(".hum");
var wind = document.querySelector(".wind");
var pres = document.querySelector(".pres");
var err = document.querySelector(".err");
var loader = document.querySelector(".loader");

// Add event listner
submitBtn.addEventListener("click", function() {
    dataDiv.classList.add("d-none");
    loader.classList.remove("d-none");
    err.textContent = "";
    var cityName = textBox.value;
    var request = new XMLHttpRequest();
    var method = "GET";
    var apiKey = "d7ae931a7d35c52db3a36a9b925a656d";
    var url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&units=metric&appid=" +
        apiKey;

    // HTTP Request
    request.open(method, url);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(request.response);
            var weatherData = new Weather(
                cityName.toUpperCase(),
                data.weather[0].description.toUpperCase(),
                data.main.pressure,
                data.main.humidity,
                data.weather[0].icon
            );
            weatherData.temp = data.main.temp;
            weatherData.time = data.dt;
            weatherData.wind = data.wind.speed;
            populateData(weatherData);

            // Check image is loaded
            var imgs = document.images,
                len = imgs.length,
                counter = 0;

            [].forEach.call(imgs, function(img) {
                if (img.complete) incrementCounter();
                else img.addEventListener("load", incrementCounter, false);
            });

            function incrementCounter() {
                counter++;
                if (counter === len) {
                    loader.classList.add("d-none");
                    dataDiv.classList.remove("d-none");
                }
            }
        } else if (
            request.readyState == XMLHttpRequest.done ||
            this.status == 404
        ) {
            err.textContent = "City name is incorrect";
        }
    };
    request.send();
});

// Weather object creation
function Weather(city, description, pressure, humidity, icon) {
    this.city = city;
    this.description = description;
    this.pressure = pressure + " hpa";
    this.humidity = humidity;
    this.icon = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    this._temp = "";
    this._time = "";
    this._wind = "";
}
// Temprature formating
Object.defineProperty(Weather.prototype, "temp", {
    get: function() {
        return this._temp;
    },
    set: function(value) {
        this._temp = value.toFixed();
    },
});
// Wind speed formating
Object.defineProperty(Weather.prototype, "wind", {
    get: function() {
        return this._wind;
    },
    set: function(value) {
        this._wind = (value * 3.6).toFixed() + " Km/h";
    },
});
// Time formating
Object.defineProperty(Weather.prototype, "time", {
    get: function() {
        return this._time;
    },
    set: function(value) {
        var dateTime = new Date(value * 1000);
        var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        var month = months[dateTime.getMonth()];
        var date = dateTime.getDate();
        var hour = dateTime.getHours();
        var min = dateTime.getMinutes();
        if (min < 10) {
            min = "0" + min;
        }
        this._time = date + " " + month + " " + hour + ":" + min;
    },
});

// Data population

function populateData(weatherData) {
    city.textContent = weatherData.city;
    dateTime.textContent = weatherData._time;
    des.textContent = weatherData.description;
    icon.src = weatherData.icon;
    temp.textContent = weatherData._temp;
    hum.textContent = weatherData.humidity;
    wind.textContent = weatherData._wind;
    pres.textContent = weatherData.pressure;
}