
import { 
  action,
} from "../constants";

import EventListeners from '../utils/EventListeners';
import { GetExploreDataApi } from '../services/GetExploreDataApi';
import lo from 'lodash';

export default {
  namespace: 'ExploreModel',

  state: {
    __data: {
      config: [],
    },

    // 探索区域列表
    areas: [],

    // 当前进入哪个地区
    areaId: -1,
  },

  effects: {

    *reload({ }, { select, call, put }) {
      const exploreState = yield select(state => state.ExploreModel);
      const data = yield call(GetExploreDataApi);
      
      exploreState.__data.config.length = 0;
      exploreState.__data.config.push(...data.explore);
    },

    *getAreas({ }, { select, put }) {
      const exploreState = yield select(state => state.ExploreModel);

      const areas = [];
      for (let i = 0; i < exploreState.__data.config.length; i += 2) {
        const first = exploreState.__data.config[i];
        const second = exploreState.__data.config[i+1];
        const item = [];
        if (lo.isObject(first)) item.push(first);
        if (lo.isObject(second)) item.push(second);
        areas.push(item);
      }

      yield put(action('updateState')({ areas }));
    },

    *start({ payload }, { select, put }) {
      console.debug(payload);
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
