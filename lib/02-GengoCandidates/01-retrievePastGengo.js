const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const {
  delay,
  is2Letters,
  compactUniqMap,
  flatten
} = require('./utils');

const extractGengo = str => {
  const m = str.match(/(.*?) \(.*?\)/);
  return m && m[1] ? m[1] : str;
};

const regexpAtoZ = /^[あ-ん台日清鄭]$/;
const isGengoListSection = title => regexpAtoZ.test(title);

const retrieve = result => {
  const { $ } = result;
  const gengoArray = Array.from(
    $('#mw-pages div.mw-category-group')
  ).map(
    group => {
      if (isGengoListSection($(group).find('h3').text().trim())) {
        return $(group).find('a:link').toArray()
          .map(l => $(l).attr('title'))
          .map(extractGengo)
          .filter(is2Letters);
      }
      return [];
    });
  return flatten(gengoArray);
};
const getNextPagePath = ret => {
  const nextPageAnchor = '次のページ';
  const { $ } = ret;
  const nextLink = $(`#mw-pages > a:link:contains("${nextPageAnchor}")`);
  if (nextLink.length > 0 && $(nextLink).first().text().trim() === nextPageAnchor) {
    return $(nextLink).first().attr('href');
  }
  return false;
};

const hostname = 'https://ja.wikipedia.org';
const countries = {
  '中国': 'cn', '日本': 'jp', 'ベトナム': 'vn', '台湾': 'tw', '朝鮮': 'kp'
};

const process = async country => {
  const pageName = encodeURIComponent(`${country}の元号`);
  const gengo = [];
  let nextPath = `/wiki/Category:${pageName}`;
  do {
    const page = await client.fetch(hostname + nextPath);
    gengo.push(retrieve(page));
    nextPath = getNextPagePath(page);
    if (nextPath) { await delay(1); }
  } while (nextPath);

  const outputDirPath = '../../raw/02-GengoCandidates';
  const outputFileName = `01-PastGengo-${countries[country]}.json`;
  fs.writeFileSync(
    path.resolve(__dirname, outputDirPath, outputFileName),
    JSON.stringify(compactUniqMap(flatten(gengo)), null, 2)
  );
};

const main = async () => {
  const countryNameArray = Object.keys(countries);
  for (let i = 0, l = countryNameArray.length; i < l; i++) {
    await process(countryNameArray[i]);
  }
};

module.exports = main;
