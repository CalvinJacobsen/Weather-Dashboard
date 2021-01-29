function searchCityWeather(city) {

    //https://api.openweathermap.org/data/2.5/weather?q=minneapolis&appid=51f135d6aef7ba347cdd9f32a30bebca
    //https://api.openweathermap.org/data/2.5/forecast?id=5037649&appid=51f135d6aef7ba347cdd9f32a30bebca
    var APIKey = "51f135d6aef7ba347cdd9f32a30bebca";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // Putting objects to page
        var cityName = response.name;
        createButton(cityName);
        var currentDate = moment().format("M/DD/YYYY");
        var weatherIcon = response.weather[0].icon;
        var weatherIconDesc = response.weather[0].description;
        $("#searchedCity").text(cityName);
        $("#currentDate").text("("+currentDate+")");
        $("#todayWeatherIcon").html("<img src=http://openweathermap.org/img/wn/" + weatherIcon +".png style='height:70px;' title='" + weatherIconDesc + "'>");

        //calculating temp
        var tempK = response.main.temp;
        var tempF = (tempK - 273.15) * 1.80 + 32;
        var tempK = response.main.feels_like;
        var tempFeelF = (tempK - 273.15) * 1.80 + 32;

        //remaining values input below
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        
        $("#tempReturn").text("Tempurature: " + tempF.toFixed(1) + " °F");
        $("#tempFeelReturn").text("Feels Like: " + tempFeelF.toFixed(1) + " °F");
        $("#humidityReturn").text("Humidity: " + humidity + "%");
        $("#windspeedReturn").text("Wind Speed: " + windSpeed + " MPH");
        
        //secondary ajax call to get forcast cards
        var inputCityID = response.id;
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + inputCityID + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            
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

                var currentDate = moment().add(i,'day').format("M/DD/YYYY");
                var weatherIcon = response.list[j].weather[0].icon;
                var weatherIconDesc = response.list[j].weather[0].description;
                var tempK = response.list[j].main.temp;
                var tempF = (tempK - 273.15) * 1.80 + 32;
                var humidity = response.list[j].main.humidity;
                
                //assigning values to specific cards
                $("#date" + [i]).text(currentDate);
                $("#date" + [i] + "Icon").html("<img src=http://openweathermap.org/img/wn/" + weatherIcon +".png style='height:45px;' title='" + weatherIconDesc + "'>");
                $("#tempReturn" + [i]).text("Tempurature: " + tempF.toFixed(1) + " °F");
                $("#humidityReturn" + [i]).text("Humidity: " + humidity + "%");
                

            }
        });

    });
}

function addCitytoObject() {


}

function createButton() {
    
    
}



$("#searchCity").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the artist name
    var inputCity = $("#cityRequest").val().trim();

    // Running the searchBandsInTown function(passing in the artist as an argument)
    searchCityWeather(inputCity);
    

});