const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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
            
            var bodyParser = require('body-parser');    
            app.use(bodyParser.json());

            const getSentimentApiData = async (inputData) => {

                let key = "8fea75fbf1a4e6d2bb0404e8c79843b0";
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
                        };
                        console.log(dataSubset);
                        response.send(dataSubset);
                    });
            });

            const getGeocodingApiData = async (inputData) => {

                let username = "tnmayer";
                const fetchUrl = `http://api.geonames.org/searchJSON?q=${inputData.location}&maxRows=1&username=${username}`;
                console.log(fetchUrl);
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
                        console.log(dataSubset);
                        response.send(dataSubset);
                    });
            });

            // weatherbit: https://api.weatherbit.io/v2.0/normals?key=40ae74205aa54f87a9cb923a8ab80c34&lat=38.0&lon=-78.0&start_day=05-10&end_day=05-20
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