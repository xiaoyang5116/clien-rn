
import { 
  action,
} from "../constants";

import lo from 'lodash';
import * as DateTime from '../utils/DateTimeUtils';

/**
 * power: 体力
 * agile: 敏捷
 * speed: 速度
 * crit:  暴击%
 * defense: 防御
 * dodge: 闪避%
 */
class Skill {
  constructor(id, name, xuLiMillis, cdMillis) {
    this._id = id;
    this._name = name;
    this._xuLiMillis = xuLiMillis;
    this._cdMillis = cdMillis

    this._startXuLiMillis = 0;
    this._startCDMillis = 0;
    this._release = false; // 是否已经释放产生效果
  }

  getId() {
    return this._id;
  }

  getName() {
    return this._name;
  }

  isRelease() {
    return this._release;
  }

  setRelease(v) {
    this._release = v;
  }

  // 蓄力时间
  getXuLiMillis() {
    return this._xuLiMillis
  }

  startXuLi(now) {
    this._startXuLiMillis = now;
    this._startCDMillis = 0;
  }

  isXunLiCompleted(now) {
    if (this._startXuLiMillis <= 0)
      return false;
    return now >= (this._startXuLiMillis + this._xuLiMillis);
  }

  startCD(now) {
    this._startCDMillis = now;
  }

  isCDLimit(now) {
    if (this._startCDMillis <= 0)
      return false;
    return now <= (this._startCDMillis + this._cdMillis);
  }

  // CD时间
  getCDMillis() {
    return this._cdMillis;
  }

  // 计算伤害值
  calcDamage(attacker, defender) {
    let damage = ((attacker.power / 1000 + attacker.agile / 1000) - (defender.defense / 1000)) * 1000;

    let isCrit = false;
    if (lo.random(0, 100, false) <= attacker.crit) {
      damage *= 2;
      isCrit = true;
    }

    let isDodge = false;
    if (lo.random(0, 100, false) <= defender.dodge) {
      damage = 0;
      isDodge = true;
    }

    damage = Math.ceil(damage);
    return { damage, isCrit, isDodge };
  }
}

class PuTongGongJiSkill extends Skill {
  constructor() {
    super(1, '普通攻击', 200, 500);
  }
}

class FoShanWuYingJiaoSkill extends Skill {
  constructor() {
    super(2, '佛山无影脚', 500, 1000);
  }
}

class XiangLongShiBaZhangSkill extends Skill {
  constructor() {
    super(3, '降龙十八掌', 1000, 2000);
  }
}

const SKILLS_MAP = [
  { id: 1, func: PuTongGongJiSkill },
  { id: 2, func: FoShanWuYingJiaoSkill },
  { id: 3, func: XiangLongShiBaZhangSkill },
];

export default {
  namespace: 'ChallengeModel',

  state: {
  },

  effects: {

    *challenge({ payload }, { }) {
      const { myself, enemy } = payload;
      // 初始化技能
      myself.skills = [];
      myself.skillIds.forEach(e => {
        const sk = SKILLS_MAP.find(x => x.id == e);
        if (sk != undefined) {
          const skill = new sk.func();
          myself.skills.push(skill);
        }
      });

      enemy.skills = [];
      enemy.skillIds.forEach(e => {
        const sk = SKILLS_MAP.find(x => x.id == e);
        if (sk != undefined) {
          const skill = new sk.func();
          enemy.skills.push(skill);
        }
      });

      // 初始化属性
      myself.orgLife = myself.life;
      myself.userName = '<span style="color:#73fdff">{0}</span>'.format(myself.userName);
      myself.prepare = false;
      
      enemy.orgLife = enemy.life;
      enemy.userName = '<span style="color:#7a81ff">{0}</span>'.format(enemy.userName);
      enemy.prepare = false;

      const report = [];
      let now = DateTime.now();
      const startMillis = now;      

      let firstAttack = true; // 招一
      let attacker = (myself.speed > enemy.speed) ? myself : enemy;

      // 先手先准备
      if (!attacker.prepare) {
        attacker.skills.forEach(e => {
          e.startXuLi(now);
        });
        attacker.prepare = true;
      }

      // 所有技能
      const allSkills = [];
      myself.skills.forEach(e => allSkills.push({ owner: myself, skill: e }));
      enemy.skills.forEach(e => allSkills.push({ owner: enemy, skill: e }));

      while (true) {
        if (now > (startMillis + 60000 * 5))
          break;

        if (myself.life <= 0 || enemy.life <= 0)
          break;

        for (let k in allSkills) {
          const { owner, skill } = allSkills[k];
          const attacker = owner;
          const defender = (attacker.uid == myself.uid) ? enemy : myself;

          if (skill.isXunLiCompleted(now)) {
            // 释放技能
            if (!skill.isRelease()) {
              const { damage, isCrit, isDodge } = skill.calcDamage(attacker, defender);
              skill.startCD(now);
              skill.setRelease(true);

              // 打出第一招后，对家开始。
              if (firstAttack && !defender.prepare) {
                defender.skills.forEach(e => {
                  e.startXuLi(now);
                });
                defender.prepare = true;
                firstAttack = false;
              }

              const colorSkillName = (skill.getId() > 1) ? "<span style='color:#ff2600'>{0}</span>".format(skill.getName()) : skill.getName();

              let msg = '';
              let validDamage = 0;
              if (damage > 0) {
                validDamage = damage > defender.life ? defender.life : damage;
                defender.life -= validDamage;

                if (isCrit) {
                  msg = "{0}使用了{1}攻击了{2}并触发<span style='color:#ff40ff'>暴击</span>, 造成<span style='color:#ff2f92'>{3}</span>点伤害".format(attacker.userName, colorSkillName, defender.userName, validDamage);
                } else {
                  msg = "{0}使用了{1}攻击了{2}, 造成<span style='color:#ff2f92'>{3}</span>点伤害".format(attacker.userName, colorSkillName, defender.userName, validDamage);
                }
              } else if (isDodge) {
                msg = "{0}使用了{1}攻击{2}，但{2}成功<span style='color:#38d142'>闪避</span>".format(attacker.userName, colorSkillName, defender.userName);
              }

              report.push({
                attackerUid: attacker.uid,
                defenderUid: defender.uid,
                attackerLife: attacker.life,
                defenderLife: defender.life,
                attackerOrgLife: attacker.orgLife,
                defenderOrgLife: defender.orgLife,
                damage: validDamage,
                msg: msg 
              });

              if (defender.life <= 0)
                break;
            }
            if (!skill.isCDLimit(now)) {
              skill.setRelease(false);
              skill.startXuLi(now);
            }
          }
        }
        
        now++;
      }
      return report;
    },

  },
  
  reducers: {
    updateState(state, { payload }) {
      return { 
        ...state,
        ...payload
      };
    }
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ 'type':  'test'});
    },
  }
}
