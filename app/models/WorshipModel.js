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
      let _worshipData = [...worshipData];
      const worshipDataIndex = _worshipData.findIndex(
        item => item.id == gridId,
      );

      // 判断 添加祭品对应的格子 前面是否有供奉中的格子
      let isWorship = true;
      for (let index = 0; index < worshipDataIndex; index++) {
        const item = _worshipData[index];
        if (item.status === 2) {
          isWorship = false;
        }
      }

      if (isWorship) {
        _worshipData[worshipDataIndex] = {
          ..._worshipData[worshipDataIndex],
          status: 2,
          beginTime: now(),
        };
      } else {
        _worshipData[worshipDataIndex] = {
          ..._worshipData[worshipDataIndex],
          status: 1,
        };
      }
      _worshipData[worshipDataIndex] = {
        ..._worshipData[worshipDataIndex],
        name: worshipProp.name,
        propId: worshipProp.id,
        iconId: worshipProp.iconId,
        quality: worshipProp.quality,
        needTime: worshipProp.worshipTime,
      };
      const newWorshipData = removeEmpty(_worshipData)
      yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, newWorshipData);
      yield put(action('updateState')({ worshipData: newWorshipData }));
    },

    // 取消供奉
    *cancelWorship({ payload }, { put, select, call }) {
      // console.log("payload", payload);
      const { worshipData } = yield select(state => state.WorshipModel);
      const _worshipData = worshipData.map(item =>
        item.id === payload.id ? { id: item.id, status: 0 } : item,
      );
      // 排除空的
      const newWorshipData = removeEmpty(_worshipData)
      yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, newWorshipData);
      yield put(action('updateState')({ worshipData: newWorshipData }));
    },

    // 更改 供奉中 道具
    *changeWorship({ payload }, { put, select, call }) {
      // {"beginTime": 1662195643642, "iconId": 2,
      // "id": 1, "name": "猪猡", "needTime": 10, "propId": 1500, "quality": 2, "status": 2}
      const { worshipData } = yield select(state => state.WorshipModel);
      const _worshipData = [...worshipData]
      const index = _worshipData.findIndex(item => item.id === payload.id)
      _worshipData[index] = {
        ..._worshipData[index],
        status: 3,
      }
      if (index <= _worshipData.length - 1 && _worshipData[index + 1]?.status === 1) {
        _worshipData[index + 1] = {
          ..._worshipData[index + 1],
          status: 2,
          beginTime: now(),
        }
      }
      yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, _worshipData);
      yield put(action('updateState')({ worshipData: _worshipData }));
    },

    // 获取加速道具数据
    *getSpeedUpProps({ payload }, { put, select, call }) {
      const allProps = yield put.resolve(action('PropsModel/getBagProps')());
      const propsData = allProps.filter(i => i.type === 201);
      return propsData;
    },

    // 供奉加速
    *worshipSpeedUp({ payload }, { put, select, call }) {
      // {"attrs": ["测试"], "capacity": 100, "desc": "供奉加速道具",
      // "iconId": 2, "id": 2000, "name": "时间1", "num": 10, "quality": 2, "recordId": 4374, "speedUp": 10, "tags": ["普通"], "type": 201}
      const { worshipData } = yield select(state => state.WorshipModel);
      const _worshipData = [...worshipData]
      const index = _worshipData.findIndex(item => item.status === 2)
      // const currentNeedTime = _worshipData[index].needTime - payload.speedUp
      // _worshipData[index] = {
      //   ..._worshipData[index],
      //   needTime: currentNeedTime > 0 ? currentNeedTime : 0
      // }
      // yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, _worshipData);
      // yield put(action('updateState')({ worshipData: _worshipData }));
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

// 排除空的
function removeEmpty(worshipData) {
  let newWorshipData = [...worshipData];
  for (let index = 0; index < worshipData.length; index++) {
    const item = worshipData[index];
    if (item.status === 0) {
      newWorshipData = newWorshipData.filter(f => f.id != item.id);
      newWorshipData.push(item);
    }
  }
  return newWorshipData
}
