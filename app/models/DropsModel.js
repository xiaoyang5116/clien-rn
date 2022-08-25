
import { 
  action,
  LocalCacheKeys,
} from "../constants";

import {
  GetDropsDataApi,
} from "../services/GetDropsDataApi";

import lo from 'lodash';
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

export default {
  namespace: 'DropsModel',

  state: {
    __data: {
      config: [],
    },
    ids: [], // 记录已经处理的掉落ID
  },

  effects: {
    *reload({ }, { call, select, put }) {
      const dropsState = yield select(state => state.DropsModel);
      const idsCache = yield call(LocalStorage.get, LocalCacheKeys.DROPS_ID);
      
      dropsState.ids.length = 0;
      if (idsCache != null) {
        dropsState.ids.push(...idsCache);
      }

      const data = yield call(GetDropsDataApi);
      dropsState.__data.config.length = 0;
      if (data != null) {
        dropsState.__data.config.push(...data.drops);
      }
    },

    *process({ payload }, { call, select, put }) {
      const dropsState = yield select(state => state.DropsModel);

      const { dropIds } = payload;
      if (lo.isEmpty(dropIds) || !lo.isArray(dropIds))
        return

      for (let key in dropIds) {
        const dropId = dropIds[key];

        const found = dropsState.__data.config.find(e => lo.isEqual(e.id, dropId));
        if (found == undefined) 
          continue

        if (lo.indexOf(dropsState.ids, dropId) != -1)
          return

        const actions = lo.pick(found, ['sendProps', 'alterAttrs']);
        if (lo.keys(actions).length > 0) {
          yield put.resolve(action('SceneModel/processActions')({ ...actions }));
        }

        // 记录完成
        dropsState.ids.push(dropId);
      }

      yield put.resolve(action('syncData')({}));
    },

    *syncData({ }, { select, call }) {
      const dropsState = yield select(state => state.DropsModel);
      yield call(LocalStorage.set, LocalCacheKeys.DROPS_ID, dropsState.ids);
    },
  },
  
  reducers: {
  },

  subscriptions: {
    registerReloadEvent({ dispatch }) {
      EventListeners.register('reload', (msg) => {
        return dispatch({ 'type':  'reload'});
      });
    },
  }
}
