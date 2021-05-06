const inputFormValidation = function () {
    const tripLocation = document.getElementById("location").value;
    const dateFrom = document.getElementById("date_from").value;
    const dateTo = document.getElementById("date_to").value;

    const locationBox = document.getElementById("inputForm_location");
    const dateFromBox = document.getElementById("inputForm_date_from");
    const dateToBox = document.getElementById("inputForm_date_to");

    let locationError = checkLocation(tripLocation);
    let dateToError = 0;
    let dateFromError = checkDate(dateFrom);
    let dateConfusionError = 0;
    let errorCounter = 0;

    if (Date.parse(dateFrom) > Date.parse(dateTo)) {
        dateConfusionError += 1;
    }
    
    errorCounter += locationError;
    errorCounter += dateFromError;

    if (locationError === 1) {
        if(!(locationBox.classList.contains("errorBorder"))) {
            locationBox.classList.add("errorBorder");
        }
    } else {
        if(locationBox.classList.contains("errorBorder")) {
            locationBox.classList.remove("errorBorder");
        }
    }

    if (dateFromError === 1) {
        if(!(dateFromBox.classList.contains("errorBorder"))) {
            dateFromBox.classList.add("errorBorder");
        }
    } else {
        if(dateFromBox.classList.contains("errorBorder")) {
            dateFromBox.classList.remove("errorBorder");
        }
    }
    
    if (dateTo.length > 0) {
        dateToError = checkDate(dateTo)
        errorCounter += dateToError;
    }

    if (dateToError === 1) {
        if(!(dateToBox.classList.contains("errorBorder"))) {
            dateToBox.classList.add("errorBorder");
        }
    } else {
        if(dateToBox.classList.contains("errorBorder")) {
            dateToBox.classList.remove("errorBorder");
        }
    }

    if ((dateToError + dateFromError) === 0) {
        errorCounter += dateConfusionError;
        if (dateConfusionError === 1) {
            if(!(dateFromBox.classList.contains("errorBorder"))) {
                dateFromBox.classList.add("errorBorder");
            }
            if(!(dateToBox.classList.contains("errorBorder"))) {
                dateToBox.classList.add("errorBorder");
            }
        } else {
            if(dateFromBox.classList.contains("errorBorder")) {
                dateFromBox.classList.remove("errorBorder");
            }
            if(dateToBox.classList.contains("errorBorder")) {
                dateToBox.classList.remove("errorBorder");
            }
        }
    }

    if(errorCounter > 0) {
        createErrorMessage(
            checkLocation(tripLocation),
            dateFromError,
            dateToError,
            dateConfusionError
        );
    } else {
        document.getElementById("errorBox").innerHTML = '';
    }

    return {
        errorCounter: errorCounter,
        location: tripLocation,
        dateFrom: dateFrom,
        dateTo: dateTo
    };
}

const checkLocation = function (location) {
    if (location.length == 0) {
        return 1;
    } else {
        return 0;
    }
}

const checkDate = function (date) {
    if (Date.parse(date)) {
        return 0;
    } else {
        return 1;
    }
}

const createErrorMessage = function (locationError = 0,
                                    dateFromError = 0,
                                    dateToError = 0,
                                    dateConfusionError = 0) {

    const errorBox = document.getElementById("errorBox");
    errorBox.innerHTML = '';
    const errorList=document.createElement('ul');

    if(locationError === 1) {
        const errorListItem=document.createElement('li');
        errorListItem.innerHTML="The location field is not specified";
        errorList.appendChild(errorListItem);
    }
    if(dateFromError === 1) {
        const errorListItem=document.createElement('li');
        errorListItem.innerHTML="Please check your input for the date from field";
        errorList.appendChild(errorListItem);
    }
    if(dateToError === 1) {
        const errorListItem=document.createElement('li');
        errorListItem.innerHTML="Please check your input for the date to field";
        errorList.appendChild(errorListItem);
    }

    if ((dateFromError + dateToError) === 0) {
        if(dateConfusionError === 1) {
            const errorListItem=document.createElement('li');
            errorListItem.innerHTML="Your departuredate is earlier than your arrivaldate";
            errorList.appendChild(errorListItem);
        }
    }
    
    const errorHeading = document.createElement("div");
    errorHeading.innerHTML = `<span style="font-weight: bold; color: red;">
        The following errors occured during form validation:
    </span>`;

    errorBox.appendChild(errorHeading);
    errorBox.appendChild(errorList);
}

module.exports = {
    inputFormValidation
};