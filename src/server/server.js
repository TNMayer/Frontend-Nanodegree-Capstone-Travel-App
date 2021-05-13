let appData = [];
let dataElement = {};

var path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const {geoNamesUserName, weatherbitKey, pixabayKey} = require('./api_data.js');
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
});

// test endpoint
app.get('/testendpoint', function(request, response) {
    response.json({
      status : 200
    });
});

const getGeocodingApiData = async (inputData) => {

    const username = geoNamesUserName();
    const location = encodeURI(inputData.location);
    const fetchUrl = `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${username}`;
    console.log(fetchUrl);
    
    dataElement.timestamp = new Date().toLocaleString();
    
    if (appData.length === 0) {
        dataElement.id = 1;
    } else {
        const maxId = Math.max.apply(Math, appData.map(function(o) { return o.id; }));
        dataElement.id = maxId + 1;
    }
    
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

app.post('/removeElement', function(request, response) {
    let inputId = request.body.content.id;
    appData = appData.filter(object => object.id != inputId);
    console.log("Removed object with ID: " + inputId);
});

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

            response.send(dataElement);
        });
});

const getImageApiData = async (inputData) => {

    let key = pixabayKey();
    const location = encodeURI(inputData.location);
    const fetchUrl = `https://pixabay.com/api/?key=${key}&q=${location}&image_type=photo&total=1`;
    console.log(fetchUrl);
    const imageResult = await fetch(fetchUrl);

    try {
        const imageData = await imageResult.json();
        return imageData;
    } catch(error) {
        console.log("Pixaby API GET Error: ", error);
    }

};

app.post('/imageAPI', function(request, response) {
    let input = request.body.content;

    getImageApiData(input)
        .then(function(data) {
            let imageSrc = "";

            if (data.totalHits > 0) {
                imageSrc = data.hits[0].webformatURL
            } else {
                imageSrc = "NULL";
            }
            
            dataElement.imageSrc = imageSrc;

            if((appData.length === 0)) {
                appData.unshift(dataElement);
            } else {
                const previousElement = appData[0];
                if(
                    (previousElement.location !== dataElement.location) ||
                    (previousElement.dateFrom !== dataElement.dateFrom) ||
                    (previousElement.dateTo !== dataElement.dateTo)
                ) {
                    appData.unshift(dataElement);
                }
            }
            dataElement = {};

            response.send(appData[0]);
        });
});

// GET Routes
app.get('/appData', getAppData);

function getAppData(request, response) {
    response.send(appData);
}

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log('App server is running on port ' + port + '!');
});

module.exports = {
    app
};