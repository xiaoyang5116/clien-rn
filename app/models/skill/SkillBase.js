/**
 * attack: 攻击
 * agile: 敏捷
 * speed: 速度
 * crit:  暴击%
 * defense: 防御
 * dodge: 闪避%
 */
 class SkillBase {
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
      let damage = ((attacker.attack / 1000 + attacker.agile / 1000) - (defender.defense / 1000)) * 1000;
  
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