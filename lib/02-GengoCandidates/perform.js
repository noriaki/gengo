const fs = require('fs');
const path = require('path');
const { complement } = require('set-manipulator');

const { flatten } = require('./utils');
const generateGengoArray = kanjiArray => flatten(
  kanjiArray.map(k => kanjiArray.reduce((r, l) => {
    if (k !== l) { r.push(k + l); }
    return r;
  }, []))
);
const reverseItemFromArray = items => items.map(
  item => item.split('').reverse().join('')
);
const complementAll = (origin, ...sets) => sets.reduce(
  (base, other) => complement(origin, other), {}
);

// for debug
const writeTmpFileSync = (filename, data) => {
  const tmpDir = 'tmp';
  fs.writeFileSync(
    path.resolve(tmpDir, filename), JSON.stringify(data, null, 2)
  );
};
const writeDebugFiles = (no, before, after) => {
  writeTmpFileSync(`${no}-result.json`, after);
  writeTmpFileSync(`${no}-reject.json`, complement(before, after));
};

console.log('# Narrow Gengo candidates');
const kanjiArray = require(
  path.resolve('dist/KanjiCandidates.json'));
let processingGengoArray = generateGengoArray(kanjiArray);
let beforeProcessedGengoArray;
console.log('00. Initial Gengo candidates');
console.log(`    => [Gengo candidates count] ${processingGengoArray.length}`);

const rawDir = 'raw/02-GengoCandidates';

console.log('01. Exclude past Gengo (and reversed it) in {JP,CN,TW,VN,KP} ...');
beforeProcessedGengoArray = processingGengoArray;
const pastGengoArray = require(
  path.resolve(rawDir, '01-PastGengo.json'));
const pastGengoArrayReversed = reverseItemFromArray(pastGengoArray);
processingGengoArray = complementAll(
  processingGengoArray, pastGengoArray, pastGengoArrayReversed
);
writeDebugFiles('01', beforeProcessedGengoArray, processingGengoArray);
console.log(`    => [Gengo candidates count] ${processingGengoArray.length}`);

console.log('02. Exclude emperor name (and reversed it) in JP ...');
beforeProcessedGengoArray = processingGengoArray;
const emperorNameArray = require(
  path.resolve(rawDir, '02-EmperorName.json'));
const emperorNameArrayReversed = reverseItemFromArray(emperorNameArray);
processingGengoArray = complementAll(
  processingGengoArray, emperorNameArray, emperorNameArrayReversed
);
writeDebugFiles('02', beforeProcessedGengoArray, processingGengoArray);
console.log(`    => [Gengo candidates count] ${processingGengoArray.length}`);

console.log('03. Exclude common name (family nam/last name) in JP ...');
beforeProcessedGengoArray = processingGengoArray;
const personalNameArray = require(
  path.resolve(rawDir, '03-PersonalName.json'));
processingGengoArray = complementAll(
  processingGengoArray, personalNameArray
);
writeDebugFiles('03', beforeProcessedGengoArray, processingGengoArray);
console.log(`    => [Gengo candidates count] ${processingGengoArray.length}`);

console.log('04. Exclude city name in JP {pref,city,warn} ...');
beforeProcessedGengoArray = processingGengoArray;
const cityNameArray = require(
  path.resolve(rawDir, '04-CityName.json'));
processingGengoArray = complementAll(
  processingGengoArray, cityNameArray
);
writeDebugFiles('04', beforeProcessedGengoArray, processingGengoArray);
console.log(`    => [Gengo candidates count] ${processingGengoArray.length}`);

console.log('05. Exclude station name in JP ...');
beforeProcessedGengoArray = processingGengoArray;
const stationNameArray = require(
  path.resolve(rawDir, '05-StationName.json'));
processingGengoArray = complementAll(
  processingGengoArray, stationNameArray
);
writeDebugFiles('05', beforeProcessedGengoArray, processingGengoArray);
console.log(`    => [Gengo candidates count] ${processingGengoArray.length}`);

console.log('06. Exclude 2-letters idiom (and reversed it) ...');
beforeProcessedGengoArray = processingGengoArray;
const idiomArray = require(
  path.resolve(rawDir, '06-Idiom.json'));
const idiomArrayReversed = reverseItemFromArray(idiomArray);
processingGengoArray = complementAll(
  processingGengoArray, idiomArray, idiomArrayReversed
);
writeDebugFiles('06', beforeProcessedGengoArray, processingGengoArray);
console.log(`    => [Gengo candidates count] ${processingGengoArray.length}`);

const onyomiKanjiMap = require(
  path.resolve(rawDir, '07-OnyomiKanji.json'));

console.log('07. Exclude first letter On-Yomi starts with MTSH ...');
beforeProcessedGengoArray = processingGengoArray;
const regexpMTSH = /^[マミムメモタチツテトサシスセソハヒフヘホ]/;
const readingInitialMTSHArray =
        Object.keys(onyomiKanjiMap).reduce((r, kanji) => {
          if (onyomiKanjiMap[kanji].some(yomi => regexpMTSH.test(yomi))) {
            r.push(kanji);
          }
          return r;
        }, []);
processingGengoArray = processingGengoArray.filter(
  gengo => !readingInitialMTSHArray.includes(gengo[0])
);
writeDebugFiles('07', beforeProcessedGengoArray, processingGengoArray);
console.log(`    => [Gengo candidates count] ${processingGengoArray.length}`);

console.log('08. Exclude On-Yomi just two pronunciations ...');
beforeProcessedGengoArray = processingGengoArray;
const twoPronunciationsArray =
        Object.keys(onyomiKanjiMap).filter(kanji => (
          onyomiKanjiMap[kanji].some(reading => reading.length === 1)
        ));
processingGengoArray = complementAll(
  processingGengoArray, generateGengoArray(twoPronunciationsArray)
);
writeDebugFiles('08', beforeProcessedGengoArray, processingGengoArray);
console.log(`    => [Gengo candidates count] ${processingGengoArray.length}`);


console.log('09. Exclude On-Yomi same pronunciations continue ...');
beforeProcessedGengoArray = processingGengoArray;
processingGengoArray = processingGengoArray.filter(gengo => {
  const [yomiFirstTermArray, yomiLastTermArray]
          = gengo.split('').map(w => onyomiKanjiMap[w]);
  return !yomiFirstTermArray.some(
    yomiFirstTerm => yomiLastTermArray.some(
      yomiLastTerm => (
        yomiLastTerm.startsWith(yomiFirstTerm[yomiFirstTerm.length-1])
      )
    )
  );
});
writeDebugFiles('09', beforeProcessedGengoArray, processingGengoArray);
console.log(`    => [Gengo candidates count] ${processingGengoArray.length}`);

fs.writeFileSync(
  path.resolve(__dirname, '../../dist/GengoCandidates.json'),
  JSON.stringify(processingGengoArray, null, 2)
);
