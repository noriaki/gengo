const fs = require('fs');
const path = require('path');

function openAndReadKanjiList(fileName, dirPath = __dirname) {
  return fs.readFileSync(
    path.resolve(dirPath, fileName), 'utf8').trim().split(',');
}

const kanjiList = openAndReadKanjiList('kanjiList.txt');
console.log(`kanjiList: ${kanjiList.length} chars`);
console.log('-----');

const lt10StrokeCountKanjiList = openAndReadKanjiList('lt10StrokeCountKanjiList.txt');
console.log(`lt10StrokeCountKanjiList: ${lt10StrokeCountKanjiList.length} chars`);

const kanjiNumeralList = openAndReadKanjiList('kanjiNumeralList.txt');
console.log(`kanjiNumeralList: ${kanjiNumeralList.length} chars`);

const kokujiList = openAndReadKanjiList('kokujiList.txt');
console.log(`kokujiList: ${kokujiList.length} chars`);

const exclusionList = openAndReadKanjiList('exclusionList.txt');
console.log(`exclusionList: ${exclusionList.length} chars`);

const filteredKanjiList = kanjiList.filter(kanji => (
  lt10StrokeCountKanjiList.includes(kanji) &&
    !exclusionList.includes(kanji) &&
    !kokujiList.includes(kanji) &&
    !kanjiNumeralList.includes(kanji)
));
console.log('-----');
console.log(`filteredKanjiList: ${filteredKanjiList.length} chars`);

fs.writeFileSync(
  path.resolve(__dirname, 'filteredKanjiList.txt'),
  filteredKanjiList.join(',')
);
