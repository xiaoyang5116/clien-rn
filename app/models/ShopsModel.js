
import { 
  action, LocalCacheKeys,
} from '../constants';

import { GetShopsDataApi } from '../services/GetShopsDataApi';
import EventListeners from '../utils/EventListeners';
import * as DateTime from '../utils/DateTimeUtils';
import Toast from '../components/toast';
import lo from 'lodash';
import LocalStorage from '../utils/LocalStorage';

function init_shop_data(shopId) {
  return { shopId: shopId, listData: [], refreshTime: 0 };
}

export default {
  namespace: 'ShopsModel',

  state: {
    __data: {
      shopsConfig: [], // 商店配置
    },
    shops: [],
  },

  effects: {
    *reload({ }, { put, select, call }) {
      const shopsState = yield select(state => state.ShopsModel);

      const shopsConfig = yield call(GetShopsDataApi);
      if (shopsConfig != null) {
        shopsState.__data.shopsConfig = shopsConfig.shops;
      }

      shopsState.shops.length = 0;
      const cache = yield call(LocalStorage.get, LocalCacheKeys.SHOPS_DATA);
      if (cache != null && lo.isArray(cache.shops)) {
        shopsState.shops.push(...cache.shops);
      }
    },

    *buy({ payload }, { put, select, call }) {
      const shopsState = yield select(state => state.ShopsModel);
      const userState = yield select(state => state.UserModel);
      const { shopId, propId } = payload;

      if (shopId == undefined || lo.isEmpty(shopId))
        return false;

      let shop = shopsState.shops.find(e => lo.isEqual(e.shopId, shopId));
      if (shop == undefined)
        return false;

      const found = shop.listData.find(e => e.propId == propId);
      if (found == undefined || found.num <= 0)
        return false;

      // 扣除道具
      if (lo.isArray(found.config.consume)) {
        let propsEnough = true, copperEnough = true;
        for (let key in found.config.consume) {
          const item = found.config.consume[key];

          if (item.propId != undefined) {
            const propsNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: item.propId }));
            if (propsNum < item.num) {
              propsEnough = false;
              break
            }
          }

          if (item.copper != undefined && item.copper > 0) {
            if (userState.copper < item.copper) {
              copperEnough = false;
              break
            }
          }
        }

        if (!propsEnough) {
          Toast.show(`购买不成功，道具不足！`);
          return
        }

        if (!copperEnough) {
          Toast.show(`购买不成功，铜币不足！`);
          return
        }

        // 扣除道具
        for (let key in found.config.consume) {
          const item = found.config.consume[key];
          if (item.propId != undefined) {
            yield put.resolve(action('PropsModel/reduce')({ propsId: [item.propId], num: 1, mode: 1 }));
          }
          if (item.copper != undefined && item.copper > 0) {
            yield put.resolve(action('UserModel/alterCopper')({ value: -Math.abs(item.copper) }));
          }
        }
      }

      // 发放道具
      yield put.resolve(action('PropsModel/sendProps')({ propId: propId, num: 1 }));

      // 更新状态
      found.num -= 1;
      yield call(LocalStorage.set, LocalCacheKeys.SHOPS_DATA, { shops: shopsState.shops });

      return true;
    },

    *getList({ payload }, { put, select, call }) {
      const shopsState = yield select(state => state.ShopsModel);
      const { shopId } = payload;

      if (shopId == undefined || lo.isEmpty(shopId))
        return null;

      const shopConfig = shopsState.__data.shopsConfig.find(e => lo.isEqual(e.id, shopId));
      if (shopConfig == undefined)
        return

      let shop = shopsState.shops.find(e => lo.isEqual(e.shopId, shopId));
      if (shop == undefined) {
        shop = init_shop_data(shopId);
        shopsState.shops.push(shop);
      }
      
      if (shop.refreshTime <= 0 || DateTime.now() >= shop.refreshTime || lo.isEmpty(shop.listData)) {
        shop.listData = yield put.resolve(action('renew')({ shopId }));
        shop.refreshTime = DateTime.now() + ((shopConfig.cdValue > 0 ? shopConfig.cdValue : (86400*365*100)) * 1000);
        yield call(LocalStorage.set, LocalCacheKeys.SHOPS_DATA, { shops: shopsState.shops });
      }

      const data = [];
      if (shop.listData.length > 0) {
        for (let key in shop.listData) {
          const item = shop.listData[key];
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

      return { timeout: shop.refreshTime, config: shopConfig, data: data };
    },

    *renew({ payload }, { select, call }) {
      const shopsState = yield select(state => state.ShopsModel);

      const { shopId } = payload;
      if (shopId == undefined || lo.isEmpty(shopId))
        return

      const shopConfig = shopsState.__data.shopsConfig.find(e => lo.isEqual(e.id, shopId));
      if (shopConfig == undefined)
        return

      const newList = [];
      shopConfig.list.forEach(x => {
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
