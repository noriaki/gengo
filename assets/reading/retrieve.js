const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const delayFetch = (url, delay = 1) => new Promise(resolve => {
  setTimeout(() => {
    console.log(`get: ${url}`);
    resolve(client.fetch(url));
  }, delay * 1000);
});
const zeroPad = (num, l) => (Array(l).join('0')+num).slice(-l);
const compactUniqMap = items => (
  items.filter((item, i, self) => item && self.indexOf(item) === i));
const flatten = arrayList => arrayList.reduce((p,c) => p.concat(c));

const pageUrl = 'http://kanji.jitenon.jp/cat/yomi';
const regexpOnyomi = /^[ア-ン]+$/;

const promises = [];
for (let i=1; i<=44; i++) {
  promises.push(
    delayFetch(`${pageUrl}${zeroPad(i, 2)}.html`, i-1)
      .then(result => {
        const { $ } = result;
        const kanjiMap = {};
        const yomi = Array.from($('#maininner .yomimenu td.yomimenutd01'));
        $('#maininner .yomimenu td.yomimenutd02 a').map((j, kanji) => {
          const kanjiText = $(kanji).text().trim();
          const yomiText = $(yomi[j]).text().trim();
          if (regexpOnyomi.test(yomiText)) {
            if (kanjiMap[kanjiText]) {
              kanjiMap[kanjiText].push(yomiText);
            } else { kanjiMap[kanjiText] = [yomiText]; }
          }
        });
        return kanjiMap;
      })
  );
}

Promise.all(promises)
  .then(
    kanjiMapArray => {
      console.log('-----');
      const combinedKanjiMap = kanjiMapArray.reduce((k, kanjiMap) => {
        Object.keys(kanjiMap).forEach(kanji => {
          if (k[kanji]) {
            k[kanji] = k[kanji].concat(kanjiMap[kanji]);
          } else { k[kanji] = kanjiMap[kanji]; }
        });
        return k;
      }, {});
      Object.keys(combinedKanjiMap).forEach(kanji => {
        combinedKanjiMap[kanji] = compactUniqMap(combinedKanjiMap[kanji])
      });
      console.log(`combinedKanjiMap: ${Object.keys(combinedKanjiMap).length}`);
      fs.writeFileSync(
        path.resolve(__dirname, 'kanjiReadingMapAll.json'),
        JSON.stringify(combinedKanjiMap)
      );
    },
    reason => console.log(reason)
  );
