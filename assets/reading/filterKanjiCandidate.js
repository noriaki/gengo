const fs = require('fs');
const path = require('path');
const { intersection } = require('set-manipulator');

const filteredKanjiArray = fs.readFileSync(
  path.resolve(__dirname, '../filteredKanjiList.txt'), 'utf8'
).trim().split(',');
const kanjiReadingMapAll = require('./kanjiReadingMapAll');
console.log(`filteredKanjiArray count: ${filteredKanjiArray.length}`);
console.log(`kanjiReadingMapAll count: ${Object.keys(kanjiReadingMapAll).length}`);

const kanjiReadingMapFiltered =
        intersection(filteredKanjiArray, Object.keys(kanjiReadingMapAll))
        .reduce((r, kanji) => {
          r[kanji] = kanjiReadingMapAll[kanji];
          return r;
        }, {});
console.log(`kanjiReadingMapFiltered count: ${Object.keys(kanjiReadingMapFiltered).length}`);

fs.writeFileSync(
  path.resolve(__dirname, 'kanjiReadingMapFiltered.json'),
  JSON.stringify(kanjiReadingMapFiltered)
);
