require("regenerator-runtime/runtime");
const {prependTrip} = require('./tripCards.js');

// post
const postData = async (url = "", data = {}) => {
    if (checkUrl(url)) {
        const response = await fetch(url, {
            method: 'POST', // GET, POST, PUT, DELETE, etc.
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        try {
            const newData = await response.json();
            return newData;
        } catch(error) {
            console.log("Error: ", error);
        }
    } else {
        console.log("ERROR: The URL you are trying to fetch is invalid");
    }
};

const checkUrl = function(url) {
    if ((url === "/sentimentAPI") || (url === "/geocodingAPI") || (url === "/weatherAPI") || (url === "/imageAPI") || (url === "/appData")) {
        return true;
    } else {
        try {
            new URL(url);
        } catch (error) {
            return false;
        }
        
        return true;
    }
}

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
    postData,
    checkUrl,
    apiPosts,
    getAppData
};