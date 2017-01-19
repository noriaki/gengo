const fs = require('fs');
const path = require('path');

const { compactUniqMap, flatten } = require('./utils');

const main = () => {
  const rawDirPath = '../../raw/02-GengoCandidates';
  const pastGengoArray = ['jp', 'cn', 'vn', 'tw', 'kp']
          .map(country => `01-PastGengo-${country}.json`)
          .map(file => require(path.resolve(__dirname, rawDirPath, file)));

  fs.writeFileSync(
    path.resolve(__dirname, rawDirPath, '01-PastGengo.json'),
    JSON.stringify(compactUniqMap(flatten(pastGengoArray)), null, 2)
  );
};

module.exports = main;
