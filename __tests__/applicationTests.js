require("regenerator-runtime/runtime");

const {checkUrl} = require('../src/client/js/apiHelpers.js');

test('Checks URL "https://www.google.de" to be true', () => {
    expect(checkUrl("https://www.google.de")).toBe(true);
});

test('Checks URL "www.google.de" to be false', () => {
    expect(checkUrl("www.google.de")).toBe(false);
});