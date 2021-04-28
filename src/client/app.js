import "isomorphic-fetch"

// styles
import './styles/resets.scss';
import './styles/base.scss';
import './styles/footer.scss';
import './styles/form.scss';
import './styles/header.scss';
// images
import previewLogo from './images/preview_logo.svg';
// import from js modules
const {updateUI, updateUI_error, validSentence} = require('./js/updateUI.js');
const {postData} = require('./js/apiHandling.js');

//include images
let headerLogo = document.getElementById('previewLogo');
headerLogo.src = previewLogo;

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