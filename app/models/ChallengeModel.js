
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
      const { myself, enemy } = payload;

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
      myself.colorUserName = '<span style="color:#36b7b5">{0}</span>'.format(myself.userName);
      myself.prepare = false;

      enemy.colorUserName = '<span style="color:#7a81ff">{0}</span>'.format(enemy.userName);
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

      // 初始化
      let running = false;
      if (attacker.attrs.hp > 0) {
        report.push({ msg: `遇到了 ${enemy.colorUserName} 进入战斗` });
        running = true;
      }

      while (running) {
        if (now > (startMillis + 60000 * 5))
          break;

        if (myself.attrs.hp <= 0 || enemy.attrs.hp <= 0) {
          if (myself.attrs.hp <= 0) report.push({ msg: '战斗结束, {0} 被 {1} 击败!'.format(myself.colorUserName, enemy.colorUserName) });
          if (enemy.attrs.hp <= 0) report.push({ msg: '战斗结束, {0} 击败了 {1}!'.format(myself.colorUserName, enemy.colorUserName) });
          break;
        }

        for (let k in allSkills) {
          const { owner, skill } = allSkills[k];
          const attacker = owner;
          const defender = (attacker.uid == myself.uid) ? enemy : myself;

          if (skill.isXunLiCompleted(now)) {
            // 释放技能
            if (!skill.isRelease()) {
              const { damage, isPhysical, hp, mp, isCrit, isDodge } = skill.apply(attacker, defender);
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
              const consumeList = skill.getConsume();
              if (lo.isArray(consumeList)) {
                for (let i = 0; i < consumeList.length; i++) {
                  const item = consumeList[i];
                  if (item.mp != undefined && item.mp > 0) { // 扣除魔法
                    attacker.attrs.mp -= item.mp;
                    attacker.attrs.mp = (attacker.attrs.mp >= 0) ? attacker.attrs.mp : 0;
                  }
                }
              }

              let msg = '';
              let validDamage = 0;
              if (damage > 0) {
                validDamage = damage > defender.attrs.hp ? defender.attrs.hp : damage;
                defender.attrs.hp -= validDamage;

                if (isCrit) {
                  msg = "{0}使用了{1}攻击了{2}并触发<span style='color:#ff40ff'>暴击</span>, 造成<span style='color:#ff2f92'>{3}</span>点伤害".format(attacker.colorUserName, colorSkillName, defender.colorUserName, validDamage);
                } else {
                  msg = "{0}使用了{1}攻击了{2}, 造成<span style='color:#ff2f92'>{3}</span>点伤害".format(attacker.colorUserName, colorSkillName, defender.colorUserName, validDamage);
                }
              } else if (isDodge) {
                msg = "{0}使用了{1}攻击{2}，但{2}成功<span style='color:#38d142'>闪避</span>".format(attacker.colorUserName, colorSkillName, defender.colorUserName);
              }

              report.push({
                attackerUid: attacker.uid,
                attackerName: attacker.colorUserName,
                defenderUid: defender.uid,
                defenderName: defender.colorUserName,
                attackerHP: attacker.attrs.hp,
                defenderHP: defender.attrs.hp,
                attackerMP: attacker.attrs.mp,
                defenderMP: defender.attrs.mp,
                attackerOrgHP: attacker.attrs._hp,
                defenderOrgHP: defender.attrs._hp,
                attackerOrgMP: attacker.attrs._mp,
                defenderOrgMP: defender.attrs._mp,
                skills: [{ name: skill.getName() }],
                damage: validDamage,
                physicalDamage: (isPhysical ? validDamage : 0),
                magicDamage: (!isPhysical ? validDamage : 0),
                rechargeHP: hp, // 回血
                rechargeMP: mp, // 回蓝
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
      
      return yield put.resolve(action('mergeRoundData')({ report }));
    },

    // 合并同一个回合的多个技能及伤害
    *mergeRoundData({ payload }, { put }) {
      const { report } = payload;
      
      let attackerUid = 0;
      const mergeReport = [];

      lo.forEach(report, (e) => {
        if (e.attackerUid == undefined || e.defenderUid == undefined) {
          mergeReport.push(e);
          return
        }

        if (attackerUid != e.attackerUid) {
          attackerUid = e.attackerUid;
          mergeReport.push(e);
        } else {
          const prev = lo.last(mergeReport);
          prev.damage += e.damage;
          prev.physicalDamage += e.physicalDamage;
          prev.magicDamage += e.magicDamage;
          prev.skills.push(...e.skills);
        }
      });

      return mergeReport;
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
