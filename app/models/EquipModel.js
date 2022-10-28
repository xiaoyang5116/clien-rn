
import { 
  action,
  LocalCacheKeys,
  DeviceEventEmitter,
  EventKeys,
} from "../constants";

import lo from 'lodash';
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

export default {
  namespace: 'EquipModel',

  state: {
    __data: {
    },

    equips: [], // 身上的装备（装备自带属性参与战斗计算）。
  },

  effects: {
    
    *reload({ }, { select, call, put }) {
      const cache = yield call(LocalStorage.get, LocalCacheKeys.EQUIP_DATA)
      if (cache != null) {
        yield put(action('updateState')({ ...cache }));
      }
    },

    // 获得加成值
    *getAddValues({ payload }, { put, select }) {
      const equipState = yield select(state => state.EquipModel);

      const all = [];
      if (lo.isArray(equipState.equips) && equipState.equips.length > 0) {
        lo.forEach(equipState.equips, (v) => {
          all.push(...v.affect);
        });
      }

      return all;
    },

    // 穿戴装备
    *addEquip({ payload }, { put, select }) {
      const equipState = yield select(state => state.EquipModel);
      const { equipId } = payload;
      
      if (!lo.isNumber(equipId) || equipId <= 0)
        return false;

      const equipConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: equipId }));
      if (equipConfig == undefined)
        return false;

      if (!lo.isArray(equipConfig.affect))
        return false;

      if (equipState.equips.find(e => (e.id == equipId)) != undefined)
        return false;

      // 部位已经装配,则替换
      const found = equipState.equips.find(e => (lo.indexOf(equipConfig.tags, e.tag) != -1));
      if (found != undefined) {
        equipState.equips = equipState.equips.filter(e => (e.id != found.id));
        // 归还锁定的道具
        yield put.resolve(action('PropsModel/sendProps')({ propId: found.id, num: 1, quiet: true }));
      }

      // 扣除一个相应的道具
      const status = yield put.resolve(action('PropsModel/reduce')({ propsId: [equipId], num: 1 }));
      if (status) {
        // tags[0] = 部位标签
        equipState.equips.push({ id: equipId, tag: equipConfig.tags[0], affect: lo.cloneDeep(equipConfig.affect) });
        yield put.resolve(action('syncData')({}));

        // 通知角色属性刷新
        DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
        return true;
      }

      return false;
    },

    // 移除装备
    *removeEquip({ payload }, { put, select }) {
      const { equipId } = payload;
      if (!lo.isNumber(equipId) || equipId <= 0)
        return false;

      const equipState = yield select(state => state.EquipModel);

      const found = equipState.equips.find(e => (e.id == equipId));
      if (found == undefined)
        return false;

        equipState.equips = equipState.equips.filter(e => (e.id != equipId));
      yield put.resolve(action('syncData')({}));

      // 归还锁定的道具
      yield put.resolve(action('PropsModel/sendProps')({ propId: equipId, num: 1, quiet: true }));

      // 通知角色属性刷新
      DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
      return true;
    },

    // 获取身上的装备
    *getEquipsEntity({}, { put, select }) {
      const equipState = yield select(state => state.EquipModel);

      if (lo.isArray(equipState.equips) && equipState.equips.length > 0) {
        const equips = [];
        for (let key in equipState.equips) {
          const item = equipState.equips[key];
          const equipConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: item.id }));
          if (equipConfig == undefined)
            continue;
          equips.push({ ...item, entity: equipConfig });
        }
        return equips
      }
      return [];
    },

    *syncData({ }, { select, call }) {
      const equipState = yield select(state => state.EquipModel);
      const serialize = lo.pickBy(equipState, (v, k) => {
        return !lo.isEqual(k, '__data');
      });
      yield call(LocalStorage.set, LocalCacheKeys.EQUIP_DATA, serialize);
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
        return dispatch({ 'type':  'reload'});
      });
    },
  }
}