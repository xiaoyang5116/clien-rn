
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
      config: [], // ref collection.yml
    },
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

      const list = [];
      for (let key in collectionState.__data.config) {
        const item = collectionState.__data.config[key];
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: item.propId }));
        if (propNum <= 0)
          continue
        
        list.push(lo.cloneDeep(item));
      }
      
      return list;
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
