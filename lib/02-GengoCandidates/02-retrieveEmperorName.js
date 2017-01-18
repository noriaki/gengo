const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const {
  delay,
  is2Letters,
  compactUniqMap,
  flatten
} = require('./utils');

const extractEmperorName = str => {
  let name = str;
  const m = str.match(/(.*?) \(.*?\)/);
  if (m && m[1]) { name = m[1]; }
  const n = name.match(/(.*?)天皇/);
  return n && n[1] ? n[1] : name;
};

const regexpAtoZ = /^[あ-ん]$/;
const isEmperorNameListSection = title => regexpAtoZ.test(title);

const retrieve = result => {
  const { $ } = result;
  const emperorNameArray = Array.from(
    $('#mw-pages div.mw-category-group')
  ).map(
    group => {
      if (isEmperorNameListSection($(group).find('h3').text().trim())) {
        return $(group).find('a:link').toArray()
          .map(l => $(l).attr('title'))
          .map(extractEmperorName)
          .filter(is2Letters);
      }
      return [];
    });
  return flatten(emperorNameArray);
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
const countries = { '日本': 'jp' };

const process = async country => {
  const pageName = encodeURIComponent(`${country}の天皇`);
  const emperorName = [];
  let nextPath = `/wiki/Category:${pageName}`;
  do {
    const page = await client.fetch(hostname + nextPath);
    emperorName.push(retrieve(page));
    nextPath = getNextPagePath(page);
    if (nextPath) { await delay(1); }
  } while (nextPath);

  const outputDirPath = '../../raw/02-GengoCandidates';
  const outputFileName = `02-EmperorName-${countries[country]}.json`;
  fs.writeFileSync(
    path.resolve(__dirname, outputDirPath, outputFileName),
    JSON.stringify(compactUniqMap(flatten(emperorName)), null, 2)
  );
};

const main = async () => {
  const countryNameArray = Object.keys(countries);
  for (let i = 0, l = countryNameArray.length; i < l; i++) {
    await process(countryNameArray[i]);
  }
};

module.exports = main;
