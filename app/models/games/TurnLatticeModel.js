import LocalStorage from '../../utils/LocalStorage';
import { action, LocalCacheKeys, BOTTOM_TOP_SMOOTH } from '../../constants';
import EventListeners from '../../utils/EventListeners';
import { GetTurnLattice } from '../../services/GetTurnLattice';
import Toast from '../../components/toast';


export default {
  namespace: 'TurnLatticeModel',
  state: {
    turnLatticeData: [],
    currentLayer: 0,
    curLatticeMazeId: "",
  },

  effects: {
    *getTurnLatticeData({ payload }, { call, put, select }) {
      const { latticeMazeId } = payload
      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );
      console.log("historyData", historyData);
      // 没有打开过
      if (historyData === null || (historyData.find(item => item.latticeMazeId === latticeMazeId) === undefined)) {
        const { latticeMaze } = yield call(GetTurnLattice);
        const currentLatticeMazeData = latticeMaze.find(item => item.latticeMazeId === latticeMazeId)
        const { desc, unlockProps, consumableProps, data } = currentLatticeMazeData
        // 初始化
        for (let index = 0; index < data.length; index++) {
          const item = data[index];
          for (let i = 0; i < item.config.length; i++) {
            const gridConfig = item.config[i]
            gridConfig.isOpened = false
            gridConfig.status = 0
            if (gridConfig.type === undefined) gridConfig.type = "空"
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
        const { desc, data, consumableProps } = currentData
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
      }
    },

    // 解锁 和 消耗 道具
    *consumableProps({ payload }, { call, put, select }) {
      const { curLatticeMazeId } = yield select(state => state.TurnLatticeModel);
      const { latticeMaze } = yield call(GetTurnLattice);
      const currentLatticeMazeData = latticeMaze.find(item => item.latticeMazeId === curLatticeMazeId)

      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );

      if (historyData === null || (historyData.find(item => item.latticeMazeId === curLatticeMazeId) === undefined)) {
        const { unlockProps, consumableProps } = currentLatticeMazeData
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

        // 保存副本
        if (historyData === null) {
          yield call(
            LocalStorage.set,
            LocalCacheKeys.TURN_LATTICE_DATA,
            [currentLatticeMazeData]
          );
        }
        else {
          yield call(
            LocalStorage.set,
            LocalCacheKeys.TURN_LATTICE_DATA,
            [...historyData, currentLatticeMazeData]
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
      // {"isOpened": true, "prop": { id: 30, num: 1, iconId: 1, quality: 1, }, "status": 2, "type": "道具", "x": 1, "y": 3}
      const { item } = payload
      const { prop } = item

      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );

      yield put.resolve(action('PropsModel/sendProps')({ propId: prop.id, num: prop.num, quiet: true }));
      const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: prop.id }));
      Toast.show(`获得${propConfig.name} * ${prop.num}`, BOTTOM_TOP_SMOOTH, 500)

      const { turnLatticeData, currentLayer, curLatticeMazeId } = yield select(state => state.TurnLatticeModel);
      const { config: gridConfig } = turnLatticeData[currentLayer];
      const curIndex = gridConfig.findIndex(i => i.x === item.x && i.y === item.y);
      gridConfig[curIndex].type = "空";
      yield put(action('updateState')({ turnLatticeData }));
      yield call(
        LocalStorage.set,
        LocalCacheKeys.TURN_LATTICE_DATA,
        historyData.map(item => item.latticeMazeId === curLatticeMazeId ? { ...item, data: turnLatticeData } : item)
      );
      return gridConfig
    },

    // 出口
    *exportGrid({ payload }, { call, put, select }) {
      const { turnLatticeData, currentLayer } = yield select(state => state.TurnLatticeModel);
      if (turnLatticeData.length - 1 > currentLayer) {
        yield put(action('updateState')({ currentLayer: currentLayer + 1 }));
        return turnLatticeData[currentLayer + 1].config
      }
      else {
        return null
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
function setNearbyGridStates(item, currentGridConfig) {
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
