
import { 
  action,
  LocalCacheKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

export default {
  namespace: 'LotteryModel',

  state: {
    prop1Num: 123,
    prop2Num: 456,
  },

  effects: {

    *reload({ }, { call, put }) {
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
        dispatch({ 'type':  'reload'});
      });
    },
  }
}
