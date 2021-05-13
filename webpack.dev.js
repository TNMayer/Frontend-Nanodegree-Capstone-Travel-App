const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {geoNamesUserName, weatherbitKey, pixabayKey} = require('./src/server/apiData.js');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: ['babel-polyfill', './src/client/app.js'],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'deployment'),
        environment: {
            // The environment supports arrow functions ('() => { ... }').
            arrowFunction: false,
            // The environment supports BigInt as literal (123n).
            bigIntLiteral: false,
            // The environment supports const and let for variable declarations.
            const: false,
            // The environment supports destructuring ('{ a, b } = obj').
            destructuring: false,
            // The environment supports an async import() function to import EcmaScript modules.
            dynamicImport: false,
            // The environment supports 'for of' iteration ('for (const x of array) { ... }').
            forOf: false,
            // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
            module: false,
          }
    },
    devServer: {
        setup: function (app, server) {
            const fetch = require('node-fetch');
            
            let appData = [];
            let dataElement = {};
            
            var bodyParser = require('body-parser');    
            app.use(bodyParser.json());

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

        },
        compress: true,
        port: 3330,
    },
    target: ['web', 'es5'],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                    "targets": {
                                    "browsers": [ "last 1 version", "ie >= 11" ]
                                    }
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ]
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                }
            },
            {
                test: /\.json$/,
                type: 'asset/resource',
                generator: {
                    filename: 'json/[name][ext]'
                }
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),
        // new MiniCssExtractPlugin(),
        // new WorkboxPlugin.GenerateSW()
    ],
    performance: {
        hints: false,
    }
}