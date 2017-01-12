const fs = require('fs');
const path = require('path');

function openAndReadKanjiList(fileName, dirPath = __dirname) {
  return fs.readFileSync(
    path.resolve(dirPath, fileName), 'utf8').trim().split(',');
}

const reverseMap =
        terms => terms.map(term => term.split('').reverse().join(''));

const termList = openAndReadKanjiList('../termList.flat.txt');
console.log(`termList: ${termList.length} terms`);
console.log('-----');

const jpList = openAndReadKanjiList('jp.flat.txt');
const jpListReverseMap = reverseMap(jpList);
console.log(`jpList: ${jpList.length} terms`);

const cnList = openAndReadKanjiList('cn.flat.txt');
const cnListReverseMap = reverseMap(cnList);
console.log(`cnList: ${cnList.length} terms`);

const twList = openAndReadKanjiList('tw.flat.txt');
const twListReverseMap = reverseMap(twList);
console.log(`twList: ${twList.length} terms`);

const vnList = openAndReadKanjiList('vn.flat.txt');
const vnListReverseMap = reverseMap(vnList);
console.log(`vnList: ${vnList.length} terms`);

const kpList = openAndReadKanjiList('kp.flat.txt');
const kpListReverseMap = reverseMap(kpList);
console.log(`kpList: ${kpList.length} terms`);

const excludedTermList = [];
const filteredTermList = termList.filter(term => {
  const isDup = (
    !jpList.includes(term) && !jpListReverseMap.includes(term) &&
      !cnList.includes(term) && !cnListReverseMap.includes(term) &&
      !twList.includes(term) && !twListReverseMap.includes(term) &&
      !vnList.includes(term) && !vnListReverseMap.includes(term) &&
      !kpList.includes(term) && !kpListReverseMap.includes(term));
  if (!isDup) { excludedTermList.push(term); }
  return isDup;
});
console.log('-----');
console.log(`filteredTermList: ${filteredTermList.length} terms`);

fs.writeFileSync(
  path.resolve(__dirname, 'filteredTermList.txt'),
  filteredTermList.join(',')
);
fs.writeFileSync(
  path.resolve(__dirname, 'excludedTermList.txt'),
  excludedTermList.join(',')
);
