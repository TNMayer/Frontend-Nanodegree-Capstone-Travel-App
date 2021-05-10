//external js libraries
//================================================
// include Date Picker
const pikaday = require('pikaday');
const moment = require('moment');
//================================================

const createDatepicker = function(id = 'date_from') {
    new pikaday({ 
        field: document.getElementById(id),
        format: "YYYY-MM-DD",
        firstDay: 1,
        minDate: moment().toDate()
    });
};

module.exports = {
    createDatepicker
};