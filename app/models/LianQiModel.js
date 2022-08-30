
import {
  action,
  LocalCacheKeys,
  BOTTOM_TOP_SMOOTH
} from '../constants';

import lo, { range } from 'lodash';
import { GetLianQiTuzhiApi } from '../services/GetLianQiTuzhiApi';

import EventListeners from '../utils/EventListeners';
import LocalStorage from '../utils/LocalStorage';
import Toast from '../components/toast';
import { now } from '../utils/DateTimeUtils';

export default {
  namespace: 'LianQiModel',

  state: {
    lianQiTuZhiList: [],  // 炼器图纸集合
    lianQiTuZhiConfig: [],  // 炼器图纸配置数据
    lianQiData: null,  // 炼器数据
  },

  effects: {
    *reload({ }, { select, put, call }) {
      // 挂载炼器数据
      const storageLianQiData = yield call(LocalStorage.get, LocalCacheKeys.LIANQI_DATA);
      yield put(action('updateState')({ lianQiData: storageLianQiData }))
    },

    // 获取炼器图纸列表
    *getLianQiTuZhiList({ payload }, { call, put, select }) {
      const { rules } = yield call(GetLianQiTuzhiApi);

      let validData = []
      let notValidData = []
      for (let i = 0; i < rules.length; i++) {
        const item = rules[i];
        let enough = true;

        // 道具配置
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: item.propId }));

        // 判断原料
        for (let k in item.stuffs) {
          const stuff = item.stuffs[k];
          const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: stuff.id }));
          if (propNum < stuff.num) {
            enough = false;
            break;
          }
        }

        if (enough) {
          validData.push({ ...item, valid: enough, iconId: propConfig.iconId })
        } else {
          notValidData.push({ ...item, valid: enough, iconId: propConfig.iconId })
        }
      }

      const lianQiTuZhiList = [...validData, ...notValidData]
      yield put(action("updateState")({ lianQiTuZhiList, lianQiTuZhiConfig: rules }))
    },

    // 获取炼器图纸详情
    *getLianQiTuZhiDetail({ payload }, { call, put, select }) {
      const stuffsDetail = []
      for (let k in payload.stuffs) {
        const stuff = payload.stuffs[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: stuff.id }));
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: stuff.id }));
        stuffsDetail.push({ propId: stuff.id, name: propConfig.name, reqNum: stuff.num, currNum: propNum, iconId: propConfig.iconId, quality: propConfig.quality });
      }

      const propsDetail = [];
      for (let k in payload.props) {
        const prop = payload.props[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: prop.id }));
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: prop.id }));
        propsDetail.push({ propId: prop.id, name: propConfig.name, reqNum: prop.num, currNum: propNum, iconId: propConfig.iconId, quality: propConfig.quality });
      }

      const targets = [];
      for (let k in payload.targets) {
        const item = payload.targets[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: item.id }));
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: item.id }));
        targets.push({ propId: item.id, name: propConfig.name, desc: propConfig.desc, currNum: propNum, productNum: item.num, iconId: propConfig.iconId, quality: propConfig.quality });
      }

      return {
        id: payload.id,
        stuffsDetail,
        propsDetail,
        targets,
      }
    },

    // 获取可以炼制的数量
    *getRefiningNum({ payload }, { call, put, select }) {
      const { stuffsDetail, propsDetail } = payload
      let num = 1
      let isOk = true
      while (isOk) {
        const currentNum = num + 1
        for (let index = 0; index < stuffsDetail.length; index++) {
          const item = stuffsDetail[index];
          if (item.currNum - (item.reqNum * currentNum) < 0) {
            isOk = false
          }
        }
        for (let index = 0; index < propsDetail.length; index++) {
          const item = propsDetail[index];
          if (item.currNum - (item.reqNum * currentNum) < 0) {
            isOk = false
          }
        }
        num++
      };

      return num - 1
    },

    // 炼器
    *lianQi({ payload }, { call, put, select }) {
      const { recipeData, refiningNum, } = payload
      const { lianQiTuZhiConfig } = yield select(state => state.LianQiModel);
      const currentLianQiTuZhiConfig = lianQiTuZhiConfig.find(item => item.id === recipeData.id)

      // 扣除原料
      for (let k in currentLianQiTuZhiConfig.stuffs) {
        const stuff = currentLianQiTuZhiConfig.stuffs[k];
        yield put.resolve(action('PropsModel/use')({ propId: stuff.id, num: (stuff.num * refiningNum), quiet: true }));
      }
      // 扣除辅助材料
      for (let k in recipeData.propsDetail) {
        const props = recipeData.propsDetail[k];
        yield put.resolve(action('PropsModel/use')({ propId: props.propId, num: (props.reqNum * refiningNum), quiet: true }));
      }

      console.log("recipeData.propsDetail", recipeData.propsDetail);

      // 随机产生丹药
      let danYaoArr = []
      for (let k = 0; k < refiningNum; k++) {
        const sortTargets = currentLianQiTuZhiConfig.targets.map(e => ({ ...e }))
        sortTargets.sort((a, b) => b.rate - a.rate);
        let prevRange = 0;
        sortTargets.forEach(e => {
          e.range = [prevRange, prevRange + e.rate];
          prevRange = e.range[1];
        });
        const randValue = lo.random(0, 100, false);
        let hit = sortTargets.find(e => randValue >= e.range[0] && randValue < e.range[1]);
        if (hit == undefined) hit = sortTargets[sortTargets.length - 1];

        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: hit.id }));

        // 重复的就增加数量
        if (danYaoArr.find(item => item.id === hit.id) === undefined) {
          danYaoArr.push({ ...hit, name: propConfig.name, iconId: propConfig.iconId, quality: propConfig.quality })
        }
        else {
          danYaoArr = danYaoArr.map(item => item.id === hit.id ? { ...item, num: item.num + 1 } : item)
        }
      }
      // 发送道具，这就先存储
      // yield put.resolve(action('PropsModel/sendProps')({ propId: hit.id, num: hit.num, quiet: true }));

      const lianQiData = {
        recipeId: currentLianQiTuZhiConfig.id,
        recipeName: currentLianQiTuZhiConfig.name,
        needTime: currentLianQiTuZhiConfig.time * refiningNum,
        refiningTime: now(),
        targets: danYaoArr,
        status: 0,
      }

      yield call(LocalStorage.set, LocalCacheKeys.ALCHEMY_DATA, lianQiData);
      yield put(action("updateState")({ lianQiData }))
    },

    // 炼丹完成
    *lianQiFinish({ payload }, { call, put, select }) {
      const { lianQiData } = yield select(state => state.LianQiModel);

      for (let index = 0; index < lianQiData.targets.length; index++) {
        const prop = lianQiData.targets[index];
        yield put.resolve(action('PropsModel/sendProps')({ propId: prop.id, num: prop.num, quiet: true }));
      }

      const message = lianQiData.targets.map(item => {
        return `获得${item.name} * ${item.num}`
      })
      Toast.show(message, BOTTOM_TOP_SMOOTH)

      yield call(LocalStorage.set, LocalCacheKeys.LIANQI_DATA, null);
      yield put(action("updateState")({ lianQiData: null }))
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
