
import { 
  action,
} from "../constants";

import EventListeners from '../utils/EventListeners';
import { GetExploreDataApi } from '../services/GetExploreDataApi';
import lo, { map } from 'lodash';

const EVENT_NAME = [
  { event: 'slot', name: '获得一次自动抽奖机会' },
  { event: 'xunbao', name: '随机获得一张寻宝卡片' },
  { event: 'boss', name: '随机获得一次挑战BOSS的机会' },
  { event: 'xiansuo', name: '随机获得一次奖励线索' },
  { event: 'qiyu', name: '随机获得一张奇遇卡片' },
  { event: 'pk', name: '你遇到一个轻而易举就能必败的对手' },
];

export default {
  namespace: 'ExploreModel',

  state: {
    __data: {
      config: [],
    },

    // 探索地图列表
    maps: [],

    // 当前进入哪个地图
    mapId: -1,

    // 地图里面的那个区域
    areaId: 1,

    // 当前探索获得道具
    rewards: [],
  },

  effects: {

    *reload({ }, { select, call, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const data = yield call(GetExploreDataApi);

      if (data != null) {
        data.explore.forEach(e => {
          e.areas.forEach(a => {
            const eventNum = Math.floor(a.time / a.interval);
            for (let i = 0; i < eventNum; i++) {
              if (a.points.find(e => e.idx == i) == undefined) {
                a.points.push({ idx: i, event: 'slot' });
              }
            }
            a.points.sort((_a, _b) => _a.idx - _b.idx);
          });
          e.areas.sort((_a, _b) => _a.id - _b.id);
        });
      }
      
      exploreState.__data.config.length = 0;
      exploreState.__data.config.push(...data.explore);
    },

    // 获取并加载地图
    *getMaps({ }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);

      const maps = [];
      for (let i = 0; i < exploreState.__data.config.length; i += 2) {
        const first = exploreState.__data.config[i];
        const second = exploreState.__data.config[i+1];
        const item = [];
        if (lo.isObject(first)) item.push(first);
        if (lo.isObject(second)) item.push(second);
        maps.push(item);
      }

      yield put(action('updateState')({ maps }));
    },

    // 间隔时间事件
    *onTimeEvent({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { idx, refTimeBanner, refMsgList } = payload;

      const currentMap = exploreState.__data.config.find(e => e.id == exploreState.mapId);
      const currentArea = currentMap.areas.find(e => e.id == exploreState.areaId);
      const currentEvent = currentArea.points.find(e => e.idx == idx);
      const eventNum = Math.floor(currentArea.time / currentArea.interval);

      refTimeBanner.hide(idx);
      const eventName = EVENT_NAME.find(e => e.event == currentEvent.event).name;
      refMsgList.addMsg(eventName);

      switch (currentEvent.event) {
        case 'slot':
          yield put.resolve(action('onSlotEvent')({ map: currentMap, area: currentArea }));
          refTimeBanner.resume();
          break;
        case 'xunbao':
          yield put.resolve(action('onXunBaoEvent')({ }));
          refTimeBanner.resume();
          break;
        case 'boss':
          yield put.resolve(action('onBossEvent')({ }));
          refTimeBanner.resume();
          break;
        case 'xiansuo':
          yield put.resolve(action('onXianSuoEvent')({ }));
          refTimeBanner.resume();
          break;
        case 'qiyu':
          yield put.resolve(action('onQiYuEvent')({ }));
          refTimeBanner.resume();
          break;
        case 'pk':
          yield put.resolve(action('onPKEvent')({ }));
          refTimeBanner.resume();
          break;
      }

      // 是否结束
      if ((idx + 1) >= eventNum) {
        yield put.resolve(action('onTimeEnd')({ map: currentMap, area: currentArea, refMsgList }));
      }
    },

    // 时间事件结束
    *onTimeEnd({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { map, area, refMsgList } = payload;

      let nextArea = null;
      for (let key in map.areas) {
        const item = map.areas[key];
        if (item.id > area.id) {
          nextArea = item;
          break;
        }
      }

      // 开启下一个区域
      if (nextArea != null) {
        refMsgList.addMsg(` ====== 进入${nextArea.name} ======`);
        yield put(action('updateState')({ areaId: nextArea.id }));
      } else {
        // 地图所有区域探索完毕
        refMsgList.addMsg(' ====== 探索完毕 ====== ');
      }
    },

    // 抽奖事件
    *onSlotEvent({ payload }, { select, put }) {
    },

    // 寻宝事件
    *onXunBaoEvent({ payload }, { select, put }) {
    },

    // 挑战BOSS事件
    *onBossEvent({ payload }, { select, put }) {
    },

    // 线索事件
    *onXianSuoEvent({ payload }, { select, put }) {
    },

    // 奇遇事件
    *onQiYuEvent({ payload }, { select, put }) {
    },

    // 挑战杂鱼
    *onPKEvent({ payload }, { select, put }) {
    },

    // 开始探索
    *start({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { mapId } = payload;
      exploreState.mapId = mapId;
      exploreState.areaId = 1;
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
      EventListeners.register('reload', (msg) => {
        dispatch({ 'type':  'reload'});
      });
    },
  }
}
