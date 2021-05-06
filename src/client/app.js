import "isomorphic-fetch"

// styles
import './styles/resets.scss';
import './styles/base.scss';
import './styles/footer.scss';
import './styles/header.scss';
import './styles/form.scss';
import '../../node_modules/pikaday/css/pikaday.css';

// images
import previewLogo from './images/preview_logo.svg';

//json ressources
import exampleData from './json/example.json';

// import from js modules
const {updateUI, updateUI_error, validSentence} = require('./js/updateUI.js');
const {postData} = require('./js/apiHandling.js');
const {inputFormValidation} = require('./js/formValidation.js');

// include Date Picker
const pikaday = require('pikaday');
const moment = require('moment');

//include images
let headerLogo = document.getElementById('previewLogo');
headerLogo.src = previewLogo;

// form handling
let formSubmit = document.getElementById("inputForm_submit");
formSubmit.addEventListener("click", function(event) {
    event.preventDefault();
    let errorCounter = inputFormValidation();
    console.log(exampleData);
    console.log(errorCounter);
    if (errorCounter.errorCounter === 0) {
        postData('/geocodingAPI', {content: errorCounter})
            .then(function(data) {
                const outData = {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    startDate: errorCounter.dateFrom.substring(5)
                };
                postData('/weatherAPI', {content: outData})
                    .then(function(data) {
                        console.log(data);
                    });
                console.log(outData);
            });
    }
})

//submit button handling
let submitButton = document.getElementById("sentimentFormSubmit");
if(submitButton) {
    submitButton.addEventListener("click", performSubmitAction);
}

function performSubmitAction(event) {
    event.preventDefault();
    let inputField = document.getElementById("sentimentSentence");
    inputField = inputField.value;
    
    if (!validSentence(inputField)) {
        console.log(inputField);
        console.log("Please enter a sentence");
        updateUI_error();
    } else {
        postData('/sentimentAPI', {content: inputField})
            .then(function(data) {
                updateUI(data);
            });
    }

}

//add the datepicker to input field
const picker_from = new pikaday({ 
    field: document.getElementById('date_from'),
    format: "YYYY-MM-DD",
    firstDay: 1,
    minDate: moment().toDate()
});
const picker_to = new pikaday({ 
    field: document.getElementById('date_to'),
    format: "YYYY-MM-DD",
    firstDay: 1,
    minDate: moment().toDate()
});