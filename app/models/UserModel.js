
import { 
  action,
  LocalCacheKeys,
  DeviceEventEmitter,
  EventKeys,
} from "../constants";

import lo from 'lodash';

import { 
  GetAttrsDataApi 
} from '../services/GetAttrsDataApi';

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

export default {
  namespace: 'UserModel',

  state: {
    copper: 0,  // 铜币数量
    sceneId: '',  // 当前场景ID(该状态在异步操作中状态不确定，请使用__sceneId)
    prevSceneId: '',  // 前一个场景ID
    worldId: 0, // 用户当前世界ID
    attrs: [], // 普通属性（阅读器）
    equips: [], // 身上的装备
  },

  effects: {
    *reload({ }, { call, put }) {
      const userCache = yield call(LocalStorage.get, LocalCacheKeys.USER_DATA);
      const attrsData = yield call(GetAttrsDataApi);
      const userAttrs = (userCache != null) ? userCache.attrs : [];

      const allAttrs = [];
      attrsData.data.attrs.forEach(e => {
        e.data.forEach(e => {
          e.forEach(e => {
            allAttrs.push(e);
          })
        })
      });

      // 初始化默认值
      allAttrs.forEach(e => {
        if (userAttrs.find(x => lo.isEqual(x.key, e.key)) == undefined) {
          userAttrs.push({ key: e.key, value: e.value });
        }
      });

      if (userCache != null) {
        yield put(action('updateState')({ ...userCache }));
      } else {
        yield put(action('updateState')({
          copper: 0,
          sceneId: '',
          prevSceneId: '',
          worldId: 0,
          attrs: userAttrs,
          equips: [],
        }));
      }
    },

    *alertCopper({ payload }, { put, call, select }) {
      const userState = yield select(state => state.UserModel);
      const value = parseInt(payload.value);
      if (value == 0)
        return;

      let newValue = parseInt(userState.copper + value);
      newValue = (newValue < 0) ? 0 : newValue;
      userState.copper = newValue;

      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
    },

    *alertAttrs({ payload }, { put, call, select }) {
      const userState = yield select(state => state.UserModel);
      
      payload.forEach(e => {
        const { key, value } = e;
        if (lo.isEmpty(key) || value == 0)
          return;

          let entry = userState.attrs.find(x => x.key == key);
          if (entry == undefined) {
            entry = { key: key, value: 0 };
            userState.attrs.push(entry);
          }

          entry.value += value;
          entry.value = (entry.value < 0) ? 0 : entry.value;
      });

      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
      
      // 通知角色属性刷新
      DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
    },

    *getAttrs({}, { select }) {
      const userState = yield select(state => state.UserModel);
      return userState.attrs;
    },

    *addEquip({ payload }, { put, select }) {
      const { equipId } = payload;
      if (!lo.isNumber(equipId) || equipId <= 0)
        return false;

      const userState = yield select(state => state.UserModel);
      const equipConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: equipId }));
      if (equipConfig == undefined)
        return false;

      if (!lo.isArray(equipConfig.affect))
        return false;

      if (userState.equips.find(e => (e.id == equipId)) != undefined)
        return false;

      // 部位已经装配,则替换
      const found = userState.equips.find(e => (lo.indexOf(equipConfig.tags, e.tag) != -1));
      if (found != undefined) {
        userState.equips = userState.equips.filter(e => (e.id != found.id));
        // 归还锁定的道具
        yield put.resolve(action('PropsModel/sendProps')({ propId: found.id, num: 1, quiet: true }));
      }

      // 扣除一个相应的道具
      const status = yield put.resolve(action('PropsModel/reduce')({ propsId: [equipId], num: 1, mode: 1 }));
      if (status) {
        // tags[0] = 部位标签
        userState.equips.push({ id: equipId, tag: equipConfig.tags[0], affect: lo.cloneDeep(equipConfig.affect) });
        yield put.resolve(action('syncData')({}));

        // 通知角色属性刷新
        DeviceEventEmitter.emit(EventKeys.USER_EQUIP_UPDATE);
        return true;
      }

      return false;
    },

    *removeEquip({ payload }, { put, select }) {
      const { equipId } = payload;
      if (!lo.isNumber(equipId) || equipId <= 0)
        return false;

      const userState = yield select(state => state.UserModel);

      const found = userState.equips.find(e => (e.id == equipId));
      if (found == undefined)
        return false;

      userState.equips = userState.equips.filter(e => (e.id != equipId));
      yield put.resolve(action('syncData')({}));

      // 归还锁定的道具
      yield put.resolve(action('PropsModel/sendProps')({ propId: equipId, num: 1, quiet: true }));

      // 通知角色属性刷新
      DeviceEventEmitter.emit(EventKeys.USER_EQUIP_UPDATE);
      return true;
    },

    *getEquipsEntity({}, { put, select }) {
      const userState = yield select(state => state.UserModel);

      if (lo.isArray(userState.equips) && userState.equips.length > 0) {
        const equips = [];
        for (let key in userState.equips) {
          const item = userState.equips[key];
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
      const userState = yield select(state => state.UserModel);
      yield call(LocalStorage.set, LocalCacheKeys.USER_DATA, userState);
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
