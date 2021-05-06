let postData = [];

var path = require('path');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');
const fetch = require('node-fetch');
const {sentimentApiKey, geoNamesUserName, weatherbitKey, pixabayKey} = require('./apiData.js');
const port = 8000;

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

    // let key = "8fea75fbf1a4e6d2bb0404e8c79843b0";
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

    let username = "tnmayer";
    const fetchUrl = `http://api.geonames.org/searchJSON?q=Bitburg&maxRows=1&username=${username}`;
    console.log(fetchUrl);
    const geonamesResult = await fetch(fetchUrl);

    try {
        const geonamesData = await geonamesResult.json();
        console.log(geonamesData);
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
            console.log(dataSubset);
            response.send(dataSubset);
        });
});