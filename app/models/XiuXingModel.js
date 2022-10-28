
import { 
  action,
  LocalCacheKeys,
  DeviceEventEmitter,
  EventKeys,
  errorMessage,
} from "../constants";

import lo from 'lodash';

import { 
  GetXiuXingDataApi 
} from '../services/GetXiuXingDataApi';

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import Toast from '../components/toast';
import * as DateTime from '../utils/DateTimeUtils';
import EffectAnimations from "../components/effects";

export default {
  namespace: 'XiuXingModel',

  state: {

    __data: {
      xiuxingConfig: [], // 修行配置
    },

    xiuxingStatus: { // 修行状态
      value: 0, // 当前修为值
      limit: 0, // 修行上限
      lastOnlineTime: 0, // 在线修为时间
      cdTime: 0,  // 突破失败后等待时间
    },
    
    xiuxingAttrs: [ // 修行属性(参与战斗计算)
      { key: '体力', value: 0 },
      { key: '防御', value: 0 },
      { key: '法力', value: 0 },
      { key: '攻击', value: 0 },
    ],

  },

  effects: {
    
    *reload({ }, { select, call, put }) {
      const xiuxingState = yield select(state => state.XiuXingModel);
      const cache = yield call(LocalStorage.get, LocalCacheKeys.XIUXING_DATA);

      // 修行配置
      const xiuxingConfig = yield call(GetXiuXingDataApi);
      if (xiuxingConfig != null) {
        xiuxingState.__data.xiuxingConfig.length = 0;

        const sortList = xiuxingConfig.xiuxing.sort((a, b) => a.limit - b.limit);
        xiuxingState.__data.xiuxingConfig.push(...sortList);
      }

      if (cache != null) {
        if (cache.xiuxingStatus != undefined) {
          // 缓存内必要数据重置
          cache.xiuxingStatus.lastOnlineTime = DateTime.now();
        }
        yield put(action('updateState')({ ...cache }));
      } else {
        if (xiuxingState.__data.xiuxingConfig.length > 0) {
          const first = xiuxingState.__data.xiuxingConfig[0];
          xiuxingState.xiuxingStatus.limit = first.limit;
          xiuxingState.xiuxingStatus.lastOnlineTime = DateTime.now();
        }
        yield put(action('updateState')({}));
      }
    },

    // 获得加成值
    *getAddValues({ payload }, { put, select }) {
      const xiuxingState = yield select(state => state.XiuXingModel);

      const all = [];
      if (lo.isArray(xiuxingState.xiuxingAttrs) && xiuxingState.xiuxingAttrs.length > 0) {
        lo.forEach(xiuxingState.xiuxingAttrs, (v) => {
          let key = v.key;
          if (lo.isEqual(key, '防御')) {
            key = '物理防御';
          } else if (lo.isEqual(key, '攻击')) {
            key = '物理攻击';
          }
          all.push({ key: key, value: v.value });
        });
      }

      return all;
    },

    // 添加修行值
    *addXiuWei({ payload }, { put, select }) {
      const xiuxingState = yield select(state => state.XiuXingModel);
      const { value } = payload;

      if (value == undefined || value == 0)
        return

      xiuxingState.xiuxingStatus.value += value;
      EffectAnimations.show({ id: 15, values:[`${value}`] })

      // 没有指定瓶颈和突破时 自动突破.
      let i = 0;
      while (xiuxingState.xiuxingStatus.value > xiuxingState.xiuxingStatus.limit) {
        let currentXiuXing = xiuxingState.__data.xiuxingConfig.find(e => e.limit == xiuxingState.xiuxingStatus.limit);

        let nextXiuXing = null;
        for (let key in xiuxingState.__data.xiuxingConfig) {
          const item = xiuxingState.__data.xiuxingConfig[key];
          if (item.limit > xiuxingState.xiuxingStatus.limit) {
            nextXiuXing = item;
            break
          }
        }

        if (!lo.isObject(currentXiuXing.tupo) && !lo.isObject(currentXiuXing.pingjing) && (nextXiuXing != null)) {
          xiuxingState.xiuxingStatus.value -= xiuxingState.xiuxingStatus.limit;
          xiuxingState.xiuxingStatus.limit = nextXiuXing.limit;
          currentXiuXing.attrs.forEach(e => {
            const found = xiuxingState.xiuxingAttrs.find(x => lo.isEqual(x.key, e.key));
            if (found != undefined) {
              found.value = e.value;
            }
          });
          if (lo.isBoolean(currentXiuXing.toastText) && currentXiuXing.toastText) {
            setTimeout(() => {
              EffectAnimations.show({ id: 16, period: nextXiuXing.period, level: nextXiuXing.level });
            }, i * 1000);
          }
        }

        // 防止错误无限循环
        if (i > 10) break;
        i++;
      }

      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
      
      // 通知角色属性刷新
      DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
    },

    // 突破修行
    *tupoXiuXing({ payload }, { put, select }) {
      const xiuxingState = yield select(state => state.XiuXingModel);
      const { prop } = payload;

      if (xiuxingState.xiuxingStatus.value < xiuxingState.xiuxingStatus.limit)
        return false;

      const currentXiuXing = xiuxingState.__data.xiuxingConfig.find(e => e.limit == xiuxingState.xiuxingStatus.limit);
      if (currentXiuXing == undefined || !lo.isObject(currentXiuXing.tupo))
        return false;

      let nextXiuXing = null;
      for (let key in xiuxingState.__data.xiuxingConfig) {
        const item = xiuxingState.__data.xiuxingConfig[key];
        if (item.limit > xiuxingState.xiuxingStatus.limit) {
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
        xiuxingState.xiuxingStatus.value -= xiuxingState.xiuxingStatus.limit;
        xiuxingState.xiuxingStatus.limit = nextXiuXing.limit;
        currentXiuXing.attrs.forEach(e => {
          const found = xiuxingState.xiuxingAttrs.find(x => lo.isEqual(x.key, e.key));
          if (found != undefined) {
            found.value = e.value;
          }
        });
      } else {
        console.debug(`突破失败，随机概率=${randomValue}, 当前概率=${currentXiuXing.tupo.successRate + propSuccessRate}`);
        xiuxingState.xiuxingStatus.cdTime = DateTime.now() + (currentXiuXing.tupo.failCDTime * 1000);
        success = false;
      }

      if (success) {
        if (lo.isBoolean(currentXiuXing.toastText) && currentXiuXing.toastText) {
          EffectAnimations.show({ id: 16, period: nextXiuXing.period, level: nextXiuXing.level });
        }
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
      const xiuxingState = yield select(state => state.XiuXingModel);

      if (xiuxingState.xiuxingStatus.value < xiuxingState.xiuxingStatus.limit)
        return false;

      const currentXiuXing = xiuxingState.__data.xiuxingConfig.find(e => e.limit == xiuxingState.xiuxingStatus.limit);
      if (currentXiuXing == undefined || !lo.isObject(currentXiuXing.pingjing))
        return false;

      let nextXiuXing = null;
      for (let key in xiuxingState.__data.xiuxingConfig) {
        const item = xiuxingState.__data.xiuxingConfig[key];
        if (item.limit > xiuxingState.xiuxingStatus.limit) {
          nextXiuXing = item;
          break
        }
      }

      if (nextXiuXing == null) {
        Toast.show('修行已满级!');
        return false;
      }

      // 扣除修为值
      xiuxingState.xiuxingStatus.value -= xiuxingState.xiuxingStatus.limit;
      xiuxingState.xiuxingStatus.limit = nextXiuXing.limit;
      currentXiuXing.attrs.forEach(e => {
        const found = xiuxingState.xiuxingAttrs.find(x => lo.isEqual(x.key, e.key));
        if (found != undefined) {
          found.value = e.value;
        }
      });

      //
      yield put(action('updateState')({}));
      yield put.resolve(action('syncData')({}));
      
      if (lo.isBoolean(currentXiuXing.toastText) && currentXiuXing.toastText) {
        EffectAnimations.show({ id: 16, period: nextXiuXing.period, level: nextXiuXing.level });
      } else {
        Toast.show('成功跨越瓶颈!');
      }
      return true;
    },

    // 检测在线修行
    *checkXiuXing({ payload }, { put, select }) {
      const xiuxingState = yield select(state => state.XiuXingModel);
      const currentXiuXing = xiuxingState.__data.xiuxingConfig.find(e => e.limit == xiuxingState.xiuxingStatus.limit);
      if (currentXiuXing == undefined)
        return 0;

      const diffMillis = DateTime.now() - xiuxingState.xiuxingStatus.lastOnlineTime;
      const seconds = Math.floor(diffMillis / 1000);
      if (seconds >= 10) { // 每10S刷新一次
        const addXiuWei = Math.ceil(currentXiuXing.increaseXiuXingPerMinute * seconds / 60);
        xiuxingState.xiuxingStatus.value += addXiuWei;
        xiuxingState.xiuxingStatus.lastOnlineTime = DateTime.now();

        yield put(action('updateState')({}));
        yield put.resolve(action('syncData')({}));
        
        // 通知角色属性刷新
        DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
        return addXiuWei;
      }

      return 0;
    },

    *syncData({ }, { select, call }) {
      const xiuxingState = yield select(state => state.XiuXingModel);
      const serialize = lo.pickBy(xiuxingState, (v, k) => {
        return !lo.isEqual(k, '__data');
      });
      yield call(LocalStorage.set, LocalCacheKeys.XIUXING_DATA, serialize);
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
