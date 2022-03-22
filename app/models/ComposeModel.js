
import { 
  action,
  LocalCacheKeys
} from '../constants';

import LocalStorage from '../utils/LocalStorage';
import { GetComposeDataApi } from '../services/GetComposeDataApi';
import Toast from '../components/toast';

export default {
  namespace: 'ComposeModel',

  state: {
    // 合成首页
    listData: [],

    // 合成详细页
    selectComposeId: -1,
    selectComposeDetail: null,

    data: {
      composeConfig: [],  // 配方配置
    },
  },

  effects: {
    *reload({ }, { select, put, call }) {
      const composeState = yield select(state => state.ComposeModel);
      const data = yield call(GetComposeDataApi);

      if (data != null) {
        composeState.data.composeConfig.push(...data.rules);
      }
    },

    *composeSelected({ payload }, { put, select }) {
      const composeState = yield select(state => state.ComposeModel);
      const { composeId } = payload;
      const detail = composeState.data.composeConfig.find(e => e.id == composeId);

      yield put(action('updateState')({ 
        selectComposeId: composeId,
        selectComposeDetail: detail,
      }));
    },

    *filter({ payload }, { put, select }) {
      const composeState = yield select(state => state.ComposeModel);
      const { type } = payload;

      composeState.listData.length = 0;
      for (let k in composeState.data.composeConfig) {
        const item = composeState.data.composeConfig[k];
        if ((item.attrs.indexOf(type) == -1) && (type != '全部') && (type != ''))
          continue;

        let enough = true;
        // 判断原料
        for (let k in item.stuffs) {
          const stuff = item.stuffs[k];
          const propsNum = yield put.resolve(action('PropsModel/getPropsNum')({ propsId: stuff.id }));
          if (propsNum < stuff.num) {
            enough = false;
            break;
          }
        }
        // 判断需求道具
        if (enough) {
          for (let k in item.props) {
            const prop = item.props[k];
            const propsNum = yield put.resolve(action('PropsModel/getPropsNum')({ propsId: prop.id }));
            if (propsNum < prop.num) {
              enough = false;
              break;
            }
          }
        }
        composeState.listData.push({ ...item, valid: enough });
      }

      yield put(action('updateState')({}));
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
