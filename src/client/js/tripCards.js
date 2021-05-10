//external js libraries
//================================================
// include leaflet for mapping functionality
// import L from 'leaflet';
const L = require('leaflet');
/* This code is needed to properly load the images in the Leaflet CSS */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
//================================================

const createTripCard = function(data) {
    
    id = "tripCard_" + data.id;
    let image;

    if (data.imageSrc !== "NULL") {
        image = `<img src="${data.imageSrc}" width="100%" \>`;
    } else {
        image = "No image retrieved for this location";
    }

    let today = Date.now();
    let dateFrom = Date.parse(data.dateFrom);
    let daysUntil = Math.ceil((dateFrom - today)/(1000*60*60*24));

    
    const tripCard = `
        <div id="${id}" class="tripCard">
            <div class="tripDetails">
                <div class="tripLocation">
                    Trip to: ${data.location}
                </div>
                <div>
                    <div style="font-weight: bold; margin-bottom: 5px;">
                        Planned Arrival Date: ${data.dateFrom}
                    </div>
                    <button data-id="${data.id}" type="button" class="removeButton">Remove Trip</button>
                </div>
                <div class="tripTimeaway">
                    Planned Trip to ${data.location} is ${daysUntil} days away
                </div>
                <div class="tripWeather">
                    Typical weather for planned arrivaldate:
                </div>
                <div class="weatherDetails">
                    High: ${data.max_temp} °C, Low: ${data.min_temp} °C <br/>
                    Precipitation: ${data.precip} mm
                </div>
            </div>
            <div class="tripPicture">
                ${image}
            </div>
            <div id="tripMap_${data.id}" class="tripMap">
            </div>
        </div>
    `;

    return tripCard;
};

const prependTrip = function(appData, maxElements = 5) {
    
    const savedTripsBox = document.getElementById("savedTrips");
    const firstChild = document.createElement("div");
    firstChild.innerHTML = createTripCard(appData[0]);

    // check if element already exists
    let checkId = "tripCard_" + appData[0].id;
    if (document.getElementById(checkId)) {
        console.log("Element already exists");
    } else {
        savedTripsBox.insertBefore(firstChild, savedTripsBox.firstChild);

        if (savedTripsBox.childElementCount > maxElements) {
            savedTripsBox.removeChild(savedTripsBox.lastChild);
        }

        createTripMap(appData[0]);
    }
};

const createTripMap = function(data) {
    //create trip map
    const mapId = 'tripMap_' + data.id;
    
    var tripMap = L.map(mapId).setView([Number(data.latitude), Number(data.longitude)], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(tripMap);
    var marker = L.marker([data.latitude, data.longitude]).addTo(tripMap);
    marker.bindPopup(`<span style="font-weight: bold;">${data.location}</span>`).openPopup();
}

const initializeTrips = function(appData) {

    const savedTripsBox = document.getElementById("savedTrips");

    for (const data of appData) {
        const element = document.createElement("div");
        element.innerHTML = createTripCard(data);
        savedTripsBox.appendChild(element);
        createTripMap(data);
    }
}

module.exports = {
    prependTrip,
    initializeTrips
};