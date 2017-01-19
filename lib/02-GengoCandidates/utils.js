const ProgressBar = require('ascii-progress');

const delay = sec => new Promise(d => setTimeout(() => d(), sec * 1000));
const is2Letters = item => item.length === 2;
const compactUniqMap = items => (
  items.filter((item, i, self) => item && self.indexOf(item) === i));
const flatten = arrayList => arrayList.reduce((p,c) => p.concat(c), []);
const padding = (num, l, p = ' ') => (
  (''+num).length >= l ? (''+num) : (p.repeat(l)+num).slice(-l)
);
const zeroPad = (num, l) => padding(num, l, '0');
const progress = (total) => new ProgressBar({ total });

module.exports = {
  delay,
  is2Letters,
  compactUniqMap,
  flatten,
  zeroPad,
  padding,
  progress
};
