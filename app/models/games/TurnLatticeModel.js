import LocalStorage from '../../utils/LocalStorage';
import { action, LocalCacheKeys, BOTTOM_TOP_SMOOTH, EventKeys } from '../../constants';
import EventListeners from '../../utils/EventListeners';
import { GetTurnLattice } from '../../services/GetTurnLattice';
import Toast from '../../components/toast';
import Modal from '../../components/modal';
import RewardsPageModal from '../../components/rewardsPageModal';
import ArenaUtils from '../../utils/ArenaUtils';
import { DeviceEventEmitter } from 'react-native';


export default {
  namespace: 'TurnLatticeModel',
  state: {
    turnLatticeData: [],
    currentLayer: 0,
    curLatticeMazeId: "",
  },

  effects: {
    *getTurnLatticeData({ payload }, { call, put, select }) {
      const { latticeMazeId, isReload } = payload
      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );
      // 没有打开过
      if (historyData === null && (historyData?.find(item => item.latticeMazeId === latticeMazeId) === undefined)) {
        const { latticeMaze } = yield call(GetTurnLattice);
        const currentLatticeMazeData = latticeMaze.find(item => item.latticeMazeId === latticeMazeId)
        const { desc, unlockProps, consumableProps, data } = currentLatticeMazeData
        // 初始化
        for (let index = 0; index < data.length; index++) {
          const item = data[index];
          const eventData = item.eventData
          for (let i = 0; i < item.config.length; i++) {
            const gridConfig = item.config[i]
            gridConfig.isOpened = false
            gridConfig.status = 0
            if (gridConfig.type === undefined) {
              gridConfig.type = "空"
            }
            if (gridConfig.type === "事件") {
              const event = eventData.find(f => f.id === gridConfig.eventId)
              if (event.type === "道具") {
                const propConfig = yield put.resolve(
                  action('PropsModel/getPropConfig')({ propId: Number(event.prop.id) }),
                );
                Object.assign(event.prop, propConfig)
              }
              gridConfig.event = event
            }
          }
          // 设置 入口 附近的格子可以打开
          const entranceGrid = item.config.find(i => i.type === "入口")
          setNearbyGridStates(entranceGrid, item)
        }

        // 解锁和消耗道具
        const message = [];
        if (unlockProps !== undefined) {
          for (let index = 0; index < unlockProps.length; index++) {
            const prop = unlockProps[index].split(',');
            const propNum = yield put.resolve(
              action('PropsModel/getPropNum')({ propId: Number(prop[0]) }),
            );
            const propConfig = yield put.resolve(
              action('PropsModel/getPropConfig')({ propId: Number(prop[0]) }),
            );
            const isOK = propNum >= Number(prop[1]);
            message.push({
              isOK: isOK,
              msg: `拥有${propConfig.name}数量: ${propNum}/${Number(prop[1])}`,
            });
          }
        }
        if (consumableProps !== undefined) {
          for (let index = 0; index < consumableProps.length; index++) {
            const prop = consumableProps[index].split(',');
            const propNum = yield put.resolve(
              action('PropsModel/getPropNum')({ propId: Number(prop[0]) }),
            );
            const propConfig = yield put.resolve(
              action('PropsModel/getPropConfig')({ propId: Number(prop[0]) }),
            );
            const isOK = propNum >= Number(prop[1]);
            message.push({
              isOK: isOK,
              msg: `拥有${propConfig.name}数量: ${propNum}/${Number(prop[1])}`,
            });
          }
        }
        yield put(action('updateState')({ turnLatticeData: data, currentLayer: 0, curLatticeMazeId: latticeMazeId }));
        return {
          desc,
          message,
          latticeConfig: data[0].config
        }

      } else {
        const currentData = historyData.find(item => item.latticeMazeId === latticeMazeId)
        const { desc, data, consumableProps, currentLayer } = currentData

        if (isReload) {
          for (let index = 0; index < data.length; index++) {
            const item = data[index];
            for (let i = 0; i < item.config.length; i++) {
              const gridConfig = item.config[i]
              gridConfig.status = 0
            }
            // 设置 入口 附近的格子可以打开
            const entranceGrid = item.config.find(i => i.type === "入口")
            setNearbyGridStates(entranceGrid, item)
          }
          // 消耗道具
          const message = [];
          if (consumableProps !== undefined) {
            for (let index = 0; index < consumableProps.length; index++) {
              const prop = consumableProps[index].split(',');
              const propNum = yield put.resolve(
                action('PropsModel/getPropNum')({ propId: Number(prop[0]) }),
              );
              const propConfig = yield put.resolve(
                action('PropsModel/getPropConfig')({ propId: Number(prop[0]) }),
              );
              const isOK = propNum >= Number(prop[1]);
              message.push({
                isOK: isOK,
                msg: `拥有${propConfig.name}数量: ${propNum}/${Number(prop[1])}`,
              });
            }
          }
          yield put(action('updateState')({ turnLatticeData: data, currentLayer: 0, curLatticeMazeId: latticeMazeId }));
          return {
            desc,
            message,
            latticeConfig: data[0].config
          }
        } else {
          // 恢复 上次数据
          yield put(action('updateState')({ turnLatticeData: data, currentLayer, curLatticeMazeId: latticeMazeId }));
          return {
            desc,
            latticeConfig: data[currentLayer].config
          }
        }
      }
    },

    // 解锁 和 消耗 道具
    *consumableProps({ payload }, { call, put, select }) {
      const { curLatticeMazeId, turnLatticeData } = yield select(state => state.TurnLatticeModel);
      const { latticeMaze } = yield call(GetTurnLattice);
      const currentLatticeMazeData = latticeMaze.find(item => item.latticeMazeId === curLatticeMazeId)

      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );

      if (historyData === null || (historyData.find(item => item.latticeMazeId === curLatticeMazeId) === undefined)) {
        const { unlockProps, consumableProps, vars } = currentLatticeMazeData
        // 扣除 解锁 道具
        for (let k in unlockProps) {
          const prop = unlockProps[k].split(',');
          yield put.resolve(
            action('PropsModel/use')({
              propId: prop[0],
              num: prop[1],
              quiet: true,
            }),
          );
        }

        // 扣除 消耗 道具
        for (let k in consumableProps) {
          const prop = consumableProps[k].split(',');
          yield put.resolve(
            action('PropsModel/use')({
              propId: prop[0],
              num: prop[1],
              quiet: true,
            }),
          );
        }

        // 初始化变量
        for (let index = 0; index < vars.length; index++) {
          const currentVar = vars[index];
          if (currentVar.default != undefined) {
            currentVar.value = currentVar.default
          } else {
            currentVar.value = currentVar.min
          }
        }

        // 保存副本
        if (historyData === null) {
          yield call(
            LocalStorage.set,
            LocalCacheKeys.TURN_LATTICE_DATA,
            [{ ...currentLatticeMazeData, currentLayer: 0, data: turnLatticeData, vars }]
          );
        }
        else {
          yield call(
            LocalStorage.set,
            LocalCacheKeys.TURN_LATTICE_DATA,
            [...historyData, { ...currentLatticeMazeData, currentLayer: 0, data: turnLatticeData, vars }]
          );
        }
      } else {
        const { consumableProps } = currentLatticeMazeData
        // 扣除 消耗 道具
        for (let k in consumableProps) {
          const prop = consumableProps[k].split(',');
          yield put.resolve(
            action('PropsModel/use')({
              propId: prop[0],
              num: prop[1],
              quiet: true,
            }),
          );
        }
      }
    },

    // 翻开格子
    *openGrid({ payload }, { call, put, select }) {
      const { item } = payload;
      const { turnLatticeData, currentLayer, curLatticeMazeId } = yield select(state => state.TurnLatticeModel);
      const { config: gridConfig } = turnLatticeData[currentLayer];

      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );

      const curIndex = gridConfig.findIndex(i => i.x === item.x && i.y === item.y);
      gridConfig[curIndex].status = 2;
      gridConfig[curIndex].isOpened = true

      setNearbyGridStates(item, turnLatticeData[currentLayer])

      yield put(action('updateState')({ turnLatticeData }));
      yield call(
        LocalStorage.set,
        LocalCacheKeys.TURN_LATTICE_DATA,
        historyData.map(item => item.latticeMazeId === curLatticeMazeId ? { ...item, data: turnLatticeData } : item)
      );
      return gridConfig
    },

    // 领取格子道具
    *getGridProps({ payload }, { call, put, select }) {
      const { item } = payload
      const { prop } = item.event

      yield put.resolve(action('PropsModel/sendProps')({ propId: prop.id, num: prop.num, quiet: true }));
      const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: prop.id }));
      Toast.show(`获得${propConfig.name} * ${prop.num}`, BOTTOM_TOP_SMOOTH, 500)

      const { turnLatticeData, currentLayer, curLatticeMazeId } = yield select(state => state.TurnLatticeModel);
      const { config: gridConfig } = turnLatticeData[currentLayer];
      const curIndex = gridConfig.findIndex(i => i.x === item.x && i.y === item.y);
      gridConfig[curIndex].type = "空";
    },

    // 出口
    *exportGrid({ payload }, { call, put, select }) {
      const { toLayer, toChapter } = payload
      const { turnLatticeData, currentLayer, curLatticeMazeId } = yield select(state => state.TurnLatticeModel);
      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );
      if (toChapter != undefined && toLayer === undefined) {
        yield put.resolve(action('SceneModel/processActions')({ ...payload }))
        DeviceEventEmitter.emit(EventKeys.CLOSE_TURN_LATTICE_EVENT)
      } else {
        if (turnLatticeData.length >= toLayer) {
          yield call(
            LocalStorage.set,
            LocalCacheKeys.TURN_LATTICE_DATA,
            historyData.map(item => item.latticeMazeId === curLatticeMazeId ? { ...item, currentLayer: toLayer - 1 } : item)
          );
          yield put(action('updateState')({ currentLayer: toLayer - 1 }));
          return turnLatticeData[toLayer - 1].config
        }
        else {
          return null
        }
      }
    },

    // 开宝箱
    *openGridTreasureChest({ payload }, { call, put, select }) {
      const { item } = payload
      const { treasureChestId } = item.event

      const rewards = yield put.resolve(action('TreasureChestModel/openTreasureChest')({ id: treasureChestId }))
      RewardsPageModal.gridRewards(rewards)

      const { turnLatticeData, currentLayer } = yield select(state => state.TurnLatticeModel);
      const { config: gridConfig } = turnLatticeData[currentLayer];
      const curIndex = gridConfig.findIndex(i => i.x === item.x && i.y === item.y);
      gridConfig[curIndex].event.treasureChestIsOpen = true;
    },

    // 遇见 boss
    *meetBossEvent({ payload }, { call, put, select }) {
      const { item } = payload;
      const { turnLatticeData, currentLayer, curLatticeMazeId } = yield select(state => state.TurnLatticeModel);
      const { config: gridConfig } = turnLatticeData[currentLayer];

      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );

      const curIndex = gridConfig.findIndex(i => i.x === item.x && i.y === item.y);
      gridConfig[curIndex].status = 2;
      gridConfig[curIndex].isOpened = true

      setAllRoundGridIsProhibitOpen(item, turnLatticeData[currentLayer], true)

      yield put(action('updateState')({ turnLatticeData }));
      yield call(
        LocalStorage.set,
        LocalCacheKeys.TURN_LATTICE_DATA,
        historyData.map(item => item.latticeMazeId === curLatticeMazeId ? { ...item, data: turnLatticeData } : item)
      );
      return gridConfig
    },

    // 打赢 Boss
    *challengeWin({ payload }, { call, put, select }) {
      const { item } = payload
      const { event } = item
      const { turnLatticeData, currentLayer, curLatticeMazeId } = yield select(state => state.TurnLatticeModel);
      const { config: gridConfig, eventData } = turnLatticeData[currentLayer];
      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );

      const curIndex = gridConfig.findIndex(i => i.x === item.x && i.y === item.y);
      gridConfig[curIndex].type = "空";

      setAllRoundGridIsProhibitOpen(item, turnLatticeData[currentLayer], false)

      if (event && event.afterEventId) {
        const eventConfig = eventData.find(f => f.id === event.afterEventId)
        if (eventConfig.type === "剧情") {
          Modal.show(eventConfig)
          gridConfig[curIndex].event.afterEventId = null;
        }
        if (eventConfig.type === "战斗") {
          gridConfig[curIndex].type = "事件"
          gridConfig[curIndex].event = eventConfig
          setAllRoundGridIsProhibitOpen(item, turnLatticeData[currentLayer], true)
        }
      }

      yield put(action('updateState')({ turnLatticeData }));
      yield call(
        LocalStorage.set,
        LocalCacheKeys.TURN_LATTICE_DATA,
        historyData.map(item => item.latticeMazeId === curLatticeMazeId ? { ...item, data: turnLatticeData } : item)
      );
      return gridConfig
    },

    // 触发事件
    *triggerGridEvent({ payload }, { call, put, select }) {
      // {"item": {
      // "event": {"id": "1", "prop": [Object], "type": "道具"}, 
      // "eventId": "1", "isOpened": true, "status": 2, "type": "事件", "x": 2, "y": 8
      // }}

      const { item } = payload
      const { event } = item

      const { turnLatticeData, currentLayer, curLatticeMazeId } = yield select(state => state.TurnLatticeModel);
      const { eventData, config: gridConfig } = turnLatticeData[currentLayer]
      const curIndex = gridConfig.findIndex(i => i.x === item.x && i.y === item.y);
      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );

      // 前置事件
      if (event && event.beforeEventId) {
        const eventConfig = eventData.find(f => f.id === event.beforeEventId)
        if (eventConfig.type === "剧情") {
          Modal.show(eventConfig)
          gridConfig[curIndex].event.beforeEventId = null;
          yield put(action('updateState')({ turnLatticeData }));
          yield call(
            LocalStorage.set,
            LocalCacheKeys.TURN_LATTICE_DATA,
            historyData.map(item => item.latticeMazeId === curLatticeMazeId ? { ...item, data: turnLatticeData } : item)
          );
          return gridConfig
        }
      }

      if (event && event.type === "道具") {
        yield put.resolve(action('getGridProps')({ item }));
      }

      if (event && event.type === "剧情") {
        Modal.show(event)
        gridConfig[curIndex].type = "空"
      }

      if (event && event.type === "宝箱") {
        yield put.resolve(action('openGridTreasureChest')({ item }));
      }
      if (event && event.type === "战斗") {
        ArenaUtils.show({ challengeId: event.challenge });
        return
      }

      // 后置事件
      if (event && event.afterEventId) {
        const eventConfig = eventData.find(f => f.id === event.afterEventId)
        if (eventConfig.type === "剧情") {
          Modal.show(eventConfig)
          gridConfig[curIndex].event.afterEventId = null;
        }
      }

      yield put(action('updateState')({ turnLatticeData }));
      yield call(
        LocalStorage.set,
        LocalCacheKeys.TURN_LATTICE_DATA,
        historyData.map(item => item.latticeMazeId === curLatticeMazeId ? { ...item, data: turnLatticeData } : item)
      );
      return gridConfig
    },

    // 判断是否有钥匙
    *isHaveKey({ payload }, { call, put, select }) {
      const { item } = payload
      const propNum = yield put.resolve(
        action('PropsModel/getPropNum')({ propId: Number(item.keyPropId) }),
      );
      if (propNum > 0) {
        return true
      } else {
        return false
      }
    },

    // 检查 事件 状态
    *checkEventStatus({ payload }, { call, put, select }) {
      const { andVarsOn, andVarsOff } = payload
      const { curLatticeMazeId, turnLatticeData } = yield select(state => state.TurnLatticeModel);
      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );
      const currentLatticeMazeData = historyData?.find(item => item.latticeMazeId === curLatticeMazeId)
      // 没有保存 就直接返回
      if (historyData == null || currentLatticeMazeData === undefined) {
        return true
      }

      const { vars } = currentLatticeMazeData
      let isTrigger = true
      if (Array.isArray(andVarsOn)) {
        for (let index = 0; index < andVarsOn.length; index++) {
          const currentVar = vars.find(item => item.id === andVarsOn[index])
          if (currentVar.value === 0) {
            isTrigger = false
            break;
          }
        }
      }
      if (Array.isArray(andVarsOff) && isTrigger === true) {
        for (let index = 0; index < andVarsOn.length; index++) {
          const currentVar = vars.find(item => item.id === andVarsOn[index])
          if (currentVar.value === 1) {
            isTrigger = false
            break;
          }
        }
      }

      return isTrigger
    },

    // 改变 vars 值
    *turnLatticeChangeVars({ payload }, { call, put, select }) {
      const { turnLattice_varsOn, turnLattice_varsOff } = payload
      const { curLatticeMazeId, turnLatticeData } = yield select(state => state.TurnLatticeModel);
      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );
      const currentLatticeMazeData = historyData?.find(item => item.latticeMazeId === curLatticeMazeId)
      // 没有保存 就直接返回
      if (historyData == null || currentLatticeMazeData === undefined) {
        return
      }

      const { vars } = currentLatticeMazeData
      if (Array.isArray(turnLattice_varsOn)) {
        for (let index = 0; index < turnLattice_varsOn.length; index++) {
          const currentVar = vars.find(item => item.id === turnLattice_varsOn[index])
          currentVar.value = 1
        }
      }
      if (Array.isArray(turnLattice_varsOff)) {
        for (let index = 0; index < turnLattice_varsOff.length; index++) {
          const currentVar = vars.find(item => item.id === turnLattice_varsOff[index])
          currentVar.value = 0
        }
      }
      yield call(
        LocalStorage.set,
        LocalCacheKeys.TURN_LATTICE_DATA,
        historyData.map(item => item.latticeMazeId === curLatticeMazeId ? { ...item, vars } : item)
      );
      DeviceEventEmitter.emit("TURN_LATTICE_REFRESH")
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

  // subscriptions: {
  //   registerReloadEvent({ dispatch }) {
  //     EventListeners.register('reload', msg => {
  //       return dispatch({ type: 'reload' });
  //     });
  //   },
  // },
};

// 判断格子是否可以打开
function isCanOpenedGrid(item) {
  if (item.status === 0 && item.type !== '墙' && item.type !== '入口') {
    return true;
  }
  return false;
}

// 设置附近的格子状态为1
function setNearbyGridStates(item, currentGridConfig,) {
  const { row, column, config: gridConfig } = currentGridConfig
  // 上面
  if (item.y - 1 >= 0) {
    const topIndex = gridConfig.findIndex(
      i => i.x === item.x && i.y === item.y - 1,
    );
    if (isCanOpenedGrid(gridConfig[topIndex])) {
      gridConfig[topIndex].status = 1;
    }
  }
  // 下面
  if (item.y + 1 < row) {
    const botIndex = gridConfig.findIndex(
      i => i.x === item.x && i.y === item.y + 1,
    );
    if (isCanOpenedGrid(gridConfig[botIndex])) {
      gridConfig[botIndex].status = 1;
    }
  }
  //左面
  if (item.x - 1 >= 0) {
    const leftIndex = gridConfig.findIndex(
      i => i.x === item.x - 1 && i.y === item.y,
    );
    if (isCanOpenedGrid(gridConfig[leftIndex])) {
      gridConfig[leftIndex].status = 1;
    }
  }
  // 右边
  if (item.x + 1 < column) {
    const rightIndex = gridConfig.findIndex(
      i => i.x === item.x + 1 && i.y === item.y,
    );
    if (isCanOpenedGrid(gridConfig[rightIndex])) {
      gridConfig[rightIndex].status = 1;
    }
  }
}

// 是否禁止格子
function isProhibitGrid(item) {
  if (item.status != 2 && item.type !== '墙' && item.type !== '入口') {
    return true;
  }
  return false;
}
// 设置四周格子禁止翻开
function setAllRoundGridIsProhibitOpen(item, currentGridConfig, isProhibit) {
  const { row, column, config: gridConfig } = currentGridConfig
  // 上面
  if (item.y - 1 >= 0) {
    const topIndex = gridConfig.findIndex(
      i => i.x === item.x && i.y === item.y - 1,
    );
    if (isProhibitGrid(gridConfig[topIndex])) {
      gridConfig[topIndex].status = 1;
      gridConfig[topIndex].isProhibit = isProhibit;
    }
  }
  // 下面
  if (item.y + 1 < row) {
    const botIndex = gridConfig.findIndex(
      i => i.x === item.x && i.y === item.y + 1,
    );
    if (isProhibitGrid(gridConfig[botIndex])) {
      gridConfig[botIndex].status = 1;
      gridConfig[botIndex].isProhibit = isProhibit;
    }
  }
  //左面
  if (item.x - 1 >= 0) {
    const leftIndex = gridConfig.findIndex(
      i => i.x === item.x - 1 && i.y === item.y,
    );
    if (isProhibitGrid(gridConfig[leftIndex])) {
      gridConfig[leftIndex].status = 1;
      gridConfig[leftIndex].isProhibit = isProhibit;
    }
  }
  // 右边
  if (item.x + 1 < column) {
    const rightIndex = gridConfig.findIndex(
      i => i.x === item.x + 1 && i.y === item.y,
    );
    if (isProhibitGrid(gridConfig[rightIndex])) {
      gridConfig[rightIndex].status = 1;
      gridConfig[rightIndex].isProhibit = isProhibit;
    }
  }

  // 左上
  if (item.x - 1 < column && item.y - 1 >= 0) {
    const leftTop = gridConfig.findIndex(
      i => i.x === item.x - 1 && i.y === item.y - 1,
    );
    if (isProhibitGrid(gridConfig[leftTop])) {
      gridConfig[leftTop].status = 1;
      gridConfig[leftTop].isProhibit = isProhibit;
    }
  }
  // 左下
  if (item.x - 1 < column && item.y + 1 >= 0) {
    const leftBottom = gridConfig.findIndex(
      i => i.x === item.x - 1 && i.y === item.y + 1,
    );
    if (isProhibitGrid(gridConfig[leftBottom])) {
      gridConfig[leftBottom].status = 1;
      gridConfig[leftBottom].isProhibit = isProhibit;
    }
  }

  // 右上
  if (item.x + 1 < column && item.y - 1 >= 0) {
    const rightTop = gridConfig.findIndex(
      i => i.x === item.x + 1 && i.y === item.y - 1,
    );
    if (isProhibitGrid(gridConfig[rightTop])) {
      gridConfig[rightTop].status = 1;
      gridConfig[rightTop].isProhibit = isProhibit;
    }
  }

  // 右下
  if (item.x + 1 < column && item.y + 1 >= 0) {
    const rightBottom = gridConfig.findIndex(
      i => i.x === item.x + 1 && i.y === item.y + 1,
    );
    if (isProhibitGrid(gridConfig[rightBottom])) {
      gridConfig[rightBottom].status = 1;
      gridConfig[rightBottom].isProhibit = isProhibit;
    }
  }
}
