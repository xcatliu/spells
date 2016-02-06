/* eslint camelcase:0 */

import fs from 'fs';
import path from 'path';

import spell_types from './spell_types.json';
import effect_types from './effect_types.json';
import monsters from './monsters.json';
import zh_CN from './zh_CN.json';

const spellsFiles = fs.readdirSync(path.resolve(__dirname, 'spells'));

const spells = spellsFiles.map((fileName) => {
  return require(path.resolve(__dirname, 'spells', fileName));
});

export {
  spells,
  spell_types,
  effect_types,
  monsters,
  zh_CN,
};
