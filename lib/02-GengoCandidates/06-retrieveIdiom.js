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

const main = async () => {
  const idioms = [];
  const indicator = progress();
  indicator.start();
  const urlBase = 'https://sites.google.com/site/forkanji/home/column_';
  const pathSuffixes = 'akgsztdnhbmyrw'.split('');
  for (let i = 0, l = pathSuffixes.length; i < l; i++) {
    const url = urlBase + pathSuffixes[i];
    const result = retrieve(await client.fetch(url));
    indicator.move((i + 1) / l);
    if (i + 1 !== l) { await delay(1); }
    idioms.push(result);
  }
  indicator.end();
  return flatten(idioms);
};

main()
  .then(idiomArray => {
    const outputDirPath = '../../raw/02-GengoCandidates';
    const outputFileName = '06-Idiom.json';
    fs.writeFileSync(
      path.resolve(__dirname, outputDirPath, outputFileName),
      JSON.stringify(compactUniqMap(flatten(idiomArray)), null, 2)
    );
  })
  .catch(reason => console.error(reason));
