
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
    data: {
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
      propsState.data.bags.length = 0;
      propsState.data.propsConfig.length = 0;

      if (data != undefined) {
        propsState.data.propsConfig.push(...data.props);
      }

      if (propsCache != null) {
        propsState.data.bags.push(...propsCache);
      } else {
        for (let key in propsState.data.propsConfig) {
          const item = propsState.data.propsConfig[key];
          propsState.data.bags.push(item);
        }
        yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.data.bags);
      }
    },

    *filter({ payload }, { put, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { type } = payload;

      propsState.listData.length = 0;
      for (let key in propsState.data.bags) {
        const item = propsState.data.bags[key];
        if ((item.attrs.indexOf(type) != -1) || (type == '全部') || type == '') {
          propsState.listData.push(item);
        }
      }

      yield put(action('updateState')({}));
    },

    *use({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const propsId = parseInt(payload.propsId);
      const num = parseInt(payload.num);

      const props = propsState.data.bags.find((e) => e.id == propsId);
      const config = propsState.data.propsConfig.find((e) => e.id == propsId);
      if (props == undefined) {
        Toast.show('道具不存在！');
        return;
      }

      if (props.num < num) {
        Toast.show('道具数量不足！');
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
        propsState.data.bags = propsState.data.bags.filter((e) => e.num > 0);
        propsState.listData = propsState.listData.filter((e) => e.num > 0);
      }

      Toast.show('使用成功！');
      yield put(action('updateState')({}));
      yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.data.bags);
    },

    *getPropsNum({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { propsId } = payload;

      const props = propsState.data.bags.find((e) => e.id == propsId);
      return (props != undefined) ? props.num : 0;
    },

    *sendProps({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const propsId = parseInt(payload.propsId);
      const num = parseInt(payload.num);

      const props = propsState.data.bags.find((e) => e.id == propsId);
      if (props == undefined) {
        Toast.show('道具不存在！');
        return;
      }

      props.num += num;
      Toast.show('获得道具！');
      yield put(action('updateState')({}));
      yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.data.bags);
    },

    *discard({ payload }, { put, call, select }) {
      const propsState = yield select(state => state.PropsModel);
      const { propsId } = payload;

      const props = propsState.data.bags.find((e) => e.id == propsId);
      if (props == undefined) {
        Toast.show('道具不存在！');
        return;
      }

      props.num = 0;
      propsState.data.bags = propsState.data.bags.filter((e) => e.num > 0);
      propsState.listData = propsState.listData.filter((e) => e.num > 0);

      Toast.show('道具已丢弃!');
      yield put(action('updateState')({}));
      yield call(LocalStorage.set, LocalCacheKeys.PROPS_DATA, propsState.data.bags);
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
