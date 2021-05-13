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
    if ((url === "/sentimentAPI") || 
    (url === "/geocodingAPI") || 
    (url === "/weatherAPI") || 
    (url === "/imageAPI") || 
    (url === "/appData") ||
    (url === "/removeElement")) {
        return true;
    } else {
        try {
            new URL(url);
        } catch (error) {
            return false;
        }
        
        return true;
    }
};

const removeFromServer = function(id) {
    console.log(id);
    postData('/removeElement', {content: { id: id}});
    console.log("Element with ID: " + id + " removed from appData");
};

module.exports = {
    postData,
    checkUrl,
    removeFromServer
};