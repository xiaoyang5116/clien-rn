
import lo, { round } from 'lodash';
import { assert } from "../../constants/functions";
import { newTarget } from '../challenge/Target';
import { formula_expr } from './formula';

/**
 * attack: 攻击
 * agile: 敏捷
 * speed: 速度
 * crit:  暴击%
 * defense: 防御
 * dodge: 闪避%
 */
 export default class Skill {
  
    constructor(properties) {
      assert(properties.id != undefined);
      assert(properties.name != undefined);
      assert(properties.xuLiMillis != undefined);
      assert(properties.cdMillis != undefined);
      assert(properties.actions != undefined);
      assert(properties.effects != undefined);

      this._id = properties.id;
      this._name = properties.name;
      this._xuLiMillis = properties.xuLiMillis;
      this._cdMillis = properties.cdMillis;
      this._desc = properties.desc;
      this._actions = lo.cloneDeep(properties.actions);
      this._effects = lo.cloneDeep(properties.effects);
      this._consume = lo.cloneDeep(properties.consume);
      this._passive = properties.passive||false;

      this._startCDMillis = 0;
      this._startXuLiMillis = 0;
      this._release = false; // 是否已经释放产生效果
    }
  
    getId() {
      return this._id;
    }
  
    getName() {
      return this._name;
    }

    getDesc() {
      return this._desc;
    }

    getActions() {
      return this._actions;
    }

    getEffects() {
      return this._effects;
    }

    getConsume() {
      return this._consume;
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

    isPassive() {
      return this._passive;
    }

    isBuff() {
       return (this.isPassive() && lo.isArray(this._effects) && this._effects.length > 0);
    }

    onBuff(attacker) {
      let damage = 0; // 伤害
      let isCrit = false; // 是否暴击
      let isDodge = false; // 是否闪避
      let isPhysical = false; // 是否物理伤害
      let hp = 0; // 回血
      let mp = 0; // 回蓝

      const buffs = [];
      lo.forEach(this._effects, (e) => {
        const { buffId } = e;
        const found = lo.find(attacker.effects, (b) => (b.getId() == buffId));
        if (found != undefined) {
          buffs.push(lo.cloneDeep(found));
        }
      });

      if (buffs.length > 0) {
        attacker.buffs.push(...buffs);
      }

      return { damage, isPhysical, hp, mp, isCrit, isDodge };
    }

    onDamage(attacker, defender) {
      let damage = 0; // 伤害
      let isCrit = false; // 是否暴击
      let isDodge = false; // 是否闪避
      let isPhysical = false; // 是否物理伤害
      let hp = 0; // 回血
      let mp = 0; // 回蓝
      let validBuffs = []; // 有效BUFF


      // BUFF生效
      if (attacker.buffs.length > 0) {
        lo.forEach(attacker.buffs, (buff) => {
          if (buff.getRound() <= 0)
            return

          const effects = buff.getEffects();
          lo.forEach(effects, (effect) => {
            const expr = formula_expr(effect.formula);
            eval(expr);
          });

          validBuffs.push({ name: buff.getName() });
        });
      }

      // 伤害计算
      lo.forEach(this._actions, (e) => {
        if (e.formula == undefined)
          return

        if (e.hit_rate != undefined && e.hit_rate > 0) {
          if (lo.random(0, 100) > e.hit_rate)
            return
        }

        const expr = formula_expr(e.formula);
        const hasDamage = expr.indexOf('damage=') != -1;
        const hasHP = expr.indexOf('hp=') != -1;
        const hasMP = expr.indexOf('mp=') != -1;

        if (!(hasDamage || hasHP || hasMP))
          return

        if (!isPhysical && expr.indexOf('physicalAttack') != -1) {
          isPhysical = true;
        }

        eval(expr);
        
        // 添加尾数正负变动5（随机化5乘以位数再乘位数）
        damage = lo.random(-5,5) + damage

        // 暴击
        if (hasDamage && (e.crit_rate != undefined) && (e.crit_add != undefined)) {
          if (lo.random(0, 100) <= e.crit_rate) {
            damage = Math.ceil(damage * e.crit_add);
            isCrit = true;
          }
        }
      });

      return { damage, isPhysical, hp, mp, isCrit, isDodge, validBuffs };
    }
  
    // 应用技能
    apply(attacker, defender) {
      if (this.isBuff()) {
        return this.onBuff(attacker);
      } else {
        // 计算伤害时仅用对象副本
        const newAttacker = lo.cloneDeep(attacker);
        const newDefender = lo.cloneDeep(defender);
        const result = this.onDamage(newTarget(newAttacker), newTarget(newDefender));
        
        // BUFF回合数减少
        if (attacker.buffs != undefined && attacker.buffs.length > 0) {
          lo.forEach(attacker.buffs, (buff) => {
            if (buff.getRound() > 0) {
              buff.reduceRound(1);
            }
          });
          attacker.buffs = lo.filter(attacker.buffs, (e) => (e.getRound() > 0));
        }
        return result;
      }
    }
  }