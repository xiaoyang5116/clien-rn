
import { 
  action,
} from "../constants";

import lo from 'lodash';
import * as DateTime from '../utils/DateTimeUtils';
import { newTarget } from './challenge/Target';

export default {
  namespace: 'ChallengeModel',

  state: {
  },

  effects: {

    *challenge({ payload }, { put }) {
      // 初始化战斗对象
      const myself = newTarget(lo.cloneDeep(payload.myself));
      const enemy = newTarget(lo.cloneDeep(payload.enemy));

      // 初始化技能
      myself.skills = [];
      for (let i = 0; i < myself.skillIds.length; i++) {
        const skillId = myself.skillIds[i];
        const skill = yield put.resolve(action('SkillModel/getSkill')({ skillId }));
        if (skill != undefined) {
          myself.skills.push(lo.cloneDeep(skill));
        }
      }

      enemy.skills = [];
      for (let i = 0; i < enemy.skillIds.length; i++) {
        const skillId = enemy.skillIds[i];
        const skill = yield put.resolve(action('SkillModel/getSkill')({ skillId }));
        if (skill != undefined) {
          enemy.skills.push(lo.cloneDeep(skill));
        }
      }

      // 初始化属性
      myself.attrs._hp = myself.attrs.hp;
      myself.userName = '<span style="color:#36b7b5">{0}</span>'.format(myself.userName);
      myself.prepare = false;

      enemy.attrs._hp = enemy.attrs.hp;
      enemy.userName = '<span style="color:#7a81ff">{0}</span>'.format(enemy.userName);
      enemy.prepare = false;

      const report = [];
      let now = DateTime.now();
      const startMillis = now;      

      let firstAttack = true; // 招一
      let attacker = (myself.attrs.speed > enemy.attrs.speed) ? myself : enemy;

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

        if (myself.attrs.hp <= 0 || enemy.attrs.hp <= 0) {
          if (myself.attrs.hp <= 0) report.push({ msg: '战斗结束, {0}被{1}击败!'.format(myself.userName, enemy.userName) });
          if (enemy.attrs.hp <= 0) report.push({ msg: '战斗结束, {0}击败了{1}!'.format(myself.userName, enemy.userName) });
          break;
        }

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
                validDamage = damage > defender.attrs.hp ? defender.attrs.hp : damage;
                defender.attrs.hp -= validDamage;

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
                attackerName: attacker.userName,
                defenderUid: defender.uid,
                defenderName: defender.userName,
                attackerHP: attacker.attrs.hp,
                defenderHP: defender.attrs.hp,
                attackerOrgHP: attacker.attrs._hp,
                defenderOrgHP: defender.attrs._hp,
                damage: validDamage,
                msg: msg 
              });

              if (defender.attrs.hp <= 0)
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
    registerReloadEvent({ dispatch }) {
      // EventListeners.register('reload', (msg) => {
      //   return dispatch({ 'type':  'reload'});
      // });
    },
  }
}
