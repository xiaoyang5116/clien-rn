
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

    *initTargetSkill({ payload }, { put }) {
      const { target } = payload;

      target.skills = [];
      target.effects = []; // 保存所有涉及到的BUFF(未生效)
      target.buffs = []; // 保存生效的BUFF实例

      for (let i = 0; i < target.skillIds.length; i++) {
        const skillId = target.skillIds[i];
        const skill = yield put.resolve(action('SkillModel/getSkill')({ skillId }));
        if (skill != undefined) {
          target.skills.push(lo.cloneDeep(skill));

          if (skill.isBuff()) {
            const effects = skill.getEffects();
            for (let j = 0; j < effects.length; j++) {
              const effect = effects[j];
              const buff = yield put.resolve(action('SkillModel/getBuff')({ buffId: effect.buffId }));
              target.effects.push(lo.cloneDeep(buff));
            }
          }
        }
      }
    },

    *challenge({ payload }, { put }) {
      // 初始化战斗对象
      const { myself, enemy } = payload;

      // 初始化技能
      yield put.resolve(action('initTargetSkill')({ target: myself }));
      yield put.resolve(action('initTargetSkill')({ target: enemy }));

      // 初始化属性
      // myself.colorUserName = '<span style="color:#36b7b5">{0}</span>'.format(myself.userName);
      myself.colorUserName = '' + myself.userName
      myself.prepare = false;
      // enemy.colorUserName = '<span style="color:#7a81ff">{0}</span>'.format(enemy.userName);
      enemy.colorUserName = '' + enemy.userName;
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
        if (now > (startMillis + 60000 * 5)) {
          console.error('战斗异常!!!');
          break;
        }

        for (let k in allSkills) {
          const { owner, skill } = allSkills[k];
          const attacker = owner;
          const defender = (attacker.uid == myself.uid) ? enemy : myself;

          if (skill.isXunLiCompleted(now)) {
            // 释放技能
            if (!skill.isRelease()) {
              // 技能释放消耗充足
              let isReleaseConsumeEnough = true
              // 技能消耗
              const consumeList = skill.getConsume();
              if (lo.isArray(consumeList)) {
                for (let i = 0; i < consumeList.length; i++) {
                  const item = consumeList[i];
                   // 扣除魔法
                  if (item.mp != undefined && item.mp > 0  && attacker.attrs.mp > 0) {
                    attacker.attrs.mp -= item.mp;
                    isReleaseConsumeEnough = (attacker.attrs.mp >= 0) ? true : false;
                    attacker.attrs.mp = (attacker.attrs.mp >= 0) ? attacker.attrs.mp : 0;
                  }
                  // 扣血
                  if (item.hp != undefined && item.hp > 0  && attacker.attrs.hp > 0) {
                    attacker.attrs.hp -= item.hp;
                    isReleaseConsumeEnough = (attacker.attrs.hp >= 0) ? true : false;
                    attacker.attrs.hp = (attacker.attrs.mp >= 0) ? attacker.attrs.hp : 0;
                  }
                  // 消耗道具
                  if(item.props != undefined && lo.isArray(item.props) && attacker.attrs.hp < Number(attacker.attrs._hp *0.8)){
                    let isHaveProp = false
                    for (let p = 0; p < item.props.length; p++) {
                      const prop = item.props[p]
                      const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: prop.propId }));
                      if (propNum > 0) {
                        item.usePropsId = prop.propId
                        yield put.resolve(action('PropsModel/use')({ propId: prop.propId, num: 1, quiet: true }));
                        isHaveProp = true
                        break;
                      }
                    }
                    isReleaseConsumeEnough = isHaveProp ? true : false;
                    if(isHaveProp == false){
                      item.usePropsId = undefined
                    }
                  }
                  // 跳过道具
                  if(item.props != undefined && lo.isArray(item.props) && attacker.attrs.hp > Number(attacker.attrs._hp *0.8)){
                    isReleaseConsumeEnough = false
                  }
                }
              }

              // 技能不满足消耗时，技能进入cd 和 蓄力
              if(!isReleaseConsumeEnough){
                skill.startCD(now);
                skill.startXuLi(now);
                continue
              }

              const result = skill.apply(attacker, defender);
              const { damage, hp, mp } = result;

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

              // 回血
              if (hp > 0) {
                attacker.attrs.hp += hp;
                attacker.attrs.hp = (attacker.attrs.hp > attacker.attrs._hp) ? attacker.attrs._hp : attacker.attrs.hp;
              }

              // 回蓝
              if (mp > 0) {
                attacker.attrs.mp += mp;
                attacker.attrs.mp = (attacker.attrs.mp > attacker.attrs._mp) ? attacker.attrs._mp : attacker.attrs.mp;
              }

              const colorSkillName = (skill.getId() > 1) ? "<span style='color:#ff2600'>{0}</span>".format(skill.getName()) : skill.getName();

              let msg = '';
              let validDamage = 0;
              if (damage > 0) {
                validDamage = (damage > (defender.attrs.hp + defender.attrs.shield)) ? (defender.attrs.hp + defender.attrs.shield) : damage;

                // 优先扣除护盾
                if (validDamage <= defender.attrs.shield) {
                  defender.attrs.shield -= validDamage;
                } else {
                  let remainNum = validDamage;
                  remainNum -= defender.attrs.shield;
                  defender.attrs.shield = 0;
                  defender.attrs.hp -= remainNum;
                }

                if (result.isCrit) {
                  msg = "{0}使用了{1}攻击了{2}并触发<span style='color:#ff40ff'>暴击</span>, 造成<span style='color:#ff2f92'>{3}</span>点伤害".format(attacker.colorUserName, colorSkillName, defender.colorUserName, validDamage);
                } else {
                  msg = "{0}使用了{1}攻击了{2}, 造成<span style='color:#ff2f92'>{3}</span>点伤害".format(attacker.colorUserName, colorSkillName, defender.colorUserName, validDamage);
                }
              } else if (result.isDodge) {
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
                attackerShield: attacker.attrs.shield,
                defenderShield: defender.attrs.shield,
                attackerOrgHP: attacker.attrs._hp,
                defenderOrgHP: defender.attrs._hp,
                attackerOrgMP: attacker.attrs._mp,
                defenderOrgMP: defender.attrs._mp,
                attackerOrgShield: attacker.attrs._shield,
                defenderOrgShield: defender.attrs._shield,
                skills: [{ 
                  name: skill.getName(), 
                  passive: skill.isPassive(),
                }],
                buffs: (lo.isArray(result.validBuffs) ? result.validBuffs : []),
                damage: validDamage,
                physicalDamage: (result.isPhysical ? validDamage : 0),
                magicDamage: (!result.isPhysical ? validDamage : 0),
                rechargeHP: hp, // 回血
                rechargeMP: mp, // 回蓝
                crit: result.isCrit, // 是否暴击
                msg: msg 
              });

              if (attacker.attrs.hp <= 0 
                || defender.attrs.hp <= 0)
                break;
            }
            if (!skill.isCDLimit(now)) {
              skill.setRelease(false);
              skill.startXuLi(now);
            }
          }
        }

        if (myself.attrs.hp <= 0 || enemy.attrs.hp <= 0) {
          if (myself.attrs.hp <= 0) report.push({ msg: '战斗结束, {0} 被 {1} 击败!'.format(myself.colorUserName, enemy.colorUserName) });
          if (enemy.attrs.hp <= 0) report.push({ msg: '战斗结束, {0} 击败了 {1}!'.format(myself.colorUserName, enemy.colorUserName) });
          break;
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
          e.damage += prev.damage;
          e.physicalDamage += prev.physicalDamage;
          e.magicDamage += prev.magicDamage;

          lo.forEach(prev.skills, (item) => {
            const found = lo.find(e.skills, (e) => lo.isEqual(e.name, item.name));
            if (found == undefined) {
              e.skills.push(item);
            }
          });

          lo.forEach(prev.buffs, (item) => {
            const found = lo.find(e.buffs, (e) => lo.isEqual(e.name, item.name));
            if (found == undefined) {
              e.buffs.push(item);
            }
          });

          if (e.skills.length > 0) { // 排序
            e.skills.sort((a, b) => (a.passive && !b.passive) ? 0 : -1);
          }

          mergeReport.pop();
          mergeReport.push(e);
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
