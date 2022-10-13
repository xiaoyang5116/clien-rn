
import { 
  action,
  LocalCacheKeys,
  DeviceEventEmitter,
  EventKeys,
  errorMessage,
} from "../constants";

import lo from 'lodash';

import { 
  GetAttrsDataApi 
} from '../services/GetAttrsDataApi';

import { 
  GetXiuXingDataApi 
} from '../services/GetXiuXingDataApi';

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import Toast from '../components/toast';
import * as DateTime from '../utils/DateTimeUtils';
import WorldUtils from "../utils/WorldUtils";

export default {
  namespace: 'UserModel',

  state: {

    __data: {
      xiuxingConfig: [], // 修行配置
    },

    sceneId: '',  // 当前场景ID(该状态在异步操作中状态不确定，请使用__sceneId)
    prevSceneId: '',  // 前一个场景ID
    worldId: 0, // 用户当前世界ID

    copper: 0,  // 铜币数量
    attrs: [], // 普通属性（阅读器）
    equips: [], // 身上的装备

    xiuxingStatus: { // 修行状态
      value: 0, // 当前修为值
      limit: 0, // 修行上限
      lastOnlineTime: 0, // 在线修为时间
      cdTime: 0,  // 突破失败后等待时间
    },
    
    xiuxingAttrs: [ // 修行属性
      { key: '体力', value: 0 },
      { key: '防御', value: 0 },
      { key: '法力', value: 0 },
      { key: '攻击', value: 0 },
    ],

    persistedStates: [], // 持久状态，记录一次性状态, 值为KEY
  },

  effects: {
    
    *reload({ }, { select, call, put }) {
      const userState = yield select(state => state.UserModel);

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

      // 修行配置
      const xiuxingConfig = yield call(GetXiuXingDataApi);
      if (xiuxingConfig != null) {
        userState.__data.xiuxingConfig.length = 0;

        const sortList = xiuxingConfig.xiuxing.sort((a, b) => a.limit - b.limit);
        userState.__data.xiuxingConfig.push(...sortList);
      }

      if (userCache != null) {
        if (userCache.xiuxingStatus != undefined) {
          // 缓存内必要数据重置
          userCache.xiuxingStatus.lastOnlineTime = DateTime.now();
        }
        yield put(action('updateState')({ ...userCache }));
      } else {
        if (userState.__data.xiuxingConfig.length > 0) {
          const first = userState.__data.xiuxingConfig[0];
          userState.xiuxingStatus.limit = first.limit;
          userState.xiuxingStatus.lastOnlineTime = DateTime.now();
        }
        yield put(action('updateState')({ attrs: userAttrs }));
      }
    },

    // 修改铜币属性
    *alterCopper({ payload }, { put, call, select }) {
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

    // 修改阅读器属性
    *alterAttrs({ payload }, { put, call, select }) {
      const userState = yield select(state => state.UserModel);
      
      let messages = []
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
          // entry.value = (entry.value < 0) ? 0 : entry.value;
          messages.push({
            key:e.key,
            value: entry.value,
            changeValue: e.value
          })
      });

      // 提示属性改变
      yield put(action('ToastModel/toastShow')({ messages, type: "attr" }));

      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
      
      // 通知角色属性刷新
      DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
    },

    // 阅读器属性
    *getAttrs({}, { select }) {
      const userState = yield select(state => state.UserModel);
      return userState.attrs;
    },

    // 世界设置
    *setWorld({ payload }, { put, call, select }) {
      const userState = yield select(state => state.UserModel);
      const { name } = payload;
      const worldId = WorldUtils.getWorldIdByName(name);

      if (worldId < 0) {
        errorMessage('世界设置错误，请检查世界名称！');
        return
      }

      if (worldId == userState.worldId)
        return // 没更改

      userState.worldId = worldId;
      
      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
    },

    // 添加修行值
    *addXiuXing({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const { value } = payload;

      if (value == undefined || value == 0)
        return

      userState.xiuxingStatus.value += value;

      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
      
      // 通知角色属性刷新
      DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
    },

    // 突破修行
    *tupoXiuXing({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const { prop } = payload;

      if (userState.xiuxingStatus.value < userState.xiuxingStatus.limit)
        return false;

      const currentXiuXing = userState.__data.xiuxingConfig.find(e => e.limit == userState.xiuxingStatus.limit);
      if (currentXiuXing == undefined)
        return false;

      let nextXiuXing = null;
      for (let key in userState.__data.xiuxingConfig) {
        const item = userState.__data.xiuxingConfig[key];
        if (item.limit > userState.xiuxingStatus.limit) {
          nextXiuXing = item;
          break
        }
      }

      if (nextXiuXing == null) {
        Toast.show('修行已满级!');
        return false;
      }

      // 检测关键道具
      if (currentXiuXing.tupo.props != undefined && lo.isArray(currentXiuXing.tupo.props)) {
        const propsId = [];
        lo.forEach(currentXiuXing.tupo.props, (v, k) => {
            propsId.push(v.propId);
        });
        if (propsId.length > 0) {
          let failure = false;
          let found = null;
          let needNum = 0;
          const result = yield put.resolve(action('PropsModel/getBagProps')({ propsId: propsId, always: true }));
          for (let key in currentXiuXing.tupo.props) {
            const { propId, num } = currentXiuXing.tupo.props[key];
            found = lo.find(result, (v) => (v.id == propId));
            if (found == undefined || found.num < num) {
              failure = true;
              needNum = num;
              break;
            }
          }
          if (failure) {
            Toast.show(`关键道具数量不足, ${found.name}x${needNum}`);
            return false;
          }
        }
      }

      // 选择了突破丹
      let propSuccessRate = 0;
      if (prop != undefined && prop != null) {
        const result = yield put.resolve(action('PropsModel/reduce')({ propsId: [ prop.id ], num: 1 }));
        if (result) {
          propSuccessRate = prop.incSuccessRate;
        }
      }

      // 扣除关键道具
      if (currentXiuXing.tupo.props != undefined && lo.isArray(currentXiuXing.tupo.props)) {
        yield put.resolve(action('PropsModel/reduce')(currentXiuXing.tupo.props));
      }

      let success = true;
      const randomValue = lo.random(100);
      if (randomValue <= (currentXiuXing.tupo.successRate + propSuccessRate)) {
        userState.xiuxingStatus.value -= userState.xiuxingStatus.limit;
        userState.xiuxingStatus.limit = nextXiuXing.limit;
        currentXiuXing.attrs.forEach(e => {
          const found = userState.xiuxingAttrs.find(x => lo.isEqual(x.key, e.key));
          if (found != undefined) {
            found.value = e.value;
          }
        });
      } else {
        console.debug(`突破失败，随机概率=${randomValue}, 当前概率=${currentXiuXing.tupo.successRate + propSuccessRate}`);
        userState.xiuxingStatus.cdTime = DateTime.now() + (currentXiuXing.tupo.failCDTime * 1000);
        success = false;
      }

      if (success) {
        Toast.show('突破成功!');
      } else {
        Toast.show('突破失败');
      }

      //
      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
      
      // 通知角色属性刷新
      DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
      return { success };
    },

    // 修行瓶颈
    *pingJingXiuXing({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);

      if (userState.xiuxingStatus.value < userState.xiuxingStatus.limit)
        return false;

      const currentXiuXing = userState.__data.xiuxingConfig.find(e => e.limit == userState.xiuxingStatus.limit);
      if (currentXiuXing == undefined)
        return false;

      let nextXiuXing = null;
      for (let key in userState.__data.xiuxingConfig) {
        const item = userState.__data.xiuxingConfig[key];
        if (item.limit > userState.xiuxingStatus.limit) {
          nextXiuXing = item;
          break
        }
      }

      if (nextXiuXing == null) {
        Toast.show('修行已满级!');
        return false;
      }

      // 扣除修为值
      userState.xiuxingStatus.value -= userState.xiuxingStatus.limit;
      userState.xiuxingStatus.limit = nextXiuXing.limit;
      currentXiuXing.attrs.forEach(e => {
        const found = userState.xiuxingAttrs.find(x => lo.isEqual(x.key, e.key));
        if (found != undefined) {
          found.value = e.value;
        }
      });

      //
      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
      
      Toast.show('成功跨越瓶颈!');
      return true;
    },

    // 检测在线修行
    *checkXiuXing({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const currentXiuXing = userState.__data.xiuxingConfig.find(e => e.limit == userState.xiuxingStatus.limit);
      if (currentXiuXing == undefined)
        return 0;

      const diffMillis = DateTime.now() - userState.xiuxingStatus.lastOnlineTime;
      const seconds = Math.floor(diffMillis / 1000);
      if (seconds >= 10) { // 每10S刷新一次
        const addXiuXing = Math.ceil(currentXiuXing.increaseXiuXingPerMinute * seconds / 60);
        userState.xiuxingStatus.value += addXiuXing;
        userState.xiuxingStatus.lastOnlineTime = DateTime.now();

        yield put(action('updateState')({}));
        yield put.resolve(action('syncData')({}));
        
        // 通知角色属性刷新
        DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
        return addXiuXing;
      }

      return 0;
    },

    // 获取合并属性值(装备、修行等)
    *getMergeAttrs({}, { select }) {
      const userState = yield select(state => state.UserModel);

      const all = [];

      // 装备
      if (lo.isArray(userState.equips) && userState.equips.length > 0) {
        lo.forEach(userState.equips, (v) => {
          all.push(...v.affect);
        });
      }

      // 修行
      if (lo.isArray(userState.xiuxingAttrs) && userState.xiuxingAttrs.length > 0) {
        lo.forEach(userState.xiuxingAttrs, (v) => {
          let key = v.key;
          if (lo.isEqual(key, '防御')) {
            key = '普通防御';
          } else if (lo.isEqual(key, '攻击')) {
            key = '普通攻击';
          }
          all.push({ key: key, value: v.value });
        });
      }

      let result = [];
      all.forEach(e => {
        const found = result.find(x => lo.isEqual(x.key, e.key));
        if (found != undefined) {
          found.value += e.value;
        } else {
          result.push({ ...e });
        }
      });

      return result;
    },

    // 穿戴装备
    *addEquip({ payload }, { put, select }) {
      const userState = yield select(state => state.UserModel);
      const { equipId } = payload;
      
      if (!lo.isNumber(equipId) || equipId <= 0)
        return false;

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
      const status = yield put.resolve(action('PropsModel/reduce')({ propsId: [equipId], num: 1 }));
      if (status) {
        // tags[0] = 部位标签
        userState.equips.push({ id: equipId, tag: equipConfig.tags[0], affect: lo.cloneDeep(equipConfig.affect) });
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

      const userState = yield select(state => state.UserModel);

      const found = userState.equips.find(e => (e.id == equipId));
      if (found == undefined)
        return false;

      userState.equips = userState.equips.filter(e => (e.id != equipId));
      yield put.resolve(action('syncData')({}));

      // 归还锁定的道具
      yield put.resolve(action('PropsModel/sendProps')({ propId: equipId, num: 1, quiet: true }));

      // 通知角色属性刷新
      DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
      return true;
    },

    // 获取身上的装备
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

    *hasPersistedState({ payload }, { select, call, put }) {
      const userState = yield select(state => state.UserModel);
      const { key } = payload;
      return lo.indexOf(userState.persistedStates, key) != -1;
    },

    *havePersistedStates({ payload }, { select, call, put }) {
      const userState = yield select(state => state.UserModel);
      const { keys } = payload;
      
      const result = [];
      if (lo.isArray(keys)) {
        lo.forEach(keys, (k) => {
          if (lo.indexOf(userState.persistedStates, k) != -1) {
            result.push(k);
          }
        });
      }
      return result;
    },

    *setPersistedState({ payload }, { select, call, put }) {
      const userState = yield select(state => state.UserModel);
      const { key } = payload;

      if (lo.indexOf(userState.persistedStates, key) == -1) {
        userState.persistedStates.push(key);
        yield put.resolve(action('syncData')({}));
      }
    },

    *checkAndSetPersistedState({ payload }, { select, call, put }) {
      const { key } = payload;
      const v = yield put.resolve(action('hasPersistedState')({ key }));
      if (!v) {
        yield put.resolve(action('setPersistedState')({ key }));
        return true;
      }
      return false;
    },

    *syncData({ }, { select, call }) {
      const userState = yield select(state => state.UserModel);
      const serialize = lo.pickBy(userState, (v, k) => {
        return !lo.isEqual(k, '__data');
      });
      yield call(LocalStorage.set, LocalCacheKeys.USER_DATA, serialize);
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
