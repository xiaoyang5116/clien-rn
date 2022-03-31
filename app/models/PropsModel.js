
import { 
  action,
  LocalCacheKeys
} from '../constants';

import LocalStorage from '../utils/LocalStorage';
import { GetPropsDataApi } from '../services/GetPropsDataApi';
import Toast from '../components/toast';

export default {
  namespace: 'PropsModel',

  state: {
    listData: [],
    __data: {
      propsConfig: [],  // 道具配置
      bags: [],         // 玩家背包
    },
  },

  effects: {
    *reload({ }, { select, call }) {
      const propsState = yield select(state => state.PropsModel);
      const propsCache = yield call(LocalStorage.get, LocalCacheKeys.PROPS_DATA);
      const data = yield call(GetPropsDataApi);

      propsState.listData.length = 0;
      propsState.__data.bags.length = 0;
      propsState.__data.propsConfig.length = 0;

      if (data != undefined) {
        propsState.__data.propsConfig.push(...data.props);
      }

      if (propsCache != null) {
        propsState.__data.bags.push(...propsCache);
      } else {
        for (let key in propsState.__data.propsConfig) {
          const item = propsState.__data.propsConfig[key];
          propsState.__data.bags.push(item);
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

      const props = propsState.__data.bags.find((e) => e.id == propId);
      const config = propsState.__data.propsConfig.find((e) => e.id == propId);
      if (props == undefined) {
        if (!quiet) Toast.show('道具不存在！');
        return;
      }

      if (props.num < num) {
        if (!quiet) Toast.show('道具数量不足！');
        return;
      }

      props.num -= num;

      if (config.useEffects != undefined) {
        for (let key in config.useEffects) {
          const effect = config.useEffects[key];
          if (effect.copper != undefined && effect.copper > 0) {
            yield put.resolve(action('UserModel/alertCopper')({ value: effect.copper }));
          }
        }
      }

      if (props.num <= 0) {
        propsState.__data.bags = propsState.__data.bags.filter((e) => e.num > 0);
        propsState.listData = propsState.listData.filter((e) => e.num > 0);
      }

      if (!quiet) Toast.show('使用成功！');
      
      yield put(action('updateState')({}));
      yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
    },

    *getPropNum({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { propId } = payload;

      const props = propsState.__data.bags.find((e) => e.id == propId);
      return (props != undefined) ? props.num : 0;
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

      const config = propsState.__data.propsConfig.find((e) => e.id == propId);
      if (config == undefined) {
        if (!quiet) Toast.show('道具不存在！');
        return;
      }

      const props = propsState.__data.bags.find((e) => e.id == propId);
      if (props != undefined) {
        props.num += num;
      } else {
        const item = { ...config };
        item.num = num;
        propsState.__data.bags.push(item);
      }

      if (!quiet)  Toast.show('获得道具！');
      
      yield put(action('updateState')({}));
      yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.__data.bags);
    },

    *discard({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { propId } = payload;

      const props = propsState.__data.bags.find((e) => e.id == propId);
      if (props == undefined) {
        Toast.show('道具不存在！');
        return;
      }

      props.num = 0;
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
    setup({ dispatch }) {
      dispatch({ 'type':  'reload'});
    },
  }
}
