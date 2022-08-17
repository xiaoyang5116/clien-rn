
import lo from 'lodash';
import EventListeners from '../utils/EventListeners';
import { GetCollectionDataApi } from '../services/GetCollectionDataApi';

import { 
  action,
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
    },

    *getCollectionList({ }, { call, put, select }) {
      const collectionState = yield select(state => state.CollectionModel);

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
      }
      
      return collectionState.items;
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
