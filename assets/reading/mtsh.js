const fs = require('fs');
const path = require('path');

const kanjiReadingMapAll = require('./kanjiReadingMapAll');
const regexpInitialMTSH = /^[マ-モタ-トサ-ソハ-ホ]/;

const kanjiReadingArrayInitialMTSH =
        Object.keys(kanjiReadingMapAll).reduce((r, kanji) => {
          if (kanjiReadingMapAll[kanji].some(yomi => (
            regexpInitialMTSH.test(yomi)))) { r.push(kanji); }
          return r;
        }, []);

console.log(`kanjiReadingArrayInitialMTSH: ${kanjiReadingArrayInitialMTSH.length}`);
fs.writeFileSync(
  path.resolve(__dirname, 'kanjiReadingArrayInitialMTSH.json'),
  JSON.stringify(kanjiReadingArrayInitialMTSH)
);
