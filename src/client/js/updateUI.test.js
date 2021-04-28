const {validSentence} = require('./updateUI.js');

test('Check Sentence "" => false', () => {
    expect(validSentence("")).toBe(false);
});

test('Check Sentence "The trowsers are very good" => true', () => {
    expect(validSentence("The trowsers are very good")).toBe(true)
})