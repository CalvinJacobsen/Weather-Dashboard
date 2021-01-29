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
        var currentDate = moment().format("M/DD/YYYY");
        var weatherIcon = response.weather[0].icon;
        $("#searchedCity").text(cityName);
        $("#currentDate").text("("+currentDate+")");
        $("#todayWeatherIcon").html("<img src=http://openweathermap.org/img/wn/" + weatherIcon +".png>");

        //calculating temp
        var tempK = response.main.temp;
        var tempF = (tempK - 273.15) * 1.80 + 32;
        var tempK = response.main.feels_like;
        var tempFeelF = (tempK - 273.15) * 1.80 + 32;

        //remaining values input below
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        
        $("#tempReturn").text("Tempurature: " + tempF.toFixed(2) + " °F");
        $("#tempFeelReturn").text("Feels Like: " + tempFeelF.toFixed(2) + " °F");
        $("#humidityReturn").text("Humidity: " + humidity + "%");
        $("#windspeedReturn").text("Wind Speed: " + windSpeed + " MPH");
        
    });

    //get forcast cards

    searchCityForecast(inputCityID);
}

function searchCityForecast() {

}



$("#searchCity").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the artist name
    var inputCity = $("#cityRequest").val().trim();

    // Running the searchBandsInTown function(passing in the artist as an argument)
    searchCityWeather(inputCity);

});