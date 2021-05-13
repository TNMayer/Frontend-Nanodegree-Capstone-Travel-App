require("regenerator-runtime/runtime");
const {postData} = require("./apiHelpers.js");
const {prependTrip} = require('./tripCards.js');

const apiPosts = function(errorCounter) {
    if (errorCounter.errorCounter === 0) {
        postData('/geocodingAPI', {content: errorCounter})
            .then(function(data) {
                const passData = {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    startDate: errorCounter.dateFrom.substring(5)
                };
                // console.log(outData);
                const outData2 = postData('/weatherAPI', {content: passData})
                    .then(function(data) {
                        return data;
                    });
                
                return outData2;
            })
            .then(function(data) {
                postData('/imageAPI', {content: data})
                    .then(function() {
                        const appData = getAppData();
                        return appData;
                    })
                    .then(function(data) {
                        prependTrip(appData = data);
                    });
            });
    }
};

// GET Routes Handling
const getAppData = async() => {
    const request = await fetch('/appData');

    try {
        const appData = await request.json();

        return appData;
    } catch(error) {
        console.log("GET Error: ", error);
    }
};

module.exports = {
    getAppData,
    apiPosts
};