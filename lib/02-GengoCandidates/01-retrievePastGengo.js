const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const delay = sec => new Promise(d => setTimeout(() => d(), sec * 1000));

const extractGengo = str => {
  const m = str.match(/(.*?) \(.*?\)/);
  return m && m[1] ? m[1] : str;
};
const is2Letters = item => item.length === 2;

const regexpAtoZ = /^[あ-ん台日清鄭]$/;
const isGengoListSection = title => regexpAtoZ.test(title);

const compactUniqMap = items => (
  items.filter((item, i, self) => item && self.indexOf(item) === i));
const flatten = arrayList => arrayList.reduce((p,c) => p.concat(c));

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

Object.keys(countries).forEach(async country => {
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
});
