const fs = require('fs');
const path = require('path');

const { is2Letters, compactUniqMap, flatten } = require('./utils');

const main = () => {
  const regexpCitySuffix = /[市区町村]$/;

  const rawDirPath = '../../raw/02-GengoCandidates';
  const cityNameArray = ['pref', 'city', 'ward']
          .map(type => `04-CityName-${type}.json`)
          .map(file => (
            require(path.resolve(__dirname, rawDirPath, file))
              .map(name => name.replace(regexpCitySuffix, ''))
              .filter(is2Letters)
          ));

  fs.writeFileSync(
    path.resolve(__dirname, rawDirPath, '04-CityName.json'),
    JSON.stringify(compactUniqMap(flatten(cityNameArray)), null, 2)
  );
};

module.exports = main;
