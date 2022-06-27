
import { 
  action, errorMessage,
} from "../constants";

import lo from 'lodash';

import EventListeners from '../utils/EventListeners';
import { px2pd } from "../constants/resolution";
import { GetBooksDataApi } from "../services/GetBooksDataApi";
import { GetBookConfigDataApi } from "../services/GetBookConfigDataApi";
import { GetCollectDataApi } from "../services/GetCollectDataApi";
import { now } from '../utils/DateTimeUtils';

const pxWidth = 1000; // 像素宽度
const pxHeight = 1300; // 像素高度
const pxGridWidth = 150;  // 格子像素宽度
const pxGridHeight = 150; // 格子像素高度
const topFixed = 8;
const leftFixed = 10;

const maxColumns = Math.floor(pxWidth / pxGridWidth);
const maxRows = Math.floor(pxHeight / pxGridHeight);

export default {
  namespace: 'CollectModel',

  state: {
    __data: {
      collects: [], // 所有书本的收集配置
    },

    gridsData: {},
    status: {},
    bags: {},
  },

  effects: {
    *reload({ }, { call, put, select }) {
      const collectState = yield select(state => state.CollectModel);

      collectState.__data.collects.length = 0;
      const booksConfig = yield call(GetBooksDataApi);
      for (let k in booksConfig.books.list) {
        const bookId = booksConfig.books.list[k];
        const bookConfig = yield call(GetBookConfigDataApi, bookId);
        if (bookConfig != null && lo.isArray(bookConfig.book.collect_list)) {
          for (let k in bookConfig.book.collect_list) {
            const fileName = bookConfig.book.collect_list[k];
            const config = yield call(GetCollectDataApi, bookId, fileName);
            if (config != null && lo.isArray(config.collects)) {
              collectState.__data.collects.push(...config.collects);
            }
          }
        }
      }
    },

    *generateGridData({ payload }, { call, put }) {
      const { collectId, itemsNum } = payload;

      const hitList = [];
      const array = lo.range(maxColumns * maxRows);
    
      for (let i = 0; i < itemsNum; i++) {
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

      const grids = [];

      hitList.forEach(id => {
        const rows = Math.floor(id / maxColumns);
        const cols = id % maxColumns;

        // 随机半径偏移量
        let randLeft = 0;
        let randTop = 0;
        if (cols == 0) {
          randLeft = lo.random(0, 20);
        } else if (cols == (maxColumns - 1)) {
          randLeft = lo.random(-20, 0);
        } else {
          randLeft = lo.random(-10, 10);
        }
        if (rows == 0) {
          randTop = lo.random(0, 20);
        } else if (rows == (maxRows - 1)) {
          randTop = lo.random(-20, 0);
        } else {
          randTop = lo.random(-10, 10);
        }

        const top = (rows * px2pd(pxGridHeight)) + topFixed + randTop;
        const left = (cols * px2pd(pxGridWidth)) + leftFixed + randLeft;

        grids.push({ 
          id,
          top,
          left,
          collectId,
          //
          show: true,
          itemId: lo.random(1, 7), 
          effectId: lo.random(1, 3),
        });
      });

      return grids;
    },

    *getGridData({ payload }, { call, put, select }) {
      const { collectId } = payload;
      const collectState = yield select(state => state.CollectModel);

      const config = collectState.__data.collects.find(e => e.id == collectId);
      if (lo.isEmpty(config)) return [];

      if (lo.isEmpty(collectState.status[collectId])) {
        const itemsNum = config.periods[0].itemsNum;
        //
        const data = yield put.resolve(action('generateGridData')({ collectId, itemsNum }));
        collectState.gridsData[collectId] = [];
        collectState.gridsData[collectId].push(...data);
        // 初始化
        collectState.status[collectId] = {
          lastRefreshTime: now(),
          periodId: 1,
          times: 1,
        };
        // 储物袋
        collectState.bags[collectId] = [];
      } else {
        const status = collectState.status[collectId];
        // 时间到，进入下一个刷新周期
        if (now() > (status.lastRefreshTime + config.refresh_period * 1000)) {
          const nextPeriodId = status.periodId >= config.periods.length ? 1 : (status.periodId + 1);
          const itemsNum = config.periods[nextPeriodId - 1].itemsNum;
          //
          const data = yield put.resolve(action('generateGridData')({ collectId, itemsNum }));
          collectState.gridsData[collectId] = [];
          collectState.gridsData[collectId].push(...data);
          //
          status.lastRefreshTime = now();
          status.periodId = nextPeriodId;
          status.times += 1;
        }
      }
      return collectState.gridsData[collectId];
    },

    *hideGrid({payload}, { call, put, select }) {
      const { id, collectId } = payload;
      const collectState = yield select(state => state.CollectModel);

      const config = collectState.__data.collects.find(e => e.id == collectId);
      const found = collectState.gridsData[collectId].find(e => e.id == id);
      if (found == undefined || config == undefined) return;

      const foundItem = config.items.find(e => e.id == found.itemId);
      if (foundItem == undefined) {
        errorMessage(`收集系统配置异常！collectId=${collectId}，缺失(itemId=${found.itemId})配置`);
        return;
      }

      found.show = false;
      const props = foundItem.props;
      const bag = collectState.bags[collectId];

      props.forEach(e => {
        const { propId, num } = e;
        const exists = bag.find(b => b.propId == propId);
        if (exists != undefined) {
          exists.num += num;
        } else {
          bag.push({ propId, num });
        }
      });
    },

    *getVisableGrids({payload}, { call, put, select }) {
      const { collectId } = payload;
      const collectState = yield select(state => state.CollectModel);
      return collectState.gridsData[collectId].filter(e => e.show);
    },

    *getBagItems({payload}, { call, put, select }) {
      const { collectId } = payload;
      const collectState = yield select(state => state.CollectModel);

      const bag = collectState.bags[collectId];
      const list = [];

      for (let k in bag) {
        const v = bag[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: v.propId }));
        const item = { ...v, iconId: propConfig.iconId, name: propConfig.name };
        list.push(item);
      }

      // 发放道具
      if (list.length > 0) {
        yield put.resolve(action('PropsModel/sendPropsBatch')({ props: list }));
        bag.length = 0;
      }

      return list;
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
