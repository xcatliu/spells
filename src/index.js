/* eslint camelcase:0 */

import fs from 'fs';
import path from 'path';

import spell_types from './spell_types.json';
import effect_types from './effect_types.json';
import monsters from './monsters.json';
import zh_CN from './zh_CN.json';

const spellsFiles = fs.readdirSync(path.resolve(__dirname, 'spells'));

const spells = spellsFiles.map((fileName) => {
  const spell = require(path.resolve(__dirname, 'spells', fileName));
  const basename = path.basename(fileName, '.json');
  spell.spell_json = '/spells/' + basename + '.json';
  spell.spell_html = '/spells/' + basename + '.html';
  return spell;
});

export {
  spells,
  spell_types,
  effect_types,
  monsters,
  zh_CN,
};
