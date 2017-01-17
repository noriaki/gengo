const delay = sec => new Promise(d => setTimeout(() => d(), sec * 1000));
const is2Letters = item => item.length === 2;
const compactUniqMap = items => (
  items.filter((item, i, self) => item && self.indexOf(item) === i));
const flatten = arrayList => arrayList.reduce((p,c) => p.concat(c), []);
const padding = (num, l, p) => (Array(l).join(p)+num).slice(-l);
const zeroPad = (num, l) => padding(num, l, '0');
const progress = () => {
  let isRunning = false;
  const fill = (ratio, width = 50) => (
    [
      new Array(Math.floor(ratio * width) + 1).join('\u2588'),
      new Array(Math.ceil((1.0 - ratio) * width) + 1).join('\u2591'),
      ` ${padding(parseInt(ratio * 100), 3, ' ')}/100 (%)`
    ].join('')
  );

  return {
    start() {
      if (!isRunning) {
        process.stdout.write(fill(0));
        isRunning = true;
      }
    },
    end() {
      if (isRunning) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        console.log(fill(1));
        isRunning = false;
      }
    },
    move(ratio) {
      if (isRunning) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(fill(ratio));
      }
    }
  };
};

module.exports = {
  delay,
  is2Letters,
  compactUniqMap,
  flatten,
  zeroPad,
  padding,
  progress
};
