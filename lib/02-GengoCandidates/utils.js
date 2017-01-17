const delay = sec => new Promise(d => setTimeout(() => d(), sec * 1000));
const is2Letters = item => item.length === 2;
const compactUniqMap = items => (
  items.filter((item, i, self) => item && self.indexOf(item) === i));
const flatten = arrayList => arrayList.reduce((p,c) => p.concat(c));

module.exports = {
  delay,
  is2Letters,
  compactUniqMap,
  flatten
};
