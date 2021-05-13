# FEND Capstone Project: Travel App

This project is part of the Udacity Frontend Nanodegree. The page is build with webpack and heavily relies on Javascript with an Express server setup and an Frontend that is able to call three API´s:
* Geonames API (http://www.geonames.org/export/web-services.html)
* Weatherbit API (https://www.weatherbit.io/api)
* Pixabay API (https://pixabay.com/api/docs/)

## Project Setup

* In order to make the project running you need API keys for the aforementioned API´s.
* Enter your API keys in the api_data.js file (./src/server/apiData.js)
* Install all Dependencies of the project by running the command `npm install`
* Build a deployment version of the project by running the command `npm run build-prod`
* Run the Express server by the command `npm run start`
* Now you can access the project in your favorite browser via: http://localhost:8000.
* Alternatively you can also use the development version of the project. For that you need just to enter the command `npm run build-dev`.