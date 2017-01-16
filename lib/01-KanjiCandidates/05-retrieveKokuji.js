// resource: http://kanji.jitenon.jp/cat/kokuji.html
const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const main = () => client.fetch('http://kanji.jitenon.jp/cat/kokuji.html')
  .then(result => {
    const { $ } = result;
    const rets = $('.kokujitb tr').toArray().reduce((r, tr) => {
      const kanji = $(tr).find('td:not([rowspan]) a:link').first();
      if (kanji.length > 0) { r.push($(kanji).text().trim()); }
      return r;
    }, []);

    fs.writeFileSync(
      path.resolve(__dirname, '../../raw/05-exKokuji.json'),
      JSON.stringify(rets, null, 2)
    );
  })
  .catch(reason => console.error(reason));

module.exports = main;
