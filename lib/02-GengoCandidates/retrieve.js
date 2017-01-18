const retrievePastGengo = require('./01-retrievePastGengo');
const retrieveEmperorName =require('./02-retrieveEmperorName');
const retrievePersonalName = require('./03-retrievePersonalName');
const retrieveStationName = require('./05-retrieveStationName');
const retrieveIdiom = require('./06-retrieveIdiom');
const retrieveOnyomiKanji = require('./07-retrieveOnyomiKanji');

(async () => {
  console.log('# Past Gengo');
  await retrievePastGengo();
  console.log('# Emperor Name');
  await retrieveEmperorName();
  console.log('# Personal Name');
  await retrievePersonalName();
  console.log('# Station Name');
  await retrieveStationName();
  console.log('# Idiom (2-letters)');
  await retrieveIdiom();
  console.log('# Kanji-Yomi mapping');
  await retrieveOnyomiKanji();
})();
