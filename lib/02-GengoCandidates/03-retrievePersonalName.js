const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const {
  delay,
  is2Letters,
  flatten,
  zeroPad,
  progress
} = require('./utils');

const retrieve = result => {
  const { $ } = result;
  const personalNameArray = Array.from($('#main table.ta1 tr:has(td)'))
          .map(group => $(group).find('td:nth-child(2)').text().trim())
          .filter(is2Letters);
  return flatten(personalNameArray);
};

const retrieveName = async (type) => {
  const baseUrl = 'http://www.douseidoumei.net/00';
  const [ maxPage, prefix ] =
          type === 'family' ? [142, '/sei'] : [203, '/mei'];
  const indexes = Array.from({ length: maxPage }, (_, i) => i + 1);
  const results = [];

  const indicator = progress(maxPage);
  for (let index of indexes) {
    const pageNo = index >= 100 ? index : zeroPad(index, 2);
    const url = `${baseUrl}${prefix}${pageNo}.html`;
    // console.log(`Getting: ${url}`);
    const ret = retrieve(await client.fetch(url));
    indicator.update(index / maxPage);
    if (index !== maxPage) { await delay(1); }
    results.push(ret);
  }
  return flatten(results);
};

const process = async () => {
  console.log('Retrieving common family-name:');
  const familyNameArray = await retrieveName('family');
  console.log('Retrieving common last-name:');
  const lastNameArray = await retrieveName('last');
  return [familyNameArray, lastNameArray];
};

const main = async () => {
  const personalNameArray = await process();
  const outputDirPath = '../../raw/02-GengoCandidates';
  const outputFileName = '03-PersonalName.json';
  fs.writeFileSync(
    path.resolve(__dirname, outputDirPath, outputFileName),
    JSON.stringify(flatten(personalNameArray), null, 2)
  );
};

module.exports = main;
