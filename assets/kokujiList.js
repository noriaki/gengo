// http://kanji.jitenon.jp/cat/kokuji.html
//  -> Open developer tool (console) and Run

const trs = document.querySelectorAll('.kokujitb tr');
const ret = [];
for (let tr of trs) {
  const td = tr.querySelector('td:not([rowspan])');
  if (td != null) {
    const target = td.querySelector('a:link');
    if (target != null) {
      ret.push(target.innerText);
    } else {
      ret.push(tr.querySelector('td:not([rowspan]):nth-child(2) > a:link').innerText);
    }
  }
}
console.log(ret.join(','));
