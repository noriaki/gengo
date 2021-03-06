const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const {
  delay,
  zeroPad,
  progress
} = require('./utils');

const mergeOne = (base, other = {}) => Object.keys(other).reduce((b, k) => {
  b[k] = b[k] != null ? b[k].concat(other[k]) : other[k];
  return b;
}, base);
const merge = (base, ...others) => others.reduce(mergeOne, base);

const retrieve = page => {
  const { $ } = page;
  const onyomiKanjiMap = {}; /* { "kanji1": ["onyomi1", "onyomi2"], ... } */
  const regexpOnyomi = /^[ア-ン]+$/;
  const yomi = $('#maininner .yomimenu td.yomimenutd01');
  $('#maininner .yomimenu td.yomimenutd02 a').map((i, kanji) => {
    const kanjiText = $(kanji).text().trim();
    const yomiText = $(yomi[i]).text().trim();
    if (regexpOnyomi.test(yomiText)) {
      mergeOne(onyomiKanjiMap, { [kanjiText]: [yomiText] });
    }
  });
  return onyomiKanjiMap;
};

const process = async () => {
  const onyomiKanjiMap = {}; /* { "kanji1": ["onyomi1", "onyomi2"], ... } */
  const urlBase = 'http://kanji.jitenon.jp/cat/yomi';
  const maxPageNo = 44;
  const indicator = progress(maxPageNo);
  for (let i = 1; i <= maxPageNo; i++) {
    const url = urlBase + zeroPad(i, 2);
    const result = retrieve(await client.fetch(url));
    indicator.update(i / maxPageNo);
    if (i !== maxPageNo) { await delay(1); }
    merge(onyomiKanjiMap, result);
  }
  return onyomiKanjiMap;
};

const main = async () => {
  const onyomiKanjiMap = await process();
  const outputDirPath = '../../raw/02-GengoCandidates';
  const outputFileName = '07-OnyomiKanji.json';
  fs.writeFileSync(
    path.resolve(__dirname, outputDirPath, outputFileName),
    JSON.stringify(onyomiKanjiMap, null, 2)
  );
};

module.exports = main;
