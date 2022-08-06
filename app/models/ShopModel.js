
import { 
  action, LocalCacheKeys,
} from '../constants';

import { GetShopDataApi } from '../services/GetShopDataApi';
import EventListeners from '../utils/EventListeners';
import * as DateTime from '../utils/DateTimeUtils';
import Toast from '../components/toast';
import lo from 'lodash';
import LocalStorage from '../utils/LocalStorage';

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

      const cache = yield call(LocalStorage.get, LocalCacheKeys.SHOP_DATA);
      if (cache != null) {
        shopState.listData.push(...cache.listData);
        shopState.refreshTime = cache.refreshTime;
      }
    },

    *buy({ payload }, { put, select, call }) {
      const shopState = yield select(state => state.ShopModel);
      const { propId } = payload;

      const found = shopState.listData.find(e => e.propId == propId);
      if (found == undefined || found.num <= 0)
        return false;

      // 扣除道具
      if (lo.isArray(found.config.consume)) {
        let enough = true;
        for (let key in found.config.consume) {
          const item = found.config.consume[key];

          let currentNum = 0;
          if (item.propId != undefined) {
            currentNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: item.propId }));
          }

          if (currentNum < item.num) {
            enough = false;
            break
          }
        }
        if (!enough) {
          Toast.show(`购买不成功，道具不足！`);
          return
        }

        // 扣除道具
        for (let key in found.config.consume) {
          const item = found.config.consume[key];
          yield put.resolve(action('PropsModel/reduce')({ propsId: [item.propId], num: 1, mode: 1 }));
        }
      }

      // 发放道具
      yield put.resolve(action('PropsModel/sendProps')({ propId: propId, num: 1 }));

      // 更新状态
      found.num -= 1;
      yield call(LocalStorage.set, LocalCacheKeys.SHOP_DATA, { listData: shopState.listData, refreshTime: shopState.refreshTime });

      return true;
    },

    *getList({ }, { put, select, call }) {
      const shopState = yield select(state => state.ShopModel);
      if (shopState.__data.shopConfig.cdValue <= 0)
        return null;
      
      if (shopState.refreshTime <= 0 || DateTime.now() >= shopState.refreshTime || lo.isEmpty(shopState.listData)) {
        shopState.listData = yield put.resolve(action('renew')());
        shopState.refreshTime = DateTime.now() + (shopState.__data.shopConfig.cdValue * 1000);
        //
        yield call(LocalStorage.set, LocalCacheKeys.SHOP_DATA, { listData: shopState.listData, refreshTime: shopState.refreshTime });
      }

      const data = [];
      if (shopState.listData.length > 0) {
        for (let key in shopState.listData) {
          const item = shopState.listData[key];
          if (lo.isArray(item.config.consume)) {
            for (let key in item.config.consume) {
              const kv = item.config.consume[key];
              const { propId } = kv;
              if (propId != undefined && kv.propConfig == undefined) { // 只加载一次
                const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: propId }));
                kv.propConfig = propConfig;
              }
            }
          }

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
