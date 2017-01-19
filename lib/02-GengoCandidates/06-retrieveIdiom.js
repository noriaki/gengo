const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const {
  delay,
  compactUniqMap,
  flatten,
  progress
} = require('./utils');

const retrieve = page => {
  const { $ } = page;
  const idiomArray = Array.from($('#sites-canvas-main table dd'))
          .map(dd => $(dd).text().trim().split('\u3000'));
  return flatten(idiomArray);
};

const process = async () => {
  const idioms = [];
  const urlBase = 'https://sites.google.com/site/forkanji/home/column_';
  const pathSuffixes = 'akgsztdnhbmyrw'.split('');
  const indicator = progress(pathSuffixes.length);
  for (let i = 0, l = pathSuffixes.length; i < l; i++) {
    const url = urlBase + pathSuffixes[i];
    const result = retrieve(await client.fetch(url));
    indicator.update((i + 1) / l);
    if (i + 1 !== l) { await delay(1); }
    idioms.push(result);
  }
  return flatten(idioms);
};

const main = async () => {
  const idiomArray = await process();
  const outputDirPath = '../../raw/02-GengoCandidates';
  const outputFileName = '06-Idiom.json';
  fs.writeFileSync(
    path.resolve(__dirname, outputDirPath, outputFileName),
    JSON.stringify(compactUniqMap(flatten(idiomArray)), null, 2)
  );
};

module.exports = main;
