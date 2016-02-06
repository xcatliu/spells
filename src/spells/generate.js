/* eslint no-var:0, quotes:0, quote-props:0, no-use-before-define:0 */

var i;
var obj;
var fs = require('fs');
for (i = 0; i < 360; i++) {
  if (i === 0) continue;
  if (i === 60) continue;
  if (i === 120) continue;
  if (i === 180) continue;
  if (i === 240) continue;
  if (i === 300) continue;
  obj = {
    "hue": i,
    "color": 'hsl(' + i + ', 100%, 50%)',
    "name": "?",
    "icon": "fa-question",
    "description": "Balabala...",
    "type": 0,
    "cost": 999,
    "cooldown": 0,
    "effects": [],
  };
  fs.writeFileSync(stringify(i) + '.json', JSON.stringify(obj, null, 2) + '\n', 'utf-8');
}

function stringify(num) {
  if (num < 10) return '00' + num;
  if (num < 100) return '0' + num;
  return num;
}
