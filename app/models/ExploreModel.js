
import { 
  action,
} from "../constants";

import EventListeners from '../utils/EventListeners';

export default {
  namespace: 'ExploreModel',

  state: {
    __data: {
      lotteries_config: [],
    }
  },

  effects: {

    *reload({ }, { select, call, put }) {
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
