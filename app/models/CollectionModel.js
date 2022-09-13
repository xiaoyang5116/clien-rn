
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

    *getCollectionList({ payload }, { call, put, select }) {
      const collectionState = yield select(state => state.CollectionModel);
      const { category } = payload;

      let updateCache = false;
      for (let key in collectionState.__data.config.items) {
        const item = collectionState.__data.config.items[key];
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

      return collectionState.items.filter(e => lo.indexOf(e.categories, category) != -1);
    },

    *activate({ payload }, { call, put, select }) {
      const collectionState = yield select(state => state.CollectionModel);
      const userState = yield select(state => state.UserModel);
      const { id } = payload;

      const found = collectionState.items.find(e => e.id == id);
      if (found == undefined)
        return false;

      // 激活需要扣除铜币
      if (found.activation.copper > 0 && userState.copper >= found.activation.copper) {
        yield put.resolve(action('UserModel/alterCopper')({ value: -found.activation.copper }));
      } else {
        return false;
      }

      found.level = 1;
      found.actived = true;
      yield call(LocalStorage.set, LocalCacheKeys.COLLECTION_DATA, collectionState.items);
      
      return true;
    },

    *upgrade({ payload }, { call, put, select }) {
      const collectionState = yield select(state => state.CollectionModel);
      const userState = yield select(state => state.UserModel);
      const { id } = payload;

      const found = collectionState.items.find(e => e.id == id);
      if (found == undefined || !found.actived)
        return false;

      const upgradeItems = found.upgrade[found.level - 1].items;
      let currentItem = null;

      for (let key in upgradeItems) {
        const items = upgradeItems[key];
        let stop = false;
        for (let kk in items) {
          const item = items[kk];
          if (item.finished == undefined) {
            stop = true;
            currentItem = item;
            break
          }
        }
        if (stop) break;
      }
      
      if (currentItem == null)
        return false;

      // 扣除道具
      const success = yield put.resolve(action('PropsModel/reduce')(currentItem.props));
      if (!success) return false;
        
      // 标注已完成
      currentItem.finished = true;

      // 属性增加
      if (currentItem.attrs != undefined && lo.isArray(currentItem.attrs)) {
        lo.forEach(currentItem.attrs, (e) => {
          const foundAttr = lo.find(found.attrs, (x) => lo.isEqual(x.key, e.key));
          if (foundAttr != undefined) {
            foundAttr.value += e.value;
          }
        });
      }

      // 判断当前是卡位是否已经升满
      let full = true;
      lo.forEach(upgradeItems, (v, k) => {
        lo.forEach(v, (vv, kk) => {
          if (vv.finished == undefined || (lo.isBoolean(vv.finished) && !vv.finished)) {
            full = false;
          }
        });
      });

      // 复制一份数据返回，不包括升星的(用于显示最后状态)
      const result = lo.cloneDeep(found);
      if (full) result.__full = true;

      // 小阶段满级，升星
      if (full && (found.level < found.stars)) {
        found.level += 1;
      }

      yield call(LocalStorage.set, LocalCacheKeys.COLLECTION_DATA, collectionState.items);
      return result;
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
