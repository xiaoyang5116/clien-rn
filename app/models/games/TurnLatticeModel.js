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
  },
  effects: {
    *getTurnLatticeData({ payload }, { call, put, select }) {
      const historyData = yield call(
        LocalStorage.get,
        LocalCacheKeys.TURN_LATTICE_DATA,
      );
      if (historyData === null) {
        const { data } = yield call(GetTurnLattice);
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

        yield put(action('updateState')({ turnLatticeData: data, currentLayer: 0, }));
        return data[0].config

      } else {
        // 初始化
        for (let index = 0; index < historyData.length; index++) {
          const item = historyData[index];
          for (let i = 0; i < item.config.length; i++) {
            const gridConfig = item.config[i]
            gridConfig.status = 0
          }
          // 设置 入口 附近的格子可以打开
          const entranceGrid = item.config.find(i => i.type === "入口")
          setNearbyGridStates(entranceGrid, item)
        }
        yield put(action('updateState')({ turnLatticeData: historyData, currentLayer: 0, }));
        return historyData[0].config
      }
    },

    // 翻开格子
    *openGrid({ payload }, { call, put, select }) {
      const { item } = payload;
      const { turnLatticeData, currentLayer } = yield select(state => state.TurnLatticeModel);
      const { config: gridConfig } = turnLatticeData[currentLayer];

      const curIndex = gridConfig.findIndex(i => i.x === item.x && i.y === item.y);
      gridConfig[curIndex].status = 2;
      gridConfig[curIndex].isOpened = true

      setNearbyGridStates(item, turnLatticeData[currentLayer])

      yield put(action('updateState')({ turnLatticeData }));
      yield call(
        LocalStorage.set,
        LocalCacheKeys.TURN_LATTICE_DATA,
        turnLatticeData
      );
      return gridConfig
    },

    // 领取格子道具
    *getGridProps({ payload }, { call, put, select }) {
      // {"isOpened": true, "prop": { id: 30, num: 1, iconId: 1, quality: 1, }, "status": 2, "type": "道具", "x": 1, "y": 3}
      const { item } = payload
      const { prop } = item
      yield put.resolve(action('PropsModel/sendProps')({ propId: prop.id, num: prop.num, quiet: true }));
      const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: prop.id }));
      Toast.show(`获得${propConfig.name} * ${prop.num}`, BOTTOM_TOP_SMOOTH, 500)

      const { turnLatticeData, currentLayer } = yield select(state => state.TurnLatticeModel);
      const { config: gridConfig } = turnLatticeData[currentLayer];
      const curIndex = gridConfig.findIndex(i => i.x === item.x && i.y === item.y);
      gridConfig[curIndex].type = "空";
      yield put(action('updateState')({ turnLatticeData }));
      yield call(
        LocalStorage.set,
        LocalCacheKeys.TURN_LATTICE_DATA,
        turnLatticeData
      );
      return gridConfig
    },

    // 出口
    *exportGrid({ payload }, { call, put, select }) {
      // console.log("sss");
      const { turnLatticeData, currentLayer } = yield select(state => state.TurnLatticeModel);
      // const { config: gridConfig } = turnLatticeData[currentLayer];
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
