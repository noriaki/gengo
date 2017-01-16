const fs = require('fs');
const path = require('path');
const { intersection, complement } = require('set-manipulator');

const kanjiSource = require('../../raw/01-kanjiSource.json');
const kanjiLessThan10Stroke = require('../../raw/02-kanjiLessThan10Stroke.json');
const exKanjiExclusion = require('../../raw/03-exKanjiExclusion.json');
const exKokuji = require('../../raw/05-exKokuji.json');
const exNegativeTerms =require('../../raw/06-exNegativeTerms.json');

const complementAll = (...sets) => sets.reduce((b, o) => complement(b, o));

const baseKanji = intersection(kanjiSource, kanjiLessThan10Stroke);
const mergedKanji = complementAll(
  baseKanji, exKanjiExclusion, exKokuji, exNegativeTerms);

fs.writeFileSync(
  path.resolve(__dirname, '../../dist/kanjiCandidate.json'),
  JSON.stringify(mergedKanji, null, 2)
);
