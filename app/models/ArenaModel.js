
import { 
  action,
} from "../constants";

import {
  GetSeqDataApi
} from '../services/GetSeqDataApi';

export default {
  namespace: 'ArenaModel',

  state: {
    myself: {
      uid: 1,
      userName: '李森焱',
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
      userName: '杂鱼',
      life: 8000,//生命
      speed: 80,  // 速度
      power: 450, // 攻击力
      agile: 350, // 敏捷
      defense: 80, // 防御
      crit: 10, // 暴击
      dodge: 15, // 闪避
      skillIds: [1, 3],
    },

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

      arenaState.__data.seqConfig = null;
      arenaState.__data.enemyQueue.length = 0;
      arenaState.__data.enemyIndex = 0;

      const data = yield call(GetSeqDataApi, seqId);
      const config = data.sequences.find(e => e.id == seqId);
      if (config != undefined) {
        arenaState.__data.seqConfig = config;
        arenaState.__data.enemyQueue.length = 0;

        config.enemies.forEach(e => {
          arenaState.__data.enemyQueue.push(...e.items);
        });
      }

      yield put.resolve(action('next')({}));
    },

    *next({ }, { put, select }) {
      const arenaState = yield select(state => state.ArenaModel);

      if (arenaState.__data.enemyQueue.length > 0
        && arenaState.__data.enemyIndex < arenaState.__data.enemyQueue.length) {
        const enemy = arenaState.__data.enemyQueue[arenaState.__data.enemyIndex];
        const report = yield put.resolve(action('ChallengeModel/challenge')({ myself: arenaState.myself, enemy: enemy }));

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
