const fs = require('fs');
const path = require('path');

const kanjiReadingMapFiltered = require('./kanjiReadingMapFiltered');
const regexpInitialMTSH = /^[マ-モタ-トサ-ソハ-ホ]/;

const kanjiReadingArrayInitialMTSH =
        Object.keys(kanjiReadingMapFiltered).reduce((r, kanji) => {
          if (kanjiReadingMapFiltered[kanji].some(yomi => (
            regexpInitialMTSH.test(yomi)))) { r.push(kanji); }
          return r;
        }, []);

console.log(`kanjiReadingArrayInitialMTSH: ${kanjiReadingArrayInitialMTSH.length}`);
fs.writeFileSync(
  path.resolve(__dirname, 'kanjiReadingArrayInitialMTSH.json'),
  JSON.stringify(kanjiReadingArrayInitialMTSH)
);
