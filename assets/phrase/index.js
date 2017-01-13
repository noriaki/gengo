const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const delayFetch = (url, delay = 1) => new Promise(resolve => {
  setTimeout(() => {
    console.log(`get: ${url}`);
    resolve(client.fetch(url));
  }, delay * 1000);
});
const compactUniqMap = items => (
  items.filter((item, i, self) => item && self.indexOf(item) === i));
const flatten = arrayList => arrayList.reduce((p,c) => p.concat(c));

const pathSuffixes = 'akgsztdnhbmyrw'.split('');
const pageUrl = 'https://sites.google.com/site/forkanji/home/column_';

const promises = [];
for (let i=0,l=pathSuffixes.length; i<l; i++) {
  promises.push(
    delayFetch(pageUrl + pathSuffixes[i], i)
      .then(result => {
        const { $ } = result;
        return Array.from($('#sites-canvas-main table dd')
          .map((_, dd) => $(dd).text().trim().split('　')));
      })
  );
}

Promise.all(promises)
  .then(
    phraseListArray => {
      console.log('-----');
      const filteredPhraseList = compactUniqMap(flatten(phraseListArray));
      console.log(`filteredPhraseList: ${filteredPhraseList.length}`);
      fs.writeFileSync(
        path.resolve(__dirname, 'filteredPhraseList.flat.txt'),
        filteredPhraseList.join(',')
      );
    },
    reason => console.log(reason)
  );
