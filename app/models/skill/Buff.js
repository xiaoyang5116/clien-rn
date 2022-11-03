
import lo from 'lodash';
import { assert } from "../../constants/functions";

 export default class Buff {
  
    constructor(properties) {
      assert(properties.id != undefined);
      assert(properties.name != undefined);
      assert(properties.round != undefined);
      assert(properties.effects != undefined);

      this._id = properties.id;
      this._name = properties.name;
      this._desc = properties.desc;
      this._round = properties.round;
      this._effects = lo.cloneDeep(properties.effects);
    }
  
    getId() {
      return this._id;
    }
  
    getName() {
      return this._name;
    }

    getRound() {
      return this._round;
    }
  
  }