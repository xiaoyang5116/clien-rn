
import lo from 'lodash';

// 指令转意
const ATTRIBUTE_MAP = [
    ['伤害',    'damage'],
    ['体力',    'hp'],
    ['法力',    'mp'],
    ['速度',    'speed'],
    ['攻击',    'attack'],
    ['防御',    'defense'],
    ['物理攻击', 'physicalAttack'],
    ['法术攻击', 'magicAttack'],
    ['物理防御', 'physicalDefense'],
    ['法术防御', 'magicDefense'],
];

// 查找英文属性对应的中文名称
export function getAttributeChineseName(enName) {
    const found = lo.find(ATTRIBUTE_MAP, (e) => lo.isEqual(e[1], enName));
    return (found != undefined) ? found[0] : undefined;
}

// 查找中文属性对应的英文名称
export function getAttributeEnglishName(cnName) {
    const found = lo.find(ATTRIBUTE_MAP_2, (e) => lo.isEqual(e[0], cnName));
    return (found != undefined) ? found[1] : undefined;
}

const ATTRIBUTE_MAP_2 = [
    ['伤害',    'damage'],
    ['体力',    'hp'],
    ['法力',    'mp'],
    ['速度',    'speed'],
    ['攻击',    'attack'],
    ['防御',    'defense'],
    ['物理攻击', 'physicalAttack'],
    ['法术攻击', 'magicAttack'],
    ['物理防御', 'physicalDefense'],
    ['法术防御', 'magicDefense'],
];

