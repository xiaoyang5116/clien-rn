
import lo from 'lodash';
import EventListeners from '../utils/EventListeners';
import { GetCollectionDataApi } from '../services/GetCollectionDataApi';

import LocalStorage from '../utils/LocalStorage';

import { 
  action, LocalCacheKeys,
} from "../constants";

export default {
  namespace: 'CollectionModel',

  state: {
    __data: {
      config: [],   // 查看定义 collection.yml
    },

    // 收藏品
    items: [],
  },

  effects: {

    *reload({ }, { call, put, select }) {
      const collectionState = yield select(state => state.CollectionModel);

      const config = yield call(GetCollectionDataApi);
      if (config != null) {
        collectionState.__data.config = config.collections;
      }

      const cache = yield call(LocalStorage.get, LocalCacheKeys.COLLECTION_DATA);
      if (cache != null && lo.isArray(cache)) {
        collectionState.items.length = 0;
        collectionState.items.push(...cache);
      }
    },

    *getCollectionList({ }, { call, put, select }) {
      const collectionState = yield select(state => state.CollectionModel);

      let updateCache = false;
      for (let key in collectionState.__data.config) {
        const item = collectionState.__data.config[key];
        const found = collectionState.items.find(e => e.id == item.id);
        if (found != undefined)
          continue; // 已经初始化

        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: item.propId }));
        if (propNum <= 0)
          continue

        collectionState.items.push({
          ...item, 
          level: 0,       // 星级
          actived: false, // 是否已经激活
        });
        updateCache = true;
      }

      if (updateCache) {
        yield call(LocalStorage.set, LocalCacheKeys.COLLECTION_DATA, collectionState.items);
      }
      
      return collectionState.items;
    },

    *activate({ payload }, { call, put, select }) {
      const collectionState = yield select(state => state.CollectionModel);
      const userState = yield select(state => state.UserModel);
      const { id } = payload;

      const found = collectionState.items.find(e => e.id == id);
      if (found == undefined)
        return false;

      // 激活需要扣除铜币
      const upgradeItem = found.upgrade[0];
      if (upgradeItem.lv == 0 && upgradeItem.copper > 0 && userState.copper >= upgradeItem.copper) {
        yield put.resolve(action('UserModel/alertCopper')({ value: -upgradeItem.copper }));
      } else {
        return false;
      }

      found.actived = true;
      yield call(LocalStorage.set, LocalCacheKeys.COLLECTION_DATA, collectionState.items);
      
      return true;
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
