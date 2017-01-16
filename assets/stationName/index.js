const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const delayFetch = (url, delay = 1) => new Promise(resolve => {
  setTimeout(() => {
    console.log(`get: ${url}`);
    resolve(client.fetch(url));
  }, delay * 1000);
});
const regexpSuffixBrackets = /\s?\(.*?\)$/;
const removeSuffixBrackets = item => item.replace(regexpSuffixBrackets, '');
const regexpStationSuffix = /(駅|停留所|停留場)$/;
const isStationName = item => item && regexpStationSuffix.test(item);
const removeStationSuffix = item => item.replace(regexpStationSuffix, '');
const is2Gram = item => item && item.length === 2;
const compactUniqMap = items => (
  items.filter((item, i, self) => item && self.indexOf(item) === i));

const hostname = 'https://ja.wikipedia.org';
const indexPath = '/wiki/Category:%E6%97%A5%E6%9C%AC%E3%81%AE%E9%89%84%E9%81%93%E9%A7%85%E4%B8%80%E8%A6%A7';
const indexPageUrl = hostname + indexPath;

client.fetch(indexPageUrl)
  .then(result => {
    const { $ } = result;
    return $('#mw-pages a:link[title^="日本の鉄道駅一覧 "]')
      .map((_, link) => $(link).attr('href')).toArray();
  })
  .then(paths => {
    const promises = [];
    for (let i=0,l=paths.length; i<l; i++) {
      promises.push(
        delayFetch(hostname + paths[i], i)
          .then(result => {
            const { $ } = result;
            return $('#mw-content-text > ul > li > a:link')
              .map((_, link) => $(link).attr('title').trim())
              .toArray();
          })
      );
    }
    return Promise.all(promises)
      .then(
        rets => {
          console.log('-----');
          const filteredStationList = rets.map(
            names => names
              .map(name => removeSuffixBrackets(name))
              .filter(isStationName)
              .map(name => removeStationSuffix(name))
              .filter(is2Gram)
          );
          console.log(
            'filteredStationList: ' +
              filteredStationList.reduce((s, rs) => s + rs.length, 0)
          );
          fs.writeFileSync(
            path.resolve(__dirname, 'filteredStationList.txt'),
            filteredStationList.map(rs => rs.join(',')).join('\n')
          );
          fs.writeFileSync(
            path.resolve(__dirname, 'filteredStationList.flat.txt'),
            filteredStationList.map(rs => rs.join(',')).join(',')
          );
        },
        reason => console.log(reason)
      );
  });
