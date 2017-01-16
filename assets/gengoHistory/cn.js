// https://ja.wikipedia.org/w/index.php?title=Category:%E4%B8%AD%E5%9B%BD%E3%81%AE%E5%85%83%E5%8F%B7
//  -> Open chrome developer tool (console) and Run (each page)

function normalizeGengo(gengo) {
  let ret = gengo;
  const m = gengo.match(/(.*?) \(.*?\)/);
  if (m && m[1]) { ret = m[1]; }
  if (ret.length === 2) { return ret; }
  return null;
}

const rets = [];
const regexpAtoZ = /[あ-ん]/;
const groups = document.querySelectorAll('#mw-pages div.mw-category-group');
for (let group of groups) {
  if (regexpAtoZ.test(group.querySelector('h3').innerText.trim())) {
    rets.push(Array.from(group.querySelectorAll('a:link'), link => (
      normalizeGengo(link.getAttribute('title'))
    )).filter((gengo, i, self) => gengo && self.indexOf(gengo) === i));
  }
}

console.log(rets.map(gs => gs.join(',')).join('\n'));
