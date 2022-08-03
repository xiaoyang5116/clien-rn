
import { 
  action,
} from '../constants';

import { GetShopDataApi } from '../services/GetShopDataApi';
import EventListeners from '../utils/EventListeners';
import * as DateTime from '../utils/DateTimeUtils';
import lo from 'lodash';

export default {
  namespace: 'ShopModel',

  state: {
    __data: {
      shopConfig: {},  // 商店配置
    },
    //
    listData: [],
    // 下一次刷新时间
    refreshTime: 0,
  },

  effects: {
    *reload({ }, { put, select, call }) {
      const shopState = yield select(state => state.ShopModel);

      const shopConfig = yield call(GetShopDataApi);
      if (shopConfig != null) {
        shopState.__data.shopConfig = shopConfig.shop;
      }

      shopState.listData.length = 0;
      shopState.refreshTime = 0;
    },

    *buy({ payload }, { put, select, call }) {
      const shopState = yield select(state => state.ShopModel);
      const { propId } = payload;

      const found = shopState.listData.find(e => e.propId == propId);
      if (found == undefined || found.num <= 0)
        return false;

      yield put.resolve(action('PropsModel/sendProps')({ propId: propId, num: 1 }));
      found.num -= 1;
      
      return true;
    },

    *getList({ }, { put, select, call }) {
      const shopState = yield select(state => state.ShopModel);
      if (shopState.__data.shopConfig.cdValue <= 0)
        return null;
      
      if (shopState.refreshTime <= 0 || DateTime.now() >= shopState.refreshTime || lo.isEmpty(shopState.listData)) {
        shopState.listData = yield put.resolve(action('renew')());
        shopState.refreshTime = DateTime.now() + (shopState.__data.shopConfig.cdValue * 1000);
      }

      const data = [];
      if (shopState.listData.length > 0) {
        for (let key in shopState.listData) {
          const item = shopState.listData[key];
          const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: item.propId }));
          data.push({ ...item, propConfig: propConfig });
        }
      }

      return { timeout: shopState.refreshTime, data: data };
    },

    *renew({ }, { select, call }) {
      const shopState = yield select(state => state.ShopModel);
      if (lo.isEmpty(shopState.__data.shopConfig) || !lo.isArray(shopState.__data.shopConfig.list))
        return

      const newList = [];
      shopState.__data.shopConfig.list.forEach(x => {
        const rateTargets = [];
        if (x.rates.p100 != undefined) rateTargets.push(...x.rates.p100.map(e => ({ ...e, rate: e.rate * 100 })));
        if (x.rates.p1000 != undefined) rateTargets.push(...x.rates.p1000.map(e => ({ ...e, rate: e.rate * 10 })));
        if (x.rates.p10000 != undefined) rateTargets.push(...x.rates.p10000.map(e => ({ ...e })));

        rateTargets.sort((a, b) => b.rate - a.rate);
        let prevRange = 0;
        rateTargets.forEach(e => {
          e.range = [prevRange, prevRange + e.rate];
          prevRange = e.range[1];
        });

        const randValue = lo.random(0, prevRange, false);
        let hit = rateTargets.find(e => randValue >= e.range[0] && randValue < e.range[1]);
        if (hit == undefined) hit = rateTargets[rateTargets.length - 1];

        newList.push({ propId: x.propId, num: hit.num, config: lo.cloneDeep(x) });
      });

      return newList;
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
