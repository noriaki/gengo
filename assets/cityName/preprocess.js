const fs = require('fs');
const path = require('path');

function openAndReadList(fileName, dirPath = __dirname) {
  return fs.readFileSync(
    path.resolve(dirPath, fileName), 'utf8').trim().split(',');
}

const reverseItemMap = items => (
  items.map(item => item.split('').reverse().join('')));
const compactUniqMap = items => (
  items.filter((item, i, self) => item && self.indexOf(item) === i));
const filter2GramMap = items => (
  items.filter(item => item && item.length === 2));

const prefList = openAndReadList('pref.csv');
console.log(`prefList: ${prefList.length}`);

const cityList = openAndReadList('city.csv');
console.log(`cityList: ${cityList.length}`);

const wardList = openAndReadList('ward.csv');
console.log(`wardList: ${wardList.length}`);
console.log('-----');

const preprocessPrefList = filter2GramMap(prefList);
console.log(`preprocessPrefList: ${preprocessPrefList.length}`);

const regexpCitySuffix = /[市区町村]$/;
const preprocessCityList =
        compactUniqMap(filter2GramMap(cityList.map(city => (
          city.replace(regexpCitySuffix, '')
        ))));
console.log(`preprocessCityList: ${preprocessCityList.length}`);
const preprocessWardList =
        compactUniqMap(filter2GramMap(wardList.map(ward => (
          ward.replace(regexpCitySuffix, '')
        ))));
console.log(`preprocessWardList: ${preprocessWardList.length}`);

fs.writeFileSync(
  path.resolve(__dirname, 'pref.flat.txt'),
  preprocessPrefList.join(',')
);
fs.writeFileSync(
  path.resolve(__dirname, 'city.flat.txt'),
  preprocessCityList.join(',')
);
fs.writeFileSync(
  path.resolve(__dirname, 'ward.flat.txt'),
  preprocessWardList.join(',')
);
