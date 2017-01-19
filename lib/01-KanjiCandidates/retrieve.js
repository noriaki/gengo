const retrieveKokuji = require('./05-retrieveKokuji');
const retrieveNegativeTerms =require('./06-retrieveNegativeTerms');

Promise.all([retrieveKokuji(), retrieveNegativeTerms()]);
