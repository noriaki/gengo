const fs = require('fs');
const path = require('path');

const combination = items => items.map(k => (
  items.map(l => k ===l ? null : k + l).filter(m => !!m)
));

const kanjiReadingMapFiltered = require('./kanjiReadingMapFiltered');

const wordsSameReadingArray = combination(
  Object.keys(kanjiReadingMapFiltered)
).map(
  words => words.filter(word => {
    const [yomiFirstTermArray, yomiLastTermArray]
            = word.split('').map(w => kanjiReadingMapFiltered[w]);
    return yomiFirstTermArray.some(
      yomiFirstTerm => yomiLastTermArray.some(
        yomiLastTerm => (
          yomiLastTerm.startsWith(yomiFirstTerm[yomiFirstTerm.length-1])
        )
      )
    );
  })
);
console.log(`wordsSameReadingArray count: ${wordsSameReadingArray.reduce((r, a) => r + a.length, 0)}`);

fs.writeFileSync(
  path.resolve(__dirname, 'wordsSameReadingArrayOfArray.json'),
  JSON.stringify(wordsSameReadingArray)
);
