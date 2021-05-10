//external js libraries
//================================================
import "isomorphic-fetch"
//================================================

// styles
import './styles/resets.scss';
import './styles/base.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/tripCard.scss';
//external css
//================================================
import '../../node_modules/pikaday/css/pikaday.css';
import 'leaflet/dist/leaflet.css';
//================================================

// images
import previewLogo from './images/preview_logo.svg';

// import from js modules
const {apiPosts, getAppData} = require('./js/apiHandling.js');
const {inputFormValidation} = require('./js/formValidation.js');
const {initializeTrips} = require('./js/tripCards.js');
const {createDatepicker} = require('./js/datepicker.js');

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
createDatepicker('date_from');
createDatepicker('date_to');