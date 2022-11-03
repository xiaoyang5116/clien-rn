
import lo from 'lodash';

// 指令转意
const EXPR_REPLACEMENTS = [
    ['伤害',       "damage"],
    ['体力',       "hp"],
    ['法力',       "mp"],
    ['速度',       "speed"],
    ['A_物理攻击',  "attacker.physicalAttack"],
    ['A_法术攻击',  "attacker.magicAttack"],
    ['D_物理防御',  "defender.physicalDefense"],
    ['D_法术防御',  "defender.magicDefense"],
];

export function formula_expr(expr) {
    let str = expr;
    lo.forEach(EXPR_REPLACEMENTS, (item) => {
        const [search, replacement] = item;
        str = lo.replace(str, new RegExp(search, 'g'), replacement);
    });
    return str;
}

