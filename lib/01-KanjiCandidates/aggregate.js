const fs = require('fs');
const path = require('path');
const { intersection, complement } = require('set-manipulator');

const rawDir = 'raw/01-kanjiCandidates';
const kanjiSource = require(
  path.resolve(rawDir, '01-kanjiSource.json'));
const kanjiLessThan10Stroke = require(
  path.resolve(rawDir, '02-kanjiLessThan10Stroke.json'));
const exKanjiExclusion = require(path.resolve(
  rawDir, '03-exKanjiExclusion.json'));
const exKokuji = require(
  path.resolve(rawDir, '05-exKokuji.json'));
const exNegativeTerms = require(
  path.resolve(rawDir, '06-exNegativeTerms.json'));

const complementAll = (...sets) => sets.reduce((b, o) => complement(b, o));

const baseKanji = intersection(kanjiSource, kanjiLessThan10Stroke);
const aggregatedKanji = complementAll(
  baseKanji, exKanjiExclusion, exKokuji, exNegativeTerms);

fs.writeFileSync(
  path.resolve(__dirname, '../../dist/kanjiCandidate.json'),
  JSON.stringify(aggregatedKanji, null, 2)
);
