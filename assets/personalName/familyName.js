const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const zeroPad = (num, l) => (Array(l).join('0')+num).slice(-l);
const delayFetch = (url, delay = 1) => new Promise(resolve => {
  setTimeout(() => {
    console.log(`get: ${url}`);
    resolve(client.fetch(url));
  }, delay * 1000);
});


const promises = [];
for (let i=1; i<100; i++) {
  promises.push(
    delayFetch(`http://www.douseidoumei.net/00/sei${zeroPad(i,2)}.html`, i)
  );
}
promises.push(
  delayFetch('http://www.douseidoumei.net/00/sei100.html', 100)
);

Promise.all(promises)
  .then(
    results => results.map(result => {
      const { $ } = result;
      return $('#main table.ta1 tr:has(td)')
        .map((_, tr) => $(tr).find('td:nth-child(2)').text().trim())
        .filter((_, name) => name.length === 2)
        .toArray()
    }),
    reason => console.log(reason)
  )
  .then(rets => {
    console.log('-----');
    console.log(
      `familyNameList: ${rets.reduce((s, rs) => s + rs.length, 0)} terms`);

    fs.writeFileSync(
      path.resolve(__dirname, 'familyNameList.txt'),
      rets.map(rs => rs.join(',')).join('\n')
    );

    fs.writeFileSync(
      path.resolve(__dirname, 'familyNameList.flat.txt'),
      rets.map(rs => rs.join(',')).join(',')
    );
  });
