
import { 
  action,
  DeviceEventEmitter,
  errorMessage,
  EventKeys,
  LocalCacheKeys,
} from '../constants';

import LocalStorage from '../utils/LocalStorage';
import { GetPropsDataApi } from '../services/GetPropsDataApi';
import { GetEquipsDataApi } from '../services/GetEquipsDataApi';
import EventListeners from '../utils/EventListeners';
import Toast from '../components/toast';
import lo from 'lodash';
import WorldUtils from '../utils/WorldUtils';

export default {
  namespace: 'PropsModel',

  state: {
    listData: [],
    worldId: 0, // 当前道具列表数据对应的世界ID（注意：非角色当前世界ID）

    __data: {
      propsConfig: [],  // 道具配置
      bags: [],         // 玩家背包
      recordId: 0,      // 道具/装备记录ID
    },
  },

  effects: {
    *reload({ }, { select, call }) {
      const propsState = yield select(state => state.PropsModel);
      const cache = yield call(LocalStorage.get, LocalCacheKeys.PROPS_DATA);

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

      // 过滤掉配置表的num字段
      for (let key in propsState.__data.propsConfig) {
        const item = propsState.__data.propsConfig[key];
        const filterObj = lo.pickBy(item, (v, k) => !lo.isEqual(k, 'num'));
        propsState.__data.propsConfig[key] = filterObj;
      }

      if (cache != null) {
        propsState.__data.bags.push(...cache);
        // 计算当前最大记录ID
        if (lo.isArray(cache)) {
          for (let key in cache) {
            const worldProps = cache[key];
            worldProps.forEach(e => {
              if (e.recordId > propsState.__data.recordId) {
                propsState.__data.recordId = e.recordId;
              }
            });
          }
        }
      } else {
        // 初始化三个世界的背包道具
        propsState.__data.bags.push(...[[], [], []]);
        yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
      }
    },

    *filter({ payload }, { put, select }) {
      const propsState = yield select(state => state.PropsModel);
      const userState = yield select(state => state.UserModel);
      const { type, worldId } = payload;
      
      const chooseWorldId = WorldUtils.isValidWorldId(worldId) 
            ? worldId 
            : userState.worldId;

      propsState.listData.length = 0;
      for (let key in propsState.__data.bags[chooseWorldId]) {
        const item = propsState.__data.bags[chooseWorldId][key];
        if ((item.attrs.indexOf(type) != -1) || (type == '全部') || type == '') {
          propsState.listData.push(item);
        }
      }

      propsState.worldId = chooseWorldId;
      yield put(action('updateState')({}));
    },

    *use({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const userState = yield select(state => state.UserModel);

      const propId = parseInt(payload.propId);
      const num = parseInt(payload.num);
      const quiet = payload.quiet != undefined && payload.quiet;

      const found = propsState.__data.bags[userState.worldId].find((e) => e.id == propId);
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
            yield put.resolve(action('UserModel/alterCopper')({ value: effect.copper }));
          } else if (effect.xiuwei != undefined && effect.xiuwei > 0) {
            yield put.resolve(action('XiuXingModel/addXiuWei')({ value: effect.xiuwei }));
          }
        }
      }

      if (found.num <= 0) {
        propsState.__data.bags[userState.worldId] = propsState.__data.bags[userState.worldId].filter((e) => e.num > 0);
        propsState.listData = propsState.listData.filter((e) => e.num > 0);
      }

      if (!quiet) Toast.show('使用成功！');

      yield put(action('updateState')({}));
      yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
      DeviceEventEmitter.emit(EventKeys.PROPS_NUM_CHANGED);
    },

    *reduce({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const userState = yield select(state => state.UserModel);

      if (lo.isArray(payload)) { // 数组内各项分别扣除 [{ propId: xxx, num: xxx }, { propId: xxx, num: xxx }, ...]
        // 检查背包道具是否足够
        let enough = true;
        for (let key in payload) {
          const { propId, num } = payload[key];
          const found = propsState.__data.bags[userState.worldId].find((e) => e.id == propId);
          if (found == undefined || found.num < num) {
            enough = false;
            break;
          }
        }

        // 道具不足
        if (!enough)
          return false;

        // 扣除道具
        for (let key in payload) {
          const { propId, num } = payload[key];
          const found = propsState.__data.bags[userState.worldId].find((e) => e.id == propId);
          if (found != undefined) {
            found.num -= num;
            if (found.num < 0)
              found.num = 0;
          }
        }
      } else if (lo.isObject(payload)) { // 支持按顺序优先扣除propsId数组内指定的道具
        const { propsId, num } = payload;
        if (!lo.isArray(propsId) || !lo.isNumber(num))
          return false;

        // 检查背包道具是否足够
        let totalNum = 0;
        for (let key in propsId) {
          const propId = propsId[key];
          const found = propsState.__data.bags[userState.worldId].find((e) => e.id == propId);
          if (found != undefined) totalNum += found.num;
        }

        // 道具不足
        if (totalNum < num)
          return false;

        // 扣除道具
        let reduceNum = num;
        for (let key in propsId) {
          const propId = propsId[key];
          const found = propsState.__data.bags[userState.worldId].find((e) => e.id == propId);
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
      } else {
        return false;
      }

      // 移除扣光的道具
      propsState.__data.bags[userState.worldId] = propsState.__data.bags[userState.worldId].filter((e) => e.num > 0);
      propsState.listData = propsState.listData.filter((e) => e.num > 0);

      yield put(action('updateState')({}));
      yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
      DeviceEventEmitter.emit(EventKeys.PROPS_NUM_CHANGED);
      return true;
    },

    *getPropNum({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const userState = yield select(state => state.UserModel);
      const { propId } = payload;

      let totalNum = 0;
      propsState.__data.bags[userState.worldId].forEach(e => {
        if (e.id == propId)
          totalNum += e.num;
      });

      return totalNum;
    },

    *getPropsNum({ payload }, { put, call, select }) {
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
      const userState = yield select(state => state.UserModel);
      const { attr } = payload;

      const props = [];
      for (let key in propsState.__data.bags[userState.worldId]) {
        const item = propsState.__data.bags[userState.worldId][key];
        if ((item.attrs.indexOf(attr) != -1) || lo.isEmpty(attr) || lo.isEqual(attr, '全部')) {
          props.push(item);
        }
      }

      return props;
    },

    *getBagProp({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const userState = yield select(state => state.UserModel);
      const { propId, always } = payload;

      const found = propsState.__data.bags[userState.worldId].find(e => e.id == propId);
      if (found != undefined) {
        return lo.cloneDeep(found);
      } else if ((always != undefined) && always) {
        const config = yield put.resolve(action('getPropConfig')({ propId }));
        return { ...config, num: 0 };
      }
      return null;
    },

    *getBagProps({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const userState = yield select(state => state.UserModel);
      const propsId = payload?.propsId || undefined;
      const always = payload?.always || false;

      if (propsId == undefined) {
        return lo.cloneDeep(propsState.__data.bags[userState.worldId]);
      } else if (lo.isArray(propsId)) {
        const result = [];
        for (let key in propsId) {
          const propId = propsId[key];
          const found = propsState.__data.bags[userState.worldId].find(e => e.id == propId);
          if (found != undefined) {
            result.push(lo.cloneDeep(found));
          } else if ((always != undefined) && always) {
            const config = yield put.resolve(action('getPropConfig')({ propId }));
            result.push({ ...config, num: 0 });
          }
        }
        return result;
      }
      return null;
    },

    *getPropConfig({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { propId } = payload;
      return propsState.__data.propsConfig.find((e) => e.id == propId);
    },

    *sendProps({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const userState = yield select(state => state.UserModel);

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

      const found = propsState.__data.bags[userState.worldId].find((e) => e.id == propId);
      if (config.stack != undefined && !config.stack) {
            // 不堆叠则分开几条记录
            for (let i = 0; i < num; i++) {
              propsState.__data.bags[userState.worldId].push({ recordId: propsState.__data.recordId + 1, ...config, num: 1 });
              propsState.__data.recordId += 1;
            }
      } else {
        if (found != undefined) {
          found.num += num;
        } else {
          const item = { recordId: propsState.__data.recordId + 1, ...config, num: num };
          propsState.__data.recordId += 1;
          propsState.__data.bags[userState.worldId].push(item);
        }
      }

      if (!batchPipeline) {
        if (!quiet)  Toast.show(`获得${config.name}*${num}`);
        yield put(action('updateState')({}));
        yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
        DeviceEventEmitter.emit(EventKeys.PROPS_NUM_CHANGED);
      }

      // 特殊类型道具发送消息通知
      if (config.attrs.indexOf('碎片') != -1) {
        yield put(action('_processFragmentCompose')({ propId }));
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
      DeviceEventEmitter.emit(EventKeys.PROPS_NUM_CHANGED);
    },

    *test({ }, { put, select }) {
      const propsState = yield select(state => state.PropsModel);

      const batchProps = [];
      propsState.__data.propsConfig.forEach(e => {
        batchProps.push({ propId: e.id, num: 10 });
      });

      yield put.resolve(action('sendPropsBatch')({ props: batchProps }));
    },

    *_processFragmentCompose({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const userState = yield select(state => state.UserModel);
      const { propId } = payload;

      const fragmentConfig = propsState.__data.propsConfig.find((e) => e.id == propId);
      if (fragmentConfig == undefined || fragmentConfig.composite == undefined)
        return

      const toPropConfig = propsState.__data.propsConfig.find((e) => e.id == fragmentConfig.composite.propId);
      if (toPropConfig == undefined)
        return

      const fragment = propsState.__data.bags[userState.worldId].find((e) => e.id == propId);
      if (fragment == undefined)
        return

      const toProp = propsState.__data.bags[userState.worldId].find((e) => e.id == fragmentConfig.composite.propId);
      if (toProp != undefined && toProp.num > 0) {
        return // 道具已经存在，不再自动合成
      }

      if ((fragment.num >= fragmentConfig.composite.requireNum)) {
        const _fragment = lo.cloneDeep(fragment);
        yield put.resolve(action('reduce')({ propsId: [propId], num: fragmentConfig.composite.requireNum, mode: 1 }));
        yield put.resolve(action('sendProps')({ propId: fragmentConfig.composite.propId, num: 1 }));
        DeviceEventEmitter.emit(EventKeys.GET_FRAGMENT_PROP, { fragment: _fragment, toPropConfig: toPropConfig });
      }
    },

    *discard({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const userState = yield select(state => state.UserModel);
      const { propId } = payload;

      const found = propsState.__data.bags[userState.worldId].find((e) => e.id == propId);
      if (found == undefined) {
        Toast.show('道具不存在！');
        return;
      }

      found.num = 0;
      propsState.__data.bags[userState.worldId] = propsState.__data.bags[userState.worldId].filter((e) => e.num > 0);
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
