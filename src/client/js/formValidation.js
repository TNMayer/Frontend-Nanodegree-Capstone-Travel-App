const inputFormValidation = function () {
    const tripLocation = document.getElementById("location").value;
    const dateFrom = document.getElementById("date_from").value;
    const dateTo = document.getElementById("date_to").value;

    let locationError = checkLocation(tripLocation);
    let dateToError = 0;
    let dateFromError = checkDate(dateFrom);
    let dateConfusionError = 0;
    let errorCounter = 0;

    if (Date.parse(dateFrom) >= Date.parse(dateTo)) {
        dateConfusionError += 1;
    }
    
    errorCounter += locationError;
    errorCounter += dateFromError;
    
    if (dateTo.length > 0) {
        dateToError = checkDate(dateTo)
        errorCounter += dateToError;
    }

    if ((dateToError + dateFromError) === 0) {
        errorCounter += dateConfusionError;
    }

    if(errorCounter > 0) {
        createErrorMessage(
            checkLocation(tripLocation),
            dateFromError,
            dateToError,
            dateConfusionError
        )
    } else {
        document.getElementById("errorBox").innerHTML = '';
    }
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
        const locationBox = document.getElementById("inputForm_location");
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
    if(dateConfusionError === 1) {
        const errorListItem=document.createElement('li');
        errorListItem.innerHTML="Your departuredate is earlier than your arrivaldate";
        errorList.appendChild(errorListItem);
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