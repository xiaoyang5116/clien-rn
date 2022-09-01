import LocalStorage from "../utils/LocalStorage";
import { action, LocalCacheKeys } from "../constants";
import EventListeners from "../utils/EventListeners";

export default {
  namespace: 'WorshipModel',

  state: {
    worshipData: []
  },

  effects: {
    *reload({ payload }, { call, put, select }) {
      const data = yield call(LocalStorage.get, LocalCacheKeys.WORSHIP_DATA);
      if (data != null) {
        yield put(action('updateState')({ worshipData: data }))
      }
    },

    // 获取献祭道具数据
    *getOfferingProps({ payload }, { put, select, call }) {
      const allProps = yield put.resolve(action("PropsModel/getBagProps")())
      const propsData = allProps.filter(i => i.type === 200)
      return propsData
    },

  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },
  subscriptions: {
    registerReloadEvent({ dispatch }) {
      EventListeners.register('reload', (msg) => {
        return dispatch({ 'type': 'reload' });
      });
    },
  }
}