// https://ja.wikipedia.org/wiki/Category:%E6%97%A5%E6%9C%AC%E3%81%AE%E5%A4%A9%E7%9A%87
//  -> Open chrome developer tool (console) and Run (each page)

function normalizeEmperorName(name) {
  let ret = name;
  const m = name.match(/(.*?) \(.*?\)/);
  if (m && m[1]) { ret = m[1]; }
  const n = ret.match(/(.*?)天皇/);
  if (n && n[1]) { ret = n[1]; }
  if (ret.length === 2) { return ret; }
  return null;
}

const rets = [];
const regexpAtoZ = /[あ-ん]/;
const groups = document.querySelectorAll('#mw-pages div.mw-category-group');
for (let group of groups) {
  if (regexpAtoZ.test(group.querySelector('h3').innerText.trim())) {
    rets.push(Array.from(group.querySelectorAll('a:link'), link => (
      normalizeEmperorName(link.getAttribute('title'))
    )).filter((name, i, self) => name && self.indexOf(name) === i));
  }
}

console.log(rets.map(gs => gs.join(',')).join('\n'));
