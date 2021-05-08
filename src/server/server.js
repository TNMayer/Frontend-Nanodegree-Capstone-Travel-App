let appData = [];
let dataElement = {};

var path = require('path');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');
const fetch = require('node-fetch');
const {sentimentApiKey, geoNamesUserName, weatherbitKey, pixabayKey} = require('./apiData.js');
const port = 8000;
const moment = require('moment');

const app = express();

/* Dependencies */
const bodyParser = require('body-parser')
/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

app.use(express.static('./deployment'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('./deployment/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
})

// GET Routes
app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})


// POST Routes
const getSentimentApiData = async (inputData) => {

    const key = sentimentApiKey();
    console.log(key);
    let format = 'txt';
    const fetchUrl = `https://api.meaningcloud.com/sentiment-2.1?key=${key}&${format}=${inputData}&model=general&lang=en`
    console.log(fetchUrl);
    const sentimentResult = await fetch(fetchUrl);

    try {
        const sentimentData = await sentimentResult.json();
        return sentimentData;
    } catch(error) {
        console.log("Sentiment GET Error: ", error);
    }

};

app.post('/sentimentAPI', function(request, response) {
    let input = request.body.content;

    getSentimentApiData(input)
        .then(function(data) {
            let dataSubset = {
                agreement: data.agreement,
                subjectivity: data.subjectivity,
                confidence: data.confidence,
                irony: data.irony,
                inputSentence: input
            }
            console.log(dataSubset);
            response.send(dataSubset);
        });
});

const getGeocodingApiData = async (inputData) => {

    const username = geoNamesUserName();
    const location = encodeURI(inputData.location);
    const fetchUrl = `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${username}`;
    console.log(fetchUrl);
    
    dataElement.timestamp = Date.now();
    dataElement.location = inputData.location;
    dataElement.dateFrom = inputData.dateFrom;
    dataElement.dateTo = inputData.dateTo;
    
    const geonamesResult = await fetch(fetchUrl);

    try {
        const geonamesData = await geonamesResult.json();
        return geonamesData;
    } catch(error) {
        console.log("Geonames GET Error: ", error);
    }

};

app.post('/geocodingAPI', function(request, response) {
    let input = request.body.content;

    getGeocodingApiData(input)
        .then(function(data) {
            let dataSubset = {
                latitude: data.geonames[0].lat,
                longitude: data.geonames[0].lng
            };
            
            dataElement.latitude = dataSubset.latitude;
            dataElement.longitude = dataSubset.longitude;

            response.send(dataSubset);
        });
});

const getWeatherApiData = async (inputData) => {

    let key = weatherbitKey();
    const fetchUrl = `https://api.weatherbit.io/v2.0/normals?key=${key}&lat=${inputData.latitude}&lon=${inputData.longitude}&start_day=${inputData.startDate}&end_day=${inputData.startDate}`;
    console.log(fetchUrl);
    const weatherResult = await fetch(fetchUrl);

    try {
        const weatherData = await weatherResult.json();
        return weatherData;
    } catch(error) {
        console.log("Weatherbit GET Error: ", error);
    }

};

app.post('/weatherAPI', function(request, response) {
    let input = request.body.content;

    getWeatherApiData(input)
        .then(function(data) {
            let dataSubset = {
                min_temp: data.data[0].min_temp,
                max_temp: data.data[0].max_temp,
                temp: data.data[0].temp,
                precip: data.data[0].precip,
                max_wind_spd: data.data[0].max_wind_spd,
                min_wind_spd: data.data[0].min_wind_spd
            };
            
            dataElement.min_temp = dataSubset.min_temp;
            dataElement.max_temp = dataSubset.max_temp;
            dataElement.temp = dataSubset.temp;
            dataElement.precip = dataSubset.precip;
            dataElement.max_wind_spd = dataSubset.max_wind_spd;
            dataElement.min_wind_spd = dataSubset.min_wind_spd;

            appData.unshift(dataElement);
            dataElement = {};

            response.send(appData);
        });
});