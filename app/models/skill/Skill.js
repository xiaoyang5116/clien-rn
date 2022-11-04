
import lo from 'lodash';
import { assert } from "../../constants/functions";
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
      let damage = 0; // 伤害
      let isCrit = false; // 是否暴击
      let isDodge = false; // 是否闪避
      let isPhysical = false; // 是否物理伤害

      lo.forEach(this._actions, (e) => {
        if (e.formula == undefined)
          return

        const expr = formula_expr(e.formula);
        if (expr.indexOf('damage=') == -1)
          return

        if (!isPhysical && expr.indexOf('physicalAttack') != -1) {
          isPhysical = true;
        }
        eval(expr);
      });

      return { damage, isPhysical, isCrit, isDodge };
    }
  }