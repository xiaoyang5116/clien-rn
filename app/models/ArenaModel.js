
import { 
  action,
} from "../constants";

import lo from 'lodash';
import * as DateTime from '../utils/DateTimeUtils';

export default {
  namespace: 'ArenaModel',

  state: {
    myself: {
      uid: 1,
      userName: '光头强',
      life: 8000,// 生命
      speed: 100, // 速度
      power: 600, // 攻击力
      agile: 300, // 敏捷
      defense: 100, // 防御
      crit: 10, // 暴击
      dodge: 15, // 闪避
      skillIds: [1, 2],
    },

    enemy: {
      uid: 100000,
      userName: '熊大',
      life: 8000,//生命
      speed: 80,  // 速度
      power: 450, // 攻击力
      agile: 350, // 敏捷
      defense: 80, // 防御
      crit: 10, // 暴击
      dodge: 15, // 闪避
      skillIds: [1, 3],
    },
  },

  effects: {
    *start({ payload }, { }) {
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
    },
  }
}
