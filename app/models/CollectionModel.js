
import lo from 'lodash';
import EventListeners from '../utils/EventListeners';
import { GetCollectionDataApi } from '../services/GetCollectionDataApi';

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
      return collectionState.__data.config;
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
