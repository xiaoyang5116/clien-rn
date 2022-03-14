
import {
  action,
  errorMessage
} from "../constants";

export default {
  namespace: 'PropsModel',

  state: {
    listData: [],
  },

  effects: {
    *reload({ payload }, { put, select }) {
      const propsState = yield select(state => state.PropsModel);

      const props = [
        { id: 1, name: '金创药', num: 10000, quality: 1, type: 0, tags: [], attrs: [], capacity: 1, desc: '回血100点' },
        { id: 2, name: '回魂草', num: 9988, desc: 'XXXXX' },
        { id: 3, name: '狼牙', num: 666 },
        { id: 4, name: '仙气', num: 100 },
        { id: 5, name: '一阶神石', num: 9, quality: 2 },
        { id: 6, name: '苹果', num: 999 },

        { id: 7, name: '金创药', num: 10000 },
        { id: 8, name: '回魂草', num: 9988 },
        { id: 9, name: '狼牙', num: 666 },
        { id: 10, name: '仙气', num: 100, quality: 3 },
        { id: 11, name: '一阶神石', num: 9 },
        { id: 12, name: '苹果', num: 999 },

        { id: 13, name: '金创药', num: 10000, quality: 1 },
        { id: 14, name: '回魂草', num: 9988 },
        { id: 15, name: '狼牙', num: 666 },
        { id: 16, name: '仙气', num: 100 },
        { id: 17, name: '一阶神石', num: 9, quality: 2 },
        { id: 18, name: '苹果', num: 999 },
      ];

      propsState.listData.length = 0;
      for (let key in props) {
        const item = props[key];
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
