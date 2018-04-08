const express = require('express')
const weatherApi = express()
const request = require('request');
const path = require('path');

//Load Initial Form

weatherApi.get('/locations/', function (req, res) {
  //res.sendfile("./weatherApi.html")
  res.sendFile(path.resolve('weatherApiFrontEnd.html'));
})

//The Get Request for API
weatherApi.get('/locations/:zip/', function (req, res) {
  var zipCode = req.params.zip;
  var scale = req.query.scale;


//to get Woeid
  var getWoeid = function(param){
    request(param, function (err, response, data) {
    if(err){
      console.log('error:',error);
      res.send('index', {zipCode: null, error: 'Error: Invalid Entry, please try again'});
    } else {
      var woeid = JSON.parse(data);
      woeid_parsed = woeid.query.results.place[0].woeid;
      getWeather(woeid_parsed,scale);
    }
  });
  }

  //To get Temperature from Woeid

  var getWeather = function(woeid_parsed,scale){
    var searchtext = "select item.condition from weather.forecast where woeid =" + woeid_parsed + " and u='"+scale+"'";
    var query2 = "https://query.yahooapis.com/v1/public/yql?q=" + searchtext + "&format=json";
      request(query2, function (err, response, data) {
      if(err){
        console.log('error:', error);
        res.send('index', {weather: null, error: 'Error, please try again'});
      } else {
        var weather = JSON.parse(data);
        if(scale == 'c')
          var scaleDisplay = 'Celsius';
        else {
            var scaleDisplay = 'Fahrenheit';
          }
        res.json({Temperature:weather.query.results.channel.item.condition.temp,Scale: scaleDisplay })
      }
    });
  }


    //Query to get Woeid
    var query1 = "https://query.yahooapis.com/v1/public/yql?q=SELECT woeid FROM geo.places WHERE text=" + zipCode + "&format=json";
    getWoeid(query1);

})



weatherApi.listen(8080, function () {
  console.log('The Weather API listening on port 8080');
    console.log('Go to http://localhost:8080/locations to open the weather API form');
})
