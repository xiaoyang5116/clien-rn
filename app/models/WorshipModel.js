import LocalStorage from '../utils/LocalStorage';
import { action, LocalCacheKeys } from '../constants';
import EventListeners from '../utils/EventListeners';
import { now } from '../utils/DateTimeUtils';

export default {
  namespace: 'WorshipModel',

  state: {
    worshipData: [],
  },

  effects: {
    *reload({ payload }, { call, put, select }) {
      const data = yield call(LocalStorage.get, LocalCacheKeys.WORSHIP_DATA);
      if (data != null) {
        yield put(action('updateState')({ worshipData: data }));
      } else {
        yield put(
          action('updateState')({
            worshipData: [
              { id: 1, status: 0 },
              { id: 2, status: 0 },
              { id: 3, status: 0 },
              { id: 4, status: 0 },
            ],
          }),
        );
      }
    },

    // 获取献祭道具数据
    *getOfferingProps({ payload }, { put, select, call }) {
      const allProps = yield put.resolve(action('PropsModel/getBagProps')());
      const propsData = allProps.filter(i => i.type === 200);
      return propsData;
    },

    // 添加供奉道具
    *addWorshipProp({ payload }, { put, select, call }) {
      const { worshipProp, gridId } = payload;
      const { worshipData } = yield select(state => state.WorshipModel);
      const newWorshipData = worshipData.map(item =>
        item.id === gridId
          ? {
            ...item,
            status: 1,
            propId: worshipProp.id,
            iconId: worshipProp.iconId,
            quality: worshipProp.quality,
            needTime: worshipProp.worshipTime,
            beginTime: now(),
          }
          : item,
      );

      yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, newWorshipData);
      yield put(action("updateState")({ worshipData: newWorshipData }))
    },

    // 取消供奉
    *cancelWorship({ payload }, { put, select, call }) {
      // console.log("payload", payload);
      const { worshipData } = yield select(state => state.WorshipModel);
      const newWorshipData = worshipData.map(item => item.id === payload.id ? { id: item.id, status: 0 } : item)
      yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, newWorshipData);
      yield put(action("updateState")({ worshipData: newWorshipData }))
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    registerReloadEvent({ dispatch }) {
      EventListeners.register('reload', msg => {
        return dispatch({ type: 'reload' });
      });
    },
  },
};
