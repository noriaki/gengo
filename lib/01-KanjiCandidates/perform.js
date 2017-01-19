const fs = require('fs');
const path = require('path');
const { intersection, complement } = require('set-manipulator');

console.log('# Narrow Kanji candidates');
const rawDir = 'raw/01-KanjiCandidates';

const kanjiSource = require(
  path.resolve(rawDir, '01-kanjiSource.json'));
console.log('01. Initial Kanji candidates');
console.log(`    => [Kanji candidates count] ${kanjiSource.length}`);

console.log('02. Select less than 10 strokes Kanji');
const kanjiLessThan10Stroke = require(
  path.resolve(rawDir, '02-kanjiLessThan10Stroke.json'));
let processingKanji = intersection(kanjiSource, kanjiLessThan10Stroke);
console.log(`    => [Kanji candidates count] ${processingKanji.length}`);

console.log('03. Exclude rejection Kanji list #1(Numeral)');
const exKanjiExclusionNumeral = require(path.resolve(
  rawDir, '03-exKanjiExclusion-Numeral.json'));
processingKanji = complement(processingKanji, exKanjiExclusionNumeral);
console.log(`    => [Kanji candidates count] ${processingKanji.length}`);

console.log('04. Exclude rejection Kanji list #2(Others)');
const exKanjiExclusionOthers = require(path.resolve(
  rawDir, '04-exKanjiExclusion-Others.json'));
processingKanji = complement(processingKanji, exKanjiExclusionOthers);
console.log(`    => [Kanji candidates count] ${processingKanji.length}`);

console.log('05. Exclude Kokuji');
const exKokuji = require(
  path.resolve(rawDir, '05-exKokuji.json'));
processingKanji = complement(processingKanji, exKokuji);
console.log(`    => [Kanji candidates count] ${processingKanji.length}`);

console.log('06. Exclude negative terms');
const exNegativeTerms = require(
  path.resolve(rawDir, '06-exNegativeTerms.json'));
processingKanji = complement(processingKanji, exNegativeTerms);
console.log(`    => [Kanji candidates count] ${processingKanji.length}`);

fs.writeFileSync(
  path.resolve(__dirname, '../../dist/KanjiCandidates.json'),
  JSON.stringify(processingKanji, null, 2)
);
