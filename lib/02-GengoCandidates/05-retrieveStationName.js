const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');

const {
  delay,
  is2Letters,
  flatten,
  progress
} = require('./utils');

const regexpSuffixBrackets = /\s?\(.*?\)$/;
const removeSuffixBrackets = item => item.replace(regexpSuffixBrackets, '');
const regexpStationSuffix = /(駅|停留所|停留場)$/;
const isStationName = item => item && regexpStationSuffix.test(item);
const removeStationSuffix = item => item.replace(regexpStationSuffix, '');

const retrieve = page => {
  const { $ } = page;
  return Array.from($('#mw-content-text > ul > li > a:link'))
    .map(link => $(link).attr('title').trim())
    .map(name => removeSuffixBrackets(name))
    .filter(isStationName)
    .map(name => removeStationSuffix(name))
    .filter(is2Letters);
};

const retrieveUrlList = () => {
  const hostname = 'https://ja.wikipedia.org';
  const indexPageName = '日本の鉄道駅一覧';
  const indexPagePath = `/wiki/Category:${encodeURIComponent(indexPageName)}`;
  const indexPageUrl = hostname + indexPagePath;
  return client.fetch(indexPageUrl)
    .then(page => {
      const { $ } = page;
      return Array.from($(`#mw-pages a:link[title^="${indexPageName} "]`))
        .map(link => $(link).url());
    });
};

const main = async () => {
  const stations = [];
  const urls = await retrieveUrlList();
  const indicator = progress(urls.length);
  for (let i = 0, l = urls.length; i < l; i++) {
    const result = retrieve(await client.fetch(urls[i]));
    indicator.update((i + 1) / l);
    if (i + 1 !== l) { await delay(1); }
    stations.push(result);
  }
  return flatten(stations);
};

main()
  .then(stationNameArray => {
    const outputDirPath = '../../raw/02-GengoCandidates';
    const outputFileName = '05-StationName.json';
    fs.writeFileSync(
      path.resolve(__dirname, outputDirPath, outputFileName),
      JSON.stringify(flatten(stationNameArray), null, 2)
    );
  })
  .catch(reason => console.error(reason));
