// source: https://raw.githubusercontent.com/guai3/ExpectGengo/f077d44c40a9404fadb689ebef732454d8097d35/GengoKanjiSet.csv
const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const host = 'https://raw.githubusercontent.com';
const repo = 'guai3/ExpectGengo';
const commit = 'f077d44c40a9404fadb689ebef732454d8097d35';
const file = 'GengoKanjiSet.csv';

const main = () => client.fetch([host, repo, commit, file].join('/'))
  .then(result => {
    const { body } = result;
    const rets = body.split('\n')
      .filter(row => row.split(',')[1] === '0')
      .map(letters => letters.split(',')[0]);

    fs.writeFileSync(
      path.resolve(__dirname, '../../raw/01-KanjiCandidates/06-exNegativeTerms.json'),
      JSON.stringify(rets, null, 2)
    );
  })
  .catch(reason => console.error(reason));

module.exports = main;
