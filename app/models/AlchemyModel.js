
import {
  action,
  LocalCacheKeys
} from '../constants';

import lo, { range } from 'lodash';
import { GetDanFangDataApi } from '../services/GetDanFangDataApi';

import EventListeners from '../utils/EventListeners';
import LocalStorage from '../utils/LocalStorage';
import Toast from '../components/toast';
import { now } from '../utils/DateTimeUtils';

export default {
  namespace: 'AlchemyModel',

  state: {
    danFangList: [],  // 丹方集合
    // danFangDetail: {
    //   id: null,  // 配方id
    //   stuffsDetail: [],  // 原材料
    //   propsDetail: [],  // 辅助材料
    //   targets: []  // 产品
    // }
  },

  effects: {
    *reload({ }, { select, put, call }) {

    },

    // 获取丹方列表
    *getDanFangList({ payload }, { call, put, select }) {
      const { rules } = yield call(GetDanFangDataApi);

      let validData = []
      let notValidData = []
      for (let i = 0; i < rules.length; i++) {
        const item = rules[i];
        let enough = true;
        // 判断原料
        for (let k in item.stuffs) {
          const stuff = item.stuffs[k];
          const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: stuff.id }));
          if (propNum < stuff.num) {
            enough = false;
            break;
          }
        }
        // 判断需求道具
        // if (enough) {
        //   for (let k in item.props) {
        //     const prop = item.props[k];
        //     const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: prop.id }));
        //     if (propNum < prop.num) {
        //       enough = false;
        //       break;
        //     }
        //   }
        // }
        if (enough) {
          validData.push({ ...item, valid: enough })
        } else {
          notValidData.push({ ...item, valid: enough })
        }
      }

      const newDanFangList = [...validData, ...notValidData]
      yield put(action("updateState")({ danFangList: newDanFangList }))
    },

    // 获取丹方详情
    *getDanFangDetail({ payload }, { call, put, select }) {
      const stuffsDetail = []
      for (let k in payload.stuffs) {
        const stuff = payload.stuffs[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: stuff.id }));
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: stuff.id }));
        stuffsDetail.push({ name: propConfig.name, reqNum: stuff.num, currNum: propNum });
      }

      const propsDetail = [];
      for (let k in payload.props) {
        const prop = payload.props[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: prop.id }));
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: prop.id }));
        propsDetail.push({ id: prop.id, name: propConfig.name, reqNum: prop.num, currNum: propNum });
      }

      const targets = [];
      for (let k in payload.targets) {
        const item = payload.targets[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: item.id }));
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: item.id }));
        targets.push({ name: propConfig.name, desc: propConfig.desc, currNum: propNum, productNum: item.num });
      }

      return {
        id: payload.id,
        stuffsDetail,
        propsDetail,
        targets,
      }
      // yield put(action('updateState')({
      //   danFangDetail: {
      //     id: payload.id,
      //     stuffsDetail,
      //     propsDetail,
      //     targets,
      //   },
      // }));
    }
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
    registerReloadEvent({ dispatch }) {
      EventListeners.register('reload', (msg) => {
        return dispatch({ 'type': 'reload' });
      });
    },
  }
}

function compareSort(property) {
  return function (obj1, obj2) {
    var value1 = obj1[property];
    var value2 = obj2[property];
    return value1 - value2;     // 升序
  }
}
