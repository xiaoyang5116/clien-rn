
import { GetPropsDataApi } from '../services/GetPropsDataApi';

export default {
  namespace: 'PropsModel',

  state: {
    listData: [],
  },

  effects: {
    *reload({ }, { select, call }) {
      const propsState = yield select(state => state.PropsModel);
      const data = yield call(GetPropsDataApi);

      propsState.listData.length = 0;
      for (let key in data.props) {
        const item = data.props[key];
        propsState.listData.push(item);
      }
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
    setup({ dispatch }) {
      dispatch({ 'type':  'reload'});
    },
  }
}
