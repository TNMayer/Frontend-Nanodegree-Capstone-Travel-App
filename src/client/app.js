import "isomorphic-fetch"

// styles
import './styles/resets.scss';
import './styles/base.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/tripCard.scss';
import '../../node_modules/pikaday/css/pikaday.css';

// images
import previewLogo from './images/preview_logo.svg';

// import from js modules
const {apiPosts, getAppData} = require('./js/apiHandling.js');
const {inputFormValidation} = require('./js/formValidation.js');
const {initializeTrips} = require('./js/tripCards.js');

// include Date Picker
const pikaday = require('pikaday');
const moment = require('moment');

//include images
let headerLogo = document.getElementById('previewLogo');
headerLogo.src = previewLogo;

getAppData()
    .then(function(data) {
        if (data.length > 0) {
            initializeTrips(data.slice(0, 5));
        } else {
            console.log("No images must be appended");
        }
    });

// form handling
let formSubmit = document.getElementById("inputForm_submit");
formSubmit.addEventListener("click", function(event) {
    event.preventDefault();
    let errorCounter = inputFormValidation();
    apiPosts(errorCounter);
});

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