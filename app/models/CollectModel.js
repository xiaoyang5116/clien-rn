
import { 
  action,
  LocalCacheKeys,
  DeviceEventEmitter,
  EventKeys,
} from "../constants";

import lo from 'lodash';

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

const pxWidth = 1000; // 像素宽度
const pxHeight = 1300; // 像素高度
const pxGridWidth = 150;  // 格子像素宽度
const pxGridHeight = 150; // 格子像素高度

const maxColumns = Math.floor(pxWidth / pxGridWidth);
const maxRows = Math.floor(pxHeight / pxGridHeight);

export default {
  namespace: 'CollectModel',

  state: {
    gridData: [],
  },

  effects: {
    *reload({ }, { call, put }) {
    },

    *generateGridData({}, { call, put }) {
      const array = lo.range(maxColumns * maxRows);
      const hitList = [];
    
      for (let i = 0; i < 16; i++) {
        while (true) {
          const newArray = lo.shuffle(array);
          const hitValue = newArray[0];
          if (lo.indexOf(hitList, hitValue) == -1) {
            // 过滤：横竖三个不能连一线
            if (lo.indexOf(hitList, hitValue + 1) != -1 && lo.indexOf(hitList, hitValue + 2) != -1) continue;
            if (lo.indexOf(hitList, hitValue - 1) != -1 && lo.indexOf(hitList, hitValue + 1) != -1) continue;
            if (lo.indexOf(hitList, hitValue - 2) != -1 && lo.indexOf(hitList, hitValue - 1) != -1) continue;
            if (lo.indexOf(hitList, hitValue + maxColumns * 1) != -1 && lo.indexOf(hitList, hitValue + maxColumns * 2) != -1) continue;
            if (lo.indexOf(hitList, hitValue - maxColumns * 1) != -1 && lo.indexOf(hitList, hitValue + maxColumns * 1) != -1) continue;
            if (lo.indexOf(hitList, hitValue - maxColumns * 2) != -1 && lo.indexOf(hitList, hitValue - maxColumns * 1) != -1) continue;
            // 过滤： 四周密集度
            const a1 = lo.indexOf(hitList, hitValue - maxColumns) != -1 ? 1 : 0;
            const a2 = lo.indexOf(hitList, hitValue + maxColumns) != -1 ? 1 : 0;
            const a3 = lo.indexOf(hitList, hitValue - 1) != -1 ? 1 : 0;
            const a4 = lo.indexOf(hitList, hitValue + 1) != -1 ? 1 : 0;
            const a5 = lo.indexOf(hitList, hitValue - maxColumns - 1) != -1 ? 1 : 0;
            const a6 = lo.indexOf(hitList, hitValue - maxColumns + 1) != -1 ? 1 : 0;
            const a7 = lo.indexOf(hitList, hitValue + maxColumns - 1) != -1 ? 1 : 0;
            const a8 = lo.indexOf(hitList, hitValue + maxColumns + 1) != -1 ? 1 : 0;
            const aa = a1 + a2 + a3 + a4 + a5 + a6 + a7 + a8;
            if (aa > 4) continue;
            //
            hitList.push(hitValue);
            break;
          }
        }
      }
      
      return hitList;
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
