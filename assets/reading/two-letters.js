const fs = require('fs');
const path = require('path');

const kanjiReadingMapFiltered = require('./kanjiReadingMapFiltered');

const kanjiTwoLettersArray =
        Object.keys(kanjiReadingMapFiltered).filter(kanji => (
          kanjiReadingMapFiltered[kanji].some(reading => reading.length === 1)
        ));
console.log(`kanjiTwoLettersArray count: ${kanjiTwoLettersArray.length}`);

const wordsTwoLettersArray = kanjiTwoLettersArray.map(k => (
  kanjiTwoLettersArray.map(l => k ===l ? null : k + l).filter(m => !!m)
));
console.log(`wordsTwoLettersArray count: ${wordsTwoLettersArray.reduce((r, a) => r + a.length, 0)}`);

fs.writeFileSync(
  path.resolve(__dirname, 'wordsTwoLettersArrayOfArray.json'),
  JSON.stringify(wordsTwoLettersArray)
);
