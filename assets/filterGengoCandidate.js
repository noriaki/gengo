const fs = require('fs');
const path = require('path');
const { union, complement } = require('set-manipulator');

function openAndReadList(fileName, dirPath = __dirname) {
  return fs.readFileSync(
    path.resolve(dirPath, fileName), 'utf8').trim().split(',');
}

const compactUniqMap = items => (
  items.filter((item, i, self) => item && self.indexOf(item) === i));
const reverseItemMap =
        items => items.map(item => item.split('').reverse().join(''));
const unionAll = (...sets) => sets.reduce((a, b) => union(a, b));

const termList = openAndReadList('termList.flat.txt');
console.log(`Gengo candidate words. termList: ${termList.length} words`);
console.log('-----');

console.log(`* Word list used in the past for Gengo`);
console.log(`  and merge inverted one into list`);
const pastGengoListOriginal = compactUniqMap([].concat(
  openAndReadList('gengoHistory/jp.flat.txt'),
  openAndReadList('gengoHistory/cn.flat.txt'),
  openAndReadList('gengoHistory/tw.flat.txt'),
  openAndReadList('gengoHistory/vn.flat.txt'),
  openAndReadList('gengoHistory/kp.flat.txt')
));
const pastGengoListInverted = reverseItemMap(pastGengoListOriginal);
const pastGengoList = union(pastGengoListOriginal, pastGengoListInverted);
console.log(`   -> pastGengoList: ${pastGengoList.length} words`);

console.log(`* Name list that emperor who are in the past`);
console.log(`  and merge inverted one into list`);
const emperorNameListOriginal = compactUniqMap(
  openAndReadList('emperorName/jp.flat.txt')
);
const emperorNameListInverted = reverseItemMap(emperorNameListOriginal);
const emperorNameList = union(emperorNameListOriginal, emperorNameListInverted);
console.log(`   -> emperorNameList: ${emperorNameList.length} words`);

console.log(`* Top 10k personal name (family, last) list in Japan`);
const personalNameList = compactUniqMap([].concat(
  openAndReadList('personalName/familyNameList.flat.txt'),
  openAndReadList('personalName/lastNameList.flat.txt')
));
console.log(`   -> personalNameList: ${personalNameList.length} words`);

console.log(`* City name list in Japan.`);
const cityNameList = compactUniqMap([].concat(
  openAndReadList('cityName/pref.flat.txt'),
  openAndReadList('cityName/city.flat.txt'),
  openAndReadList('cityName/ward.flat.txt')
));
console.log(`   -> cityNameList: ${cityNameList.length} words`);

console.log(`* Station name list in Japan`);
const stationNameList = compactUniqMap(
  openAndReadList('stationName/filteredStationList.flat.txt')
);
console.log(`   -> stationNameList: ${stationNameList.length} words`);

console.log(`* Phrase (2 letters idiom) list`);
console.log(`  and merge inverted one into list`);
const phraseListOriginal = compactUniqMap(
  openAndReadList('phrase/filteredPhraseList.flat.txt')
);
const phraseListInverted = reverseItemMap(phraseListOriginal);
const phraseList = union(phraseListOriginal, phraseListInverted);
console.log(`   -> phraseList: ${phraseList.length} words`);

const exclusionList = unionAll(
  pastGengoList,
  emperorNameList,
  personalNameList,
  cityNameList,
  stationNameList,
  phraseList
);

console.log('-----');
const filteredGengoList = complement(termList, exclusionList);
console.log(` -> filteredGengoList: ${filteredGengoList.length} words`);

fs.writeFileSync(
  path.resolve(__dirname, 'filteredGengoList.txt'),
  filteredGengoList.join(',')
);
