
import {
  action,
  LocalCacheKeys,
  BOTTOM_TOP_SMOOTH
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
    danFangConfig: [],  // 丹方配置数据
    alchemyData: null,  // 炼丹数据
  },

  effects: {
    *reload({ }, { select, put, call }) {
      // 挂载炼丹数据
      const storageAlchemy = yield call(LocalStorage.get, LocalCacheKeys.ALCHEMY_DATA);
      yield put(action('updateState')({ alchemyData: storageAlchemy }))
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

        if (enough) {
          validData.push({ ...item, valid: enough })
        } else {
          notValidData.push({ ...item, valid: enough })
        }
      }

      const newDanFangList = [...validData, ...notValidData]
      yield put(action("updateState")({ danFangList: newDanFangList, danFangConfig: rules }))
    },

    // 获取丹方详情
    *getDanFangDetail({ payload }, { call, put, select }) {
      const stuffsDetail = []
      for (let k in payload.stuffs) {
        const stuff = payload.stuffs[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: stuff.id }));
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: stuff.id }));
        stuffsDetail.push({ id: stuff.id, name: propConfig.name, reqNum: stuff.num, currNum: propNum });
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
        targets.push({ id: item.id, name: propConfig.name, desc: propConfig.desc, currNum: propNum, productNum: item.num });
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

    // 炼丹
    *alchemy({ payload }, { call, put, select }) {
      const { danFangData, refiningNum, } = payload
      const { danFangConfig } = yield select(state => state.AlchemyModel);
      const currentDanFangConfig = danFangConfig.find(item => item.id === danFangData.id)

      // 扣除原料
      for (let k in currentDanFangConfig.stuffs) {
        const stuff = currentDanFangConfig.stuffs[k];
        yield put.resolve(action('PropsModel/use')({ propId: stuff.id, num: (stuff.num * refiningNum), quiet: true }));
      }
      // 扣除辅助材料
      for (let k in danFangData.propsDetail) {
        const props = danFangData.propsDetail[k];
        yield put.resolve(action('PropsModel/use')({ propId: props.id, num: (props.reqNum * refiningNum), quiet: true }));
      }

      // 随机产生丹药
      let danYaoArr = []
      for (let k = 0; k < refiningNum; k++) {
        const sortTargets = currentDanFangConfig.targets.map(e => ({ ...e }))
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

      const alchemyData = {
        danFangId: currentDanFangConfig.id,
        danFangName: currentDanFangConfig.name,
        needTime: currentDanFangConfig.time * refiningNum,
        refiningTime: now(),
        targets: danYaoArr,
        status: 0,
      }

      yield call(LocalStorage.set, LocalCacheKeys.ALCHEMY_DATA, alchemyData);
      yield put(action("updateState")({ alchemyData }))
    },

    // 炼丹完成
    *alchemyFinish({ payload }, { call, put, select }) {
      const { alchemyData } = yield select(state => state.AlchemyModel);

      for (let index = 0; index < alchemyData.targets.length; index++) {
        const prop = alchemyData.targets[index];
        yield put.resolve(action('PropsModel/sendProps')({ propId: prop.id, num: prop.num, quiet: true }));
      }

      const message = alchemyData.targets.map(item => {
        return `获得${item.name} * ${item.num}`
      })
      Toast.show(message, BOTTOM_TOP_SMOOTH)

      yield call(LocalStorage.set, LocalCacheKeys.ALCHEMY_DATA, null);
      yield put(action("updateState")({ alchemyData: null }))
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
