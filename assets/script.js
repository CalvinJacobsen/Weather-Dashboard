
function searchCityWeather(city) {

    //https://api.openweathermap.org/data/2.5/weather?q=minneapolis&appid=51f135d6aef7ba347cdd9f32a30bebca
    //https://api.openweathermap.org/data/2.5/forecast?id=5037649&appid=51f135d6aef7ba347cdd9f32a30bebca
    var APIKey = "51f135d6aef7ba347cdd9f32a30bebca";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    var entry = {};
    existingEntries = JSON.parse(localStorage.getItem("allEntries"));
    if (existingEntries == null) existingEntries = [];

    //checking to see if the city is already on the list, if it is it won't duplicate
    for (var i = 0; i < existingEntries.length; i++) {
        if (existingEntries[i].city.toLowerCase() == city.toLowerCase()) {
            return;
        }
    }

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // Putting objects to page
        var cityName = response.name;
        entry["city"] = cityName;

        var currentDate = moment().format("M/DD/YYYY");
        var weatherIcon = response.weather[0].icon;
        var weatherIconDesc = response.weather[0].description;


        //calculating temp
        var tempK = response.main.temp;
        var tempF = (tempK - 273.15) * 1.80 + 32;
        var tempK = response.main.feels_like;
        var tempFeelF = (tempK - 273.15) * 1.80 + 32;
        //remaining values input below
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;



        //getting 
        var existingEntries = JSON.parse(localStorage.getItem("allEntries"));
        if (existingEntries == null) existingEntries = [];

        entry["weather"] = {
            "date": currentDate,
            "icon": weatherIcon,
            "iconDesc": weatherIconDesc,
            "temp": tempF.toFixed(1),
            "tempFeel": tempFeelF.toFixed(1),
            "humidity": humidity,
            "windspeed": windSpeed,
        };

        //secondary ajax call to get forcast cards
        var inputCityID = response.id;
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + inputCityID + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            entry["forecast"] = [];
            var DayCards = 6;
            var j = 0;

            for (var i = 1; i < DayCards; i++) {

                //looping to get correct dates at time
                var found = false;

                while (found != true) {

                    var date = response.list[j].dt_txt;
                    //getting time around noon for consistancy
                    if (date.includes("12:00:00") == true) {
                        found = true
                        j += 1;
                    }
                    else {
                        j += 1;
                    }
                }

                var currentDate = moment().add(i, 'day').format("M/DD/YYYY");
                var weatherIcon = response.list[j].weather[0].icon;
                var weatherIconDesc = response.list[j].weather[0].description;
                var tempK = response.list[j].main.temp;
                var tempF = (tempK - 273.15) * 1.80 + 32;
                var humidity = response.list[j].main.humidity;

                //assigning values to specific cards


                entry["forecast"].push({
                    "date": currentDate,
                    "icon": weatherIcon,
                    "iconDesc": weatherIconDesc,
                    "temp": tempF.toFixed(1),
                    "humidity": humidity,
                });

            }

            localStorage.setItem("entry", JSON.stringify(entry));
            // Save allEntries back to local storage
            existingEntries.push(entry);
            localStorage.setItem("allEntries", JSON.stringify(existingEntries));
            createButton();
            populateWeather(cityName);
        });

    });
}

function createButton() {

    $("#searchedCities").text("")
    existingEntries = JSON.parse(localStorage.getItem("allEntries"));
    if (existingEntries == null) {
        return
    }
    else {
        for (var i = 0; i < existingEntries.length; i++) {
            $("ul").append('<li class="list-group-item" onclick="populateWeather(this.id)" id="' + existingEntries[i].city + '">' + existingEntries[i].city + '</li>');
        }
    }
}

function populateWeather(city) {
    
    console.log(city);
    existingEntries = JSON.parse(localStorage.getItem("allEntries"));

    //finding at which position the searched city is within the object // mainly for button click functionality
    for (var i = 0; i < existingEntries.length; i++) {
        if (existingEntries[i].city = city) {
            var j = i;
        }
    }

    $("#searchedCity").text(existingEntries[j].city);
    $("#currentDate").text("(" + existingEntries[j].weather.date + ")");
    $("#todayWeatherIcon").html("<img src=http://openweathermap.org/img/wn/" + existingEntries[j].weather.icon + ".png style='height:70px;' title='" + existingEntries[j].weather.iconDesc + "'>");
    $("#tempReturn").text("Tempurature: " + existingEntries[j].weather.temp + " °F");
    $("#tempFeelReturn").text("Feels Like: " + existingEntries[j].weather.tempFeel + " °F");
    $("#humidityReturn").text("Humidity: " + existingEntries[j].weather.humidity + "%");
    $("#windspeedReturn").text("Wind Speed: " + existingEntries[j].weather.windSpeed + " MPH");

    DayCards = 5;

    for (var i = 0; i < DayCards; i++) {
        $("#date" + [i + 1]).text(existingEntries[j].forecast[i].date);
        $("#date" + [i + 1] + "Icon").html("<img src=http://openweathermap.org/img/wn/" + existingEntries[j].forecast[i].icon + ".png style='height:45px;' title='" + existingEntries[j].forecast[i].iconDesc + "'>");
        $("#tempReturn" + [i + 1]).text("Tempurature: " + existingEntries[j].forecast[i].temp + " °F");
        $("#humidityReturn" + [i + 1]).text("Humidity: " + existingEntries[j].forecast[i].humidity + "%");
    }
}

//onclick for clearing the list
$("#clearButton").on("click", function (event) {
    event.preventDefault();
    existingEntries = [];
    $("#searchedCities").text("")
    localStorage.clear();
    location.reload();
});

$("#searchCity").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the artist name
    var inputCity = $("#cityRequest").val().trim();
    // Running the searchBandsInTown function(passing in the artist as an argument)
    searchCityWeather(inputCity);
});

//onload generates buttons
window.onload = function () {
    createButton()
};
