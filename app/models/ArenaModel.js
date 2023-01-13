
import lo from 'lodash';

import { 
  action, 
  DeviceEventEmitter,
  EventKeys
} from "../constants";
import { assert } from '../constants/functions';

import {
  GetChallengeDataApi
} from '../services/GetChallengeDataApi';

import { newTarget } from './challenge/Target';

export default {
  namespace: 'ArenaModel',

  state: {

    // 角色战斗对象
    myself: null,

    // 战报数据
    report: [],

    __data: {
      enemyQueue: [],
      enemyIndex: 0,
      challengeId:""
    },
  },

  effects: {

    *start({ payload }, { put, select, call }) {
      const arenaState = yield select(state => state.ArenaModel);
      const { challengeId } = payload;

      // 记录战斗Id
      arenaState.__data.challengeId = challengeId

      // 获取战斗配置数据
      const data = yield call(GetChallengeDataApi, challengeId);
      assert(data != null, `challenge id(${challengeId}) exception!!!`);
      const { challenge } = data;
      
      // 生成己方数据
      if (challenge.myself != undefined) {
        const newMyself = changeAttrs(challenge.myself)
        arenaState.myself = newTarget(newMyself);
      } else {
        const myself = { uid: 1, userName: '李森炎', skillIds: [1, 2, 4], attrs: [
          { key: 'speed', value: 100 }, { key: 'shield', value: 200 }
        ] };

        const attrs = yield put.resolve(action('UserModel/getFinalAttrs')({}));
        if (lo.isArray(attrs)) {
          myself.attrs.push(...attrs);
        }
        arenaState.myself = newTarget(myself);
      }

      // 生成敌方战斗对象
      arenaState.__data.enemyIndex = 0;
      arenaState.__data.enemyQueue.length = 0;
      challenge.enemies.forEach(e => {
        const newEnemies = changeAttrs(e)
        arenaState.__data.enemyQueue.push(newTarget(newEnemies));
      });

      yield put.resolve(action('next')({}));
    },

    *next({ }, { put, select }) {
      const arenaState = yield select(state => state.ArenaModel);

      if (arenaState.__data.enemyQueue.length > 0
        && arenaState.__data.enemyIndex < arenaState.__data.enemyQueue.length) {
        const enemy = arenaState.__data.enemyQueue[arenaState.__data.enemyIndex];
        const report = yield put.resolve(action('ChallengeModel/challenge')({ myself: arenaState.myself, enemy }));

        yield put(action('updateState')({ enemy, report }));
        arenaState.__data.enemyIndex += 1;
      }
    },

    *over({ }, { put, select }) {
      const arenaState = yield select(state => state.ArenaModel);
      if (arenaState.__data.enemyQueue.length > 0
        && arenaState.__data.enemyIndex >= arenaState.__data.enemyQueue.length) {
        // 序列完毕，清理现场
        arenaState.__data.enemyQueue.length = 0;
        arenaState.__data.enemyIndex = 0;
        arenaState.report.length = 0;
      }
      yield put.resolve(action('next')({}));
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

function changeAttrs(obj) {
  if (Array.isArray(obj.liftRate) && Array.isArray(obj.attrs)) {
    const all = obj.liftRate.find(item => item.attr === "all")
    if (all != undefined) {
      for (let index = 0; index < obj.attrs.length; index++) {
        const attr = obj.attrs[index];
        const isExist = obj.liftRate.find(item => item.attr === attr.key)
        if (isExist === undefined) {
          attr.value = attr.value * all.multiplied
        } else {
          attr.value = attr.value * isExist.multiplied
        }
      }
    } else {
      for (let index = 0; index < obj.liftRate.length; index++) {
        const liftRate = obj.liftRate[index];
        const attr = obj.attrs.find(item => item.key === liftRate.attr)
        if (attr != undefined) {
          attr.value = attr.value * liftRate.multiplied
        }
      }
    }
  }
  return obj
}
