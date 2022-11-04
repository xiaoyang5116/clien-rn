
import lo from 'lodash';

import { 
  action,
} from "../constants";

import {
  GetSeqDataApi
} from '../services/GetSeqDataApi';
import { newTarget } from './challenge/Target';

export default {
  namespace: 'ArenaModel',

  state: {

    // 角色战斗对象
    myself: null,

    // 战报数据
    report: [],

    __data: {
      seqConfig: null,
      enemyQueue: [],
      enemyIndex: 0,
    },
  },

  effects: {

    *start({ payload }, { put, select, call }) {
      const arenaState = yield select(state => state.ArenaModel);
      const { seqId } = payload;

      // 生成新的战斗玩家对象
      const myself = { uid: 1, userName: '李森炎', skillIds: [1, 4], attrs: [
        { key: 'speed', value: 100 }, { key: 'shield', value: 300 }
      ] };
      const attrs = yield put.resolve(action('UserModel/getFinalAttrs')({}));
      if (lo.isArray(attrs)) {
        myself.attrs.push(...attrs);
      }
      
      arenaState.myself = newTarget(myself);
      arenaState.__data.seqConfig = null;
      arenaState.__data.enemyQueue.length = 0;
      arenaState.__data.enemyIndex = 0;

      // 生成敌方战斗对象
      const data = yield call(GetSeqDataApi, seqId);
      const config = data.sequences.find(e => e.id == seqId);
      if (config != undefined) {
        arenaState.__data.seqConfig = config;
        arenaState.__data.enemyQueue.length = 0;

        config.enemies.forEach(e => {
          lo.forEach(e.items, (item) => {
            arenaState.__data.enemyQueue.push(newTarget(item));
          });
        });
      }

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
        arenaState.__data.seqConfig = null;
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
