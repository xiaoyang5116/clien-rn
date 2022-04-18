
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
