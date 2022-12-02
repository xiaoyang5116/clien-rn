
import lo from 'lodash';

// 指令转意
const EXPRESSIONS = [
    ['伤害',       "damage"],
    ['回血',       "hp"],
    ['回蓝',       "mp"],
    ['A_物理攻击',  "attacker.attrs.physicalAttack"],
    ['A_法术攻击',  "attacker.attrs.magicAttack"],
    ['A_物理防御',  "attacker.attrs.physicalDefense"],
    ['A_法术防御',  "attacker.attrs.magicDefense"],
    ['A_hp',  "attacker.attrs.hp"],

    ['D_物理攻击',  "defender.attrs.physicalAttack"],
    ['D_法术攻击',  "defender.attrs.magicAttack"],
    ['D_物理防御',  "defender.attrs.physicalDefense"],
    ['D_法术防御',  "defender.attrs.magicDefense"],
    ['D_hp',  "defender.attrs.hp"],
];

export function formula_expr(expr) {
    let str = expr;
    lo.forEach(EXPRESSIONS, (item) => {
        const [search, replacement] = item;
        str = lo.replace(str, new RegExp(search, 'g'), replacement);
    });
    return lo.replace(str, new RegExp(' ', 'g'), '');
}

