
import { 
  action,
  errorMessage,
  LocalCacheKeys,
} from '../constants';

import LocalStorage from '../utils/LocalStorage';
import { GetPropsDataApi } from '../services/GetPropsDataApi';
import { GetEquipsDataApi } from '../services/GetEquipsDataApi';
import EventListeners from '../utils/EventListeners';
import Toast from '../components/toast';
import lo from 'lodash';

export default {
  namespace: 'PropsModel',

  state: {
    listData: [],
    __data: {
      propsConfig: [],  // 道具配置
      bags: [],         // 玩家背包
      recordId: 0,      // 道具/装备记录ID
    },
  },

  effects: {
    *reload({ }, { select, call }) {
      const propsState = yield select(state => state.PropsModel);
      const propsCache = yield call(LocalStorage.get, LocalCacheKeys.PROPS_DATA);

      propsState.listData.length = 0;
      propsState.__data.bags.length = 0;
      propsState.__data.propsConfig.length = 0;

      const propsData = yield call(GetPropsDataApi);
      if (propsData != undefined) {
        propsState.__data.propsConfig.push(...propsData.props);
      }

      const equipsData = yield call(GetEquipsDataApi);
      if (equipsData != undefined) {
        propsState.__data.propsConfig.push(...equipsData.equips);
      }

      if (propsCache != null) {
        propsState.__data.bags.push(...propsCache);
        // 计算当前最大记录ID
        if (lo.isArray(propsCache)) {
          propsCache.forEach(e => {
            if (e.recordId > propsState.__data.recordId) {
              propsState.__data.recordId = e.recordId;
            }
          });
        }
      } else {
        for (let key in propsState.__data.propsConfig) {
          const item = propsState.__data.propsConfig[key];
          if (item.num <= 0)
            continue

          if (item.stack != undefined && !item.stack) {
            // 不堆叠则分开几条记录
            for (let i = 0; i < item.num; i++) {
              propsState.__data.bags.push({ recordId: propsState.__data.recordId + 1, ...item, num: 1 });
              propsState.__data.recordId += 1;
            }
          } else {
            propsState.__data.bags.push({ recordId: propsState.__data.recordId + 1, ...item });
            propsState.__data.recordId += 1;
          }
        }
        yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
      }
    },

    *filter({ payload }, { put, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { type } = payload;

      propsState.listData.length = 0;
      for (let key in propsState.__data.bags) {
        const item = propsState.__data.bags[key];
        if ((item.attrs.indexOf(type) != -1) || (type == '全部') || type == '') {
          propsState.listData.push(item);
        }
      }

      yield put(action('updateState')({}));
    },

    *use({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const propId = parseInt(payload.propId);
      const num = parseInt(payload.num);
      const quiet = payload.quiet != undefined && payload.quiet;

      const found = propsState.__data.bags.find((e) => e.id == propId);
      const config = propsState.__data.propsConfig.find((e) => e.id == propId);
      if (found == undefined || config == undefined) {
        if (!quiet) Toast.show('道具不存在！');
        return;
      }

      if (found.num < num) {
        if (!quiet) Toast.show('道具数量不足！');
        return;
      }

      found.num -= num;

      if (config.useEffects != undefined) {
        for (let key in config.useEffects) {
          const effect = config.useEffects[key];
          if (effect.copper != undefined && effect.copper > 0) {
            yield put.resolve(action('UserModel/alertCopper')({ value: effect.copper }));
          }
        }
      }

      if (found.num <= 0) {
        propsState.__data.bags = propsState.__data.bags.filter((e) => e.num > 0);
        propsState.listData = propsState.listData.filter((e) => e.num > 0);
      }

      if (!quiet) Toast.show('使用成功！');

      yield put(action('updateState')({}));
      yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
    },

    *reduce({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { propsId, num, mode } = payload;

      if (!lo.isArray(propsId) || num == undefined || mode == null) {
        errorMessage('PropsModel.reduce 参数异常!');
        return false;
      }
      
      if (mode == 1) { // 模式1: 按顺序优先扣除
        // 检查背包道具是否足够
        let totalNum = 0;
        for (let key in propsId) {
          const propId = propsId[key];
          const found = propsState.__data.bags.find((e) => e.id == propId);
          if (found != undefined) totalNum += found.num;
        }

        // 道具不足
        if (totalNum < num)
          return false;

        // 扣除道具
        let reduceNum = num;
        for (let key in propsId) {
          const propId = propsId[key];
          const found = propsState.__data.bags.find((e) => e.id == propId);
          if (found != undefined) {
            if (found.num >= reduceNum) {
              found.num -= reduceNum;
              break;
            } else {
              reduceNum -= found.num;
              found.num = 0;
            }
          }
        }

        // 移除扣光的道具
        propsState.__data.bags = propsState.__data.bags.filter((e) => e.num > 0);
        propsState.listData = propsState.listData.filter((e) => e.num > 0);

        yield put(action('updateState')({}));
        yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
        return true;
      }

      return false;
    },

    *getPropNum({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { propId } = payload;

      let totalNum = 0;
      propsState.__data.bags.forEach(e => {
        if (e.id == propId)
          totalNum += e.num;
      });

      return totalNum;
    },

    *getPropsNum({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { propsId } = payload;

      const result = [];
      if (lo.isArray(propsId)) {
        for (let key in propsId) {
          const propId = propsId[key];
          const num = yield put.resolve(action('getPropNum')({ propId: propId }));
          result.push({ propId: propId, num: num });
        }
      }

      return result;
    },

    *getPropsFromAttr({ payload }, { put, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { attr } = payload;

      const props = [];
      for (let key in propsState.__data.bags) {
        const item = propsState.__data.bags[key];
        if ((item.attrs.indexOf(attr) != -1) || (attr == '全部') || attr == '') {
          props.push(item);
        }
      }

      return props;
    },

    *getBagProps({}, { select }) {
      const propsState = yield select(state => state.PropsModel);
      return propsState.__data.bags;
    },

    *getPropConfig({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { propId } = payload;
      return propsState.__data.propsConfig.find((e) => e.id == propId);
    },

    *sendProps({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const propId = parseInt(payload.propId);
      const num = parseInt(payload.num);
      const quiet = payload.quiet != undefined && payload.quiet;

      // 批量处理流水线不提交同步，将由调用方负责持久化
      const batchPipeline = payload.batchPipeline != undefined && payload.batchPipeline;

      const config = propsState.__data.propsConfig.find((e) => e.id == propId);
      if (config == undefined) {
        if (!quiet) Toast.show('道具不存在！');
        return;
      }

      const found = propsState.__data.bags.find((e) => e.id == propId);
      if (config.stack != undefined && !config.stack) {
            // 不堆叠则分开几条记录
            for (let i = 0; i < num; i++) {
              propsState.__data.bags.push({ recordId: propsState.__data.recordId + 1, ...config, num: 1 });
              propsState.__data.recordId += 1;
            }
      } else {
        if (found != undefined) {
          found.num += num;
        } else {
          const item = { recordId: propsState.__data.recordId + 1, ...config, num: num };
          propsState.__data.recordId += 1;
          propsState.__data.bags.push(item);
        }
      }

      if (!batchPipeline) {
        if (!quiet)  Toast.show(`获得${config.name}*${num}`);
        yield put(action('updateState')({}));
        yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
      }
    },

    *sendPropsBatch({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { props } = payload; // [{ propId: xxx, num: xxx }, ...]

      if (lo.isArray(props)) {
        for (let key in props) {
          const item = props[key];
          yield put.resolve(action('sendProps')({ propId: item.propId, num: item.num, batchPipeline: true }));
        }
      }
      
      yield put(action('updateState')({}));
      yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
    },

    *discard({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { propId } = payload;

      const found = propsState.__data.bags.find((e) => e.id == propId);
      if (found == undefined) {
        Toast.show('道具不存在！');
        return;
      }

      found.num = 0;
      propsState.__data.bags = propsState.__data.bags.filter((e) => e.num > 0);
      propsState.listData = propsState.listData.filter((e) => e.num > 0);

      Toast.show('道具已丢弃!');
      yield put(action('updateState')({}));
      yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
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
        return dispatch({ 'type':  'reload'});
      });
    },
  }
}
