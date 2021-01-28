var currentDate = moment().format("dddd, MMMM Do");

$("button").on("click", function () {
var city = document.$(".cityRequest")[0].value;
console.log(city)
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&appid=51f135d6aef7ba347cdd9f32a30bebca";


$.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {
      var results = response.data;
      preventDefault()

    });
});