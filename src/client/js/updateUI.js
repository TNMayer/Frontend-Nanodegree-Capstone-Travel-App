const {sum} = require('./apiHandling.js');

const updateUI_error = function () {
    const sentenceBox = document.getElementById("sentenceOutput");
    sentenceBox.innerHTML = `<span style='
            color: red; 
            font-weight: bold; 
            font-family: Arial, Helvetica, sans-serif;'>
                You have to enter a sentence!
        </span>`;
    const agreementBox = document.getElementById("sentenceAgreement");
    agreementBox.innerHTML = "";
    const subjectivityBox = document.getElementById("sentenceSubjectivity");
    subjectivityBox.innerHTML = "";
    const confidenceBox = document.getElementById("sentenceConfidence");
    confidenceBox.innerHTML = "";
    const ironyBox = document.getElementById("sentenceIrony");
    ironyBox.innerHTML = "";
}

const updateUI = function (data) {
    const sentenceBox = document.getElementById("sentenceOutput");
    sentenceBox.innerHTML = data.inputSentence;
    const agreementBox = document.getElementById("sentenceAgreement");
    agreementBox.innerHTML = data.agreement;
    const subjectivityBox = document.getElementById("sentenceSubjectivity");
    subjectivityBox.innerHTML = data.subjectivity;
    const confidenceBox = document.getElementById("sentenceConfidence");
    confidenceBox.innerHTML = data.confidence;
    const ironyBox = document.getElementById("sentenceIrony");
    ironyBox.innerHTML = data.irony;
}

//testfunction
const multiplication = function (a, b) {
    return a * b;
}

const validSentence = function (sentence)
{
    if (sentence.length == 0) {
        return false
    } else {
        return true
    }
} 

module.exports = {
    updateUI,
    updateUI_error,
    multiplication,
    validSentence
};