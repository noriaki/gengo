const fs = require('fs');
const path = require('path');

function openAndReadKanjiList(fileName, dirPath = __dirname) {
  return fs.readFileSync(
    path.resolve(dirPath, fileName), 'utf8').trim().split(',');
}

const filteredKanjiList = openAndReadKanjiList('filteredKanjiList.txt');
console.log(`filteredKanjiList: ${filteredKanjiList.length} chars`);
console.log('-----');


const termList = filteredKanjiList.map(k => (
  filteredKanjiList.map(l => k === l ? null : `${k}${l}`).filter(m => !!m)
  /* it's slow */
  // filteredKanjiList.reduce((r, l) => k === l ? r : [...r, `${k}${l}`], [])
));
console.log(`termList: ${termList.reduce((s, ts) => s + ts.length, 0)} terms`);

fs.writeFileSync(
  path.resolve(__dirname, 'termList.txt'),
  termList.map(ts => ts.join(',')).join('\n')
);

fs.writeFileSync(
  path.resolve(__dirname, 'termList.flat.txt'),
  termList.map(ts => ts.join(',')).join(',')
);
