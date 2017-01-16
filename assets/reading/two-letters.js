const fs = require('fs');
const path = require('path');

const combination = items => items.map(k => (
  items.map(l => k ===l ? null : k + l).filter(m => !!m)
));

const kanjiReadingMapFiltered = require('./kanjiReadingMapFiltered');

const kanjiTwoLettersArray =
        Object.keys(kanjiReadingMapFiltered).filter(kanji => (
          kanjiReadingMapFiltered[kanji].some(reading => reading.length === 1)
        ));
console.log(`kanjiTwoLettersArray count: ${kanjiTwoLettersArray.length}`);

const wordsTwoLettersArray = combination(kanjiTwoLettersArray);
console.log(`wordsTwoLettersArray count: ${wordsTwoLettersArray.reduce((r, a) => r + a.length, 0)}`);

fs.writeFileSync(
  path.resolve(__dirname, 'wordsTwoLettersArrayOfArray.json'),
  JSON.stringify(wordsTwoLettersArray)
);
