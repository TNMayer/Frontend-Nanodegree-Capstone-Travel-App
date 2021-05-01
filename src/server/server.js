let postData = [];

var path = require('path');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');
const fetch = require('node-fetch');
const {sentimentApiKey, geoNamesUserName, weatherbitKey, pixabayKey} = require('./apiData.js');
const port = 6000;

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

    let key = sentimentApiKey();
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
        })
});