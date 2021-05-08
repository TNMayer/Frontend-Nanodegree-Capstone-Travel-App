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
            <div class="tripPicture">
                ${image}
            </div>
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
        </div>
    `;

    return tripCard;
};

const prependTrip = function(appData, maxElements = 5) {
    
    const savedTripsBox = document.getElementById("savedTrips");
    const firstChild = document.createElement("div");
    firstChild.innerHTML = createTripCard(appData[0]);

    savedTripsBox.insertBefore(firstChild, savedTripsBox.firstChild);

    if (savedTripsBox.childElementCount > maxElements) {
        savedTripsBox.removeChild(savedTripsBox.lastChild);
    }
};

const initializeTrips = function(appData) {

    const savedTripsBox = document.getElementById("savedTrips");

    for (const data of appData) {
        const element = document.createElement("div");
        element.innerHTML = createTripCard(data);
        savedTripsBox.appendChild(element);
    }
}

module.exports = {
    prependTrip,
    initializeTrips
};