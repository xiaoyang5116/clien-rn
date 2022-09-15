
import { 
  action,
} from "../constants";

import { GetLotteryDataApi } from '../services/GetLotteryDataApi';
import EventListeners from '../utils/EventListeners';
import lo from 'lodash';
import Toast from "../components/toast";

export default {
  namespace: 'LotteryModel',

  state: {
    __data: {
      lotteries_config: [],
    }
  },

  effects: {

    *reload({ }, { select, call, put }) {
      const lotteryState = yield select(state => state.LotteryModel);
      const data_v1 = yield call(GetLotteryDataApi, 'v1');
      const data_v2 = yield call(GetLotteryDataApi, 'v2');
      
      lotteryState.__data.lotteries_config.length = 0;
      if (lo.isArray(data_v1.lotteries)) {
        lotteryState.__data.lotteries_config.push(...data_v1.lotteries);
      }
      if (lo.isArray(data_v2.lotteries)) {
        lotteryState.__data.lotteries_config.push(...data_v2.lotteries);
      }
    },

    *lottery({ payload }, { select, call, put }) {
      const lotteryState = yield select(state => state.LotteryModel);
      const { id, max } = payload;

      const lottery = lotteryState.__data.lotteries_config.find(e => e.id == id);
      if (lottery == undefined) {
        Toast.show('抽奖配置异常！');
        return
      }

      let rewardTimes = 0;
      let isBox = false;
      if (lo.isBoolean(lottery.box) && lottery.box) {
        // 宝箱按1次或者最大10次抽取
        isBox = true;
        if (max != undefined && lo.isBoolean(max) && max) {
          const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: lottery.useProps.propId }));
          const maxTimes = Math.floor(propNum / lottery.useProps.num);
          rewardTimes = maxTimes > 10 ? 10 : maxTimes;
        } else {
          rewardTimes = 1;
        }        
      } else {
        // 非宝箱形式按配置设定抽取固定次数
        rewardTimes = lottery.times;
      }

      // 适配2种数据结构
      let checkProps = {};
      if (isBox) {
        checkProps = { propsId: [lottery.useProps.propId], num: lottery.useProps.num * rewardTimes };
      } else {
        checkProps = lottery.useProps;
      }

      const result = yield put.resolve(action('PropsModel/reduce')({ ...checkProps }));
      if (result && lo.isObject(lottery.products) && lo.isObject(lottery.products.props)) {
        const rateTargets = [];
        if (lottery.products.props.p100 != undefined) rateTargets.push(...lottery.products.props.p100.map(e => ({ ...e, rate: e.rate * 100 })));
        if (lottery.products.props.p1000 != undefined) rateTargets.push(...lottery.products.props.p1000.map(e => ({ ...e, rate: e.rate * 10 })));
        if (lottery.products.props.p10000 != undefined) rateTargets.push(...lottery.products.props.p10000.map(e => ({ ...e })));

        rateTargets.sort((a, b) => b.rate - a.rate);
        let prevRange = 0;
        rateTargets.forEach(e => {
          e.range = [prevRange, prevRange + e.rate];
          prevRange = e.range[1];
        });

        const rewards = []; // 记录获得的奖励
        for (let i = 0; i < rewardTimes; i++) {
          const randValue = lo.random(0, prevRange, false);
          let hit = rateTargets.find(e => randValue >= e.range[0] && randValue < e.range[1]);
          if (hit == undefined) hit = rateTargets[rateTargets.length - 1];

          // 道具信息
          const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: hit.propId }));
          rewards.push({ 
            propId: hit.propId, num: hit.num, 
            name: propConfig.name, quality: propConfig.quality, iconId: propConfig.iconId 
          });
        }

        // 批量发放道具
        yield put.resolve(action('PropsModel/sendPropsBatch')({ props: rewards }));
        return rewards;
      }
    },

    *getBoxes({ payload }, { select, call, put }) {
      const lotteryState = yield select(state => state.LotteryModel);
      const boxes = lotteryState.__data.lotteries_config.filter(e => (e.box != undefined && e.box));

      const data = [];
      for (let i = 0; i < boxes.length;) {
        const array = [];
        if (i == 0) {
          array.push(boxes[i++]);
        } else {
          array.push(boxes[i++]);
          if (i < boxes.length) array.push(boxes[i++]);
        }

        //
        const row = [];
        for (let k in array) {
          const box = array[k];
          const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: box.useProps.propId }));
          const maxTimes = Math.floor(propNum / box.useProps.num);
          row.push({ id: box.id, title: box.name, reqNum: box.useProps.num, currentNum: propNum, maxTimes: (maxTimes > 10 ? 10 : maxTimes) });
        }
        data.push(row);
      }

      return data;
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
