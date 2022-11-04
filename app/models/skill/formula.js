
import lo from 'lodash';

// 指令转意
const EXPRESSIONS = [
    ['伤害',       "damage"],
    ['A_物理攻击',  "attacker.attrs.physicalAttack"],
    ['A_法术攻击',  "attacker.attrs.magicAttack"],
    ['D_物理防御',  "defender.attrs.physicalDefense"],
    ['D_法术防御',  "defender.attrs.magicDefense"],
];

export function formula_expr(expr) {
    let str = expr;
    lo.forEach(EXPRESSIONS, (item) => {
        const [search, replacement] = item;
        str = lo.replace(str, new RegExp(search, 'g'), replacement);
    });
    return lo.replace(str, new RegExp(' ', 'g'), '');
}

