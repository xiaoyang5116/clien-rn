
import { 
  action,
} from "../constants";

import lo from 'lodash';

import * as DateTime from '../utils/DateTimeUtils';
import EventListeners from "../utils/EventListeners";

import { GetSkillDataApi } from '../services/GetSkillDataApi';
import { GetBuffDataApi } from '../services/GetBuffDataApi';

export default {
  namespace: 'SkillModel',

  state: {
  },

  effects: {

    *reload({ }, { call, put, select }) {
      const buffsConfig = yield call(GetBuffDataApi);
      const skillsConfig = yield call(GetSkillDataApi);
      console.debug(skillsConfig, buffsConfig);
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
