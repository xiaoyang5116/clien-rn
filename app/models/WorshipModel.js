import LocalStorage from '../utils/LocalStorage';
import { action, LocalCacheKeys } from '../constants';
import EventListeners from '../utils/EventListeners';
import { now } from '../utils/DateTimeUtils';
import { GetWorshipDataApi } from '../services/GetWorshipDataApi';
import lo from 'lodash';

// 0-空格子, 1-供品, 2-供奉中, 3-宝箱
export default {
  namespace: 'WorshipModel',

  state: {
    worshipData: [],
    worshipConfig: {},
    treasureRecords: [],
    bigTreasureProgress: 0,
  },

  effects: {
    *reload({ payload }, { call, put, select }) {
      const data = yield call(LocalStorage.get, LocalCacheKeys.WORSHIP_DATA);
      const worshipConfig = yield call(GetWorshipDataApi);
      if (data != null) {
        yield put(
          action('updateState')({
            worshipData: data.worshipData,
            treasureRecords: data.treasureRecords,
            bigTreasureProgress: data.bigTreasureProgress,
          }),
        );
      } else {
        const worship_data = {
          worshipData: [
            { id: 1, status: 0 },
            { id: 2, status: 0 },
            { id: 3, status: 0 },
            { id: 4, status: 0 },
          ],
          treasureRecords: [],
          bigTreasureProgress: 0,
        };

        yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, worship_data);
        yield put(action('updateState')(worship_data));
      }

      yield put(action('updateState')({ worshipConfig: worshipConfig.data }));
    },

    // 获取贡品道具数据
    *getOfferingProps({ payload }, { put, select, call }) {
      const allProps = yield put.resolve(action('PropsModel/getBagProps')());
      let propsData = allProps.filter(i => i.type === 200);
      const { worshipConfig } = yield select(state => state.WorshipModel);
      for (let index = 0; index < propsData.length; index++) {
        const item = propsData[index];
        const propsConfig = worshipConfig.props.find(f => f.id === item.id);
        Object.assign(item, propsConfig);
      }

      return propsData;
    },

    // 添加供奉道具
    *addWorshipProp({ payload }, { put, select, call }) {
      const { worshipProp, gridId } = payload;
      const { worshipData, worshipConfig } = yield select(
        state => state.WorshipModel,
      );
      let _worshipData = [...worshipData];
      const worshipDataIndex = _worshipData.findIndex(
        item => item.id == gridId,
      );

      // 判断 添加祭品对应的格子 前面是否有供奉中的格子
      let isWorship = true;
      for (let index = 0; index < worshipDataIndex; index++) {
        const item = _worshipData[index];
        if (item.status === 2) {
          isWorship = false;
        }
      }

      if (isWorship) {
        _worshipData[worshipDataIndex] = {
          ..._worshipData[worshipDataIndex],
          status: 2,
          beginTime: now(),
        };
      } else {
        _worshipData[worshipDataIndex] = {
          ..._worshipData[worshipDataIndex],
          status: 1,
        };
      }

      // 宝箱配置
      const treasureChestConfig = worshipConfig.treasureChest.find(
        item => item.id === worshipProp.treasureChestId,
      );

      _worshipData[worshipDataIndex] = {
        ..._worshipData[worshipDataIndex],
        name: worshipProp.name,
        propId: worshipProp.id,
        iconId: worshipProp.iconId,
        quality: worshipProp.quality,
        needTime: worshipProp.worshipTime,
        // treasureChestId: worshipProp.treasureChestId,
        treasureChestConfig,
      };
      const newWorshipData = removeEmpty(_worshipData);

      const worship_data = yield call(
        LocalStorage.get,
        LocalCacheKeys.WORSHIP_DATA,
      );
      worship_data.worshipData = newWorshipData;

      // 使用道具
      yield put.resolve(
        action('PropsModel/use')({ propId: worshipProp.id, num: 1, quiet: true }),
      );
      yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, worship_data);
      yield put(action('updateState')({ worshipData: newWorshipData }));
    },

    // 取消供奉
    *cancelWorship({ payload }, { put, select, call }) {
      const { worshipData } = yield select(state => state.WorshipModel);
      const _worshipData = worshipData.map(item =>
        item.id === payload.id ? { id: item.id, status: 0 } : item,
      );
      // 排除空的
      const newWorshipData = removeEmpty(_worshipData);

      const worship_data = yield call(
        LocalStorage.get,
        LocalCacheKeys.WORSHIP_DATA,
      );
      worship_data.worshipData = newWorshipData;

      // 退回道具
      yield put.resolve(
        action('PropsModel/sendProps')({
          propId: payload.propId,
          num: 1,
          quiet: true,
        }),
      );
      yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, worship_data);
      yield put(action('updateState')({ worshipData: newWorshipData }));
    },

    // 更改 供奉中 道具
    *changeWorship({ payload }, { put, select, call }) {
      // {"beginTime": 1662195643642, "iconId": 2,
      // "id": 1, "name": "猪猡", "needTime": 10, "propId": 1500, "quality": 2, "status": 2}
      const { worshipData } = yield select(state => state.WorshipModel);
      const _worshipData = [...worshipData];
      const index = _worshipData.findIndex(item => item.id === payload.id);
      _worshipData[index] = {
        ..._worshipData[index],
        status: 3,
      };
      if (
        index <= _worshipData.length - 1 &&
        _worshipData[index + 1]?.status === 1
      ) {
        _worshipData[index + 1] = {
          ..._worshipData[index + 1],
          status: 2,
          beginTime: now(),
        };
      }

      const worship_data = yield call(
        LocalStorage.get,
        LocalCacheKeys.WORSHIP_DATA,
      );
      worship_data.worshipData = _worshipData;

      yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, worship_data);
      yield put(action('updateState')({ worshipData: _worshipData }));
    },

    // 获取供奉加速时间
    *getWorshipSpeedUpTime({ payload }, { put, select, call }) {
      const { worshipData } = yield select(state => state.WorshipModel);
      // 获取供奉可以加速的时间, 约定 数量1 为 1秒
      const worshipSpeedUpTime = yield put.resolve(
        action('PropsModel/getPropNum')({ propId: 2000 }),
      );

      // 总共的加速时间
      let allWorshipNeedTime = 0;
      // 当前供奉道具需要的时间
      let currentNeedTime = 0;
      for (let index = 0; index < worshipData.length; index++) {
        const item = worshipData[index];
        if (item.status === 0 || item === 3) continue;
        if (item.status === 1) {
          allWorshipNeedTime += item.needTime;
        }
        if (item.status === 2) {
          const diffTime = Math.floor((now() - item.beginTime) / 1000);
          // 当前需要的时间
          currentNeedTime = item.needTime - diffTime;
          allWorshipNeedTime += currentNeedTime;
        }
      }

      return {
        allWorshipNeedTime,
        currentNeedTime,
        worshipSpeedUpTime,
      };
    },

    // 供奉加速
    *worshipSpeedUp({ payload }, { put, select, call }) {
      const { worshipData } = yield select(state => state.WorshipModel);
      let _worshipData = [...worshipData];
      const { time, type } = payload;

      const { allWorshipNeedTime, currentNeedTime, worshipSpeedUpTime } =
        yield put.resolve(action('getWorshipSpeedUpTime')());

      // 加速所有贡品
      if (type === 'allSpeedTime') {
        for (let index = 0; index < _worshipData.length; index++) {
          const item = _worshipData[index];
          if (item.status === 0) continue;
          if (item.status === 3) continue;
          item.status = 3;
          item.needTime = 0;
        }

        // 使用加速道具
        yield put.resolve(
          action('PropsModel/use')({
            propId: 2000,
            num: allWorshipNeedTime,
            quiet: true,
          }),
        );
      }

      // 加速当前贡品
      if (type === 'currentSpeedTime') {
        // 当前 状态为供奉中 的索引
        const worshipDataIndex = _worshipData.findIndex(
          item => item.status === 2,
        );
        _worshipData[worshipDataIndex].status = 3;
        _worshipData[worshipDataIndex].needTime = 0;
        if (_worshipData[worshipDataIndex + 1].status === 1) {
          _worshipData[worshipDataIndex + 1].status = 2;
          _worshipData[worshipDataIndex + 1].beginTime = now();
        }

        yield put.resolve(
          action('PropsModel/use')({
            propId: 2000,
            num: currentNeedTime,
            quiet: true,
          }),
        );
      }

      if (type === 'canSpeedTime') {
        let speedUpTime = worshipSpeedUpTime;
        let useTime = 0;
        // 当前 状态为供奉中 的索引
        const worshipDataIndex = _worshipData.findIndex(
          item => item.status === 2,
        );
        // 循环后续供奉,减少供奉需要的时间,如果加速时间还剩余,则继续
        for (
          let index = worshipDataIndex;
          index < _worshipData.length;
          index++
        ) {
          const item = _worshipData[index];

          if (speedUpTime < 0) continue;
          if (item.status === 0) continue;
          if (item.status === 3) continue;

          if (item.status === 1) {
            speedUpTime = speedUpTime - item.needTime;
            if (speedUpTime >= 0) {
              useTime += item.needTime;
              item.status = 3;
              item.needTime = 0;
            } else {
              // 这里的 speedUpTime 是剩余时间
              useTime += item.needTime + speedUpTime;
              item.beginTime = now();
              item.needTime = -speedUpTime;
              item.status = 2;
            }
            continue;
          }
          if (item.status === 2) {
            const diffTime = Math.floor((now() - item.beginTime) / 1000);
            // 当前需要的时间
            const currentNeedTime = item.needTime - diffTime;
            if (currentNeedTime <= 0) continue;
            speedUpTime = speedUpTime - currentNeedTime;
            if (speedUpTime >= 0) {
              useTime += currentNeedTime;
              item.status = 3;
              item.needTime = 0;
            }
            if (speedUpTime < 0) {
              useTime += currentNeedTime + speedUpTime;
              item.needTime = -speedUpTime;
            }
            continue;
          }
        }

        yield put.resolve(
          action('PropsModel/use')({ propId: 2000, num: useTime, quiet: true }),
        );
      }

      const worship_data = yield call(
        LocalStorage.get,
        LocalCacheKeys.WORSHIP_DATA,
      );
      worship_data.worshipData = _worshipData;

      yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, worship_data);
      yield put(action('updateState')({ worshipData: _worshipData }));
    },

    // 开宝箱
    *openTreasureChest({ payload }, { put, select, call }) {
      const { treasureChestConfig } = payload;

      const rateTargets = [];
      if (treasureChestConfig.products.props.p100 != undefined)
        rateTargets.push(
          ...treasureChestConfig.products.props.p100.map(e => ({
            ...e,
            rate: e.rate * 100,
          })),
        );
      if (treasureChestConfig.products.props.p1000 != undefined)
        rateTargets.push(
          ...treasureChestConfig.products.props.p1000.map(e => ({
            ...e,
            rate: e.rate * 10,
          })),
        );
      if (treasureChestConfig.products.props.p10000 != undefined)
        rateTargets.push(
          ...treasureChestConfig.products.props.p10000.map(e => ({ ...e })),
        );

      rateTargets.sort((a, b) => b.rate - a.rate);
      let prevRange = 0;
      rateTargets.forEach(e => {
        e.range = [prevRange, prevRange + e.rate];
        prevRange = e.range[1];
      });

      const rewards = []; // 记录获得的奖励
      const randValue = lo.random(0, prevRange, false);
      let hit = rateTargets.find(
        e => randValue >= e.range[0] && randValue < e.range[1],
      );
      if (hit == undefined) hit = rateTargets[rateTargets.length - 1];

      for (let index = 0; index < hit.props.length; index++) {
        const item = hit.props[index];
        // 道具信息
        const propConfig = yield put.resolve(
          action('PropsModel/getPropConfig')({ propId: item.propId }),
        );
        rewards.push({
          propId: item.propId,
          num: item.num,
          name: propConfig.name,
          quality: propConfig.quality,
          iconId: propConfig.iconId,
        });
      }

      return rewards;
    },

    // 打开大宝箱
    *openBigTreasureChest({ payload }, { put, select, call }) {
      const { worshipConfig, } = yield select(state => state.WorshipModel);
      const { newWorshipData, newBigTreasureProgress, newTreasureRecords } = payload
      const bigTreasureProgress = newBigTreasureProgress - 100

      // 随机产生宝箱
      const sortTargets = newTreasureRecords.map(e => ({ ...e }))
      sortTargets.sort((a, b) => b.rate - a.rate);
      let prevRange = 0;
      sortTargets.forEach(e => {
        e.range = [prevRange, prevRange + e.rate];
        prevRange = e.range[1];
      });
      const randValue = lo.random(0, 100, false);
      let hit = sortTargets.find(e => randValue >= e.range[0] && randValue < e.range[1]);
      if (hit == undefined) hit = sortTargets[sortTargets.length - 1];
      const bigTreasureChest = worshipConfig.treasureChest.find(t => t.id === hit.id)
      const rewards = yield put.resolve(action('openTreasureChest')({ treasureChestConfig: bigTreasureChest }))

      // 批量发放道具
      yield put.resolve(action('PropsModel/sendPropsBatch')({ props: rewards }));

      yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, {
        worshipData: newWorshipData,
        bigTreasureProgress,
        treasureRecords: []
      });
      yield put(action('updateState')({
        worshipData: newWorshipData,
        bigTreasureProgress,
        treasureRecords: []
      }));
      return rewards
    },

    // 领取奖励道具
    *getRewardsProps({ payload }, { put, select, call }) {
      const { rewards, item } = payload;
      const { treasureChestConfig } = item;
      const { worshipData, treasureRecords, bigTreasureProgress } = yield select(
        state => state.WorshipModel,
      );
      // 批量发放道具
      yield put.resolve(action('PropsModel/sendPropsBatch')({ props: rewards }));

      const _worshipData = worshipData.map(i =>
        i.id === item.id ? { id: i.id, status: 0 } : i,
      );
      // 排除空的
      const newWorshipData = removeEmpty(_worshipData);

      const newBigTreasureProgress = bigTreasureProgress + treasureChestConfig.bigTreasureProgressAdd;

      let newTreasureRecords = [...treasureRecords]
      if (treasureRecords.find(f => f.id === treasureChestConfig.bigTreasureChestConfig.id) === undefined) {
        newTreasureRecords.push({
          ...treasureChestConfig.bigTreasureChestConfig,
          // increase: treasureChestConfig.bigTreasureProgressAdd
        })
      } else {
        newTreasureRecords = treasureRecords.map(w =>
          w.id === treasureChestConfig.bigTreasureChestConfig.id
            ? {
              ...w,
              rate: w.rate + treasureChestConfig.bigTreasureChestConfig.rate,
              // increase: w.increase + treasureChestConfig.bigTreasureProgressAdd
            }
            : w,
        );
      }

      if (newBigTreasureProgress >= 100) {
        return yield put.resolve(action('openBigTreasureChest')({ newWorshipData, newBigTreasureProgress, newTreasureRecords }));
      } else {
        yield call(LocalStorage.set, LocalCacheKeys.WORSHIP_DATA, {
          worshipData: newWorshipData,
          bigTreasureProgress: newBigTreasureProgress,
          treasureRecords: newTreasureRecords
        });
        yield put(action('updateState')({
          worshipData: newWorshipData,
          bigTreasureProgress: newBigTreasureProgress,
          treasureRecords: newTreasureRecords
        }));
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    registerReloadEvent({ dispatch }) {
      EventListeners.register('reload', msg => {
        return dispatch({ type: 'reload' });
      });
    },
  },
};

// 排除空的
function removeEmpty(worshipData) {
  let newWorshipData = [...worshipData];
  for (let index = 0; index < worshipData.length; index++) {
    const item = worshipData[index];
    if (item.status === 0) {
      newWorshipData = newWorshipData.filter(f => f.id != item.id);
      newWorshipData.push(item);
    }
  }
  return newWorshipData;
}
