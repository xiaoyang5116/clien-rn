
import { 
  action,
} from "../constants";

import EventListeners from '../utils/EventListeners';
import { GetExploreDataApi } from '../services/GetExploreDataApi';
import lo, { map } from 'lodash';

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

    *onTimeEvent({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { idx, refTimeBanner, refMsgList } = payload;

      const currentMap = exploreState.__data.config.find(e => e.id == exploreState.mapId);
      const currentArea = currentMap.areas.find(e => e.id == exploreState.areaId);
      const currentEvent = currentArea.points.find(e => e.idx == idx);
      const eventNum = Math.floor(currentArea.time / currentArea.interval);

      refTimeBanner.hide(idx);
      refMsgList.addMsg(`触发 ${currentEvent.event} 事件`);

      // 战斗类事件暂停
      // if (['boss', 'pk'].indexOf(currentEvent.event) == -1) {
        refTimeBanner.resume();
      // }

      // 是否结束
      if ((idx + 1) >= eventNum) {
        yield put.resolve(action('onTimeEnd')({ map: currentMap, areaId: exploreState.areaId, refMsgList }));
      }
    },

    *onTimeEnd({ payload }, { select, put }) {
      const { map, areaId, refMsgList } = payload;

      let nextArea = null;
      for (let key in map.areas) {
        const area = map.areas[key];
        if (area.id > areaId) {
          nextArea = area;
          break;
        }
      }

      // 开启下一个区域
      if (nextArea != null) {
        refMsgList.addMsg(` ====== 进入${nextArea.name} ======`);
        yield put(action('updateState')({ areaId: nextArea.id }));
      }
    },

    *start({ payload }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const { mapId } = payload;
      exploreState.mapId = mapId;
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
