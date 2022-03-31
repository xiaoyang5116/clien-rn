
import { 
  action,
} from '../constants';

import { GetComposeDataApi } from '../services/GetComposeDataApi';

import lo, { range } from 'lodash';
import Toast from '../components/toast';

export default {
  namespace: 'ComposeModel',

  state: {
    // 合成首页
    listData: [],

    // 合成详细页
    selectComposeId: -1,
    selectComposeDetail: null,

    __data: {
      composeConfig: [],  // 配方配置
    },
  },

  effects: {
    *reload({ }, { select, put, call }) {
      const composeState = yield select(state => state.ComposeModel);
      const data = yield call(GetComposeDataApi);

      if (data != null) {
        composeState.__data.composeConfig.length = 0;
        composeState.__data.composeConfig.push(...data.rules);
      }
    },

    *composeSelected({ payload }, { put, select }) {
      const composeState = yield select(state => state.ComposeModel);
      const { composeId } = payload;
      const config = composeState.__data.composeConfig.find(e => e.id == composeId);

      const stuffsDetail = { title: '所需材料|需求|现有', type: 'stuffs', data: [] };
      for (let k in config.stuffs) {
        const stuff = config.stuffs[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: stuff.id }));
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: stuff.id }));
        stuffsDetail.data.push({ name: propConfig.name, reqNum: stuff.num, currNum: propNum });
      }

      const propsDetail = { title: '工具/环境|需求|现有', type: 'props', data: [] };
      for (let k in config.props) {
        const prop = config.props[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: prop.id }));
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: prop.id }));
        propsDetail.data.push({ name: propConfig.name, reqNum: prop.num, currNum: propNum });
      }

      const targets = [];
      for (let k in config.targets) {
        const item = config.targets[k];
        const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: item.id }));
        const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: item.id }));
        targets.push({ name: propConfig.name, desc: propConfig.desc, currNum: propNum, productNum: item.num });
      }

      yield put(action('updateState')({ 
        selectComposeId: composeId,
        selectComposeDetail: { 
          ...config, 
          requirements: [stuffsDetail, propsDetail], 
          targets: targets 
        },
      }));
    },

    *compose({ payload }, { put, select }) {
      const composeState = yield select(state => state.ComposeModel);
      const { selectNum, composeId } = payload;
      
      let actuallyNum = 0;
      const config = composeState.__data.composeConfig.find(e => e.id == composeId);

      if (lo.isEqual(selectNum, '最大')) {
        const currentStuffs = [];
        for (let k in config.stuffs) {
          const stuff = config.stuffs[k];
          const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: stuff.id }));
          currentStuffs.push({ ...stuff, currNum: propNum});
        }

        const currentProps = [];
        for (let k in config.props) {
          const prop = config.props[k];
          const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: prop.id }));
          currentProps.push({ ...prop, currNum: propNum});
        }

        // 检查工具是否足够
        for (let k in currentProps) {
          const prop = currentProps[k];
          if (prop.currNum < prop.num) {
            Toast.show('工具不足!!!');
            return;
          }
        }

        // 计算最大合成数量
        while (true) {
          currentStuffs.forEach(e => {
            e.currNum -= e.num;
          });
          if (currentStuffs.find(e => e.currNum < 0) != undefined)
            break;
          actuallyNum++;
        }
      } else {
        actuallyNum = parseInt(selectNum);

        // 判断是否足够材料
        for (let k in config.stuffs) {
          const stuff = config.stuffs[k];
          const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: stuff.id }));
          if (propNum < (stuff.num * actuallyNum)) {
            Toast.show('材料不足!!!');
            return;
          }
        }

        // 判断工具是否存在
        for (let k in config.props) {
          const prop = config.props[k];
          const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: prop.id }));
          if (propNum < (prop.num * actuallyNum)) {
            Toast.show('工具不足!!!');
            return;
          }
        }
      }

      if (actuallyNum <= 0) {
        Toast.show('材料或工具不足!!!');
        return;
      }

      const sortTargets = config.targets.map(e => ({ ...e }))
      sortTargets.sort((a, b) => b.rate - a.rate);
      let prevRange = 0;
      sortTargets.forEach(e => {
        e.range = [prevRange, prevRange + e.rate];
        prevRange = e.rate;
      });

      // 扣除材料
      for (let k in config.stuffs) {
        const stuff = config.stuffs[k];
        yield put.resolve(action('PropsModel/use')({ propId: stuff.id, num: (stuff.num * actuallyNum), quiet: true }));
      }

      // 发放道具
      for (let i in range(actuallyNum)) {
        const randValue = lo.random(0, 100, false);
        const hit = sortTargets.find(e => randValue >= e.range[0] && randValue < e.range[1]);
        if (hit == undefined) hit = sortTargets[sortTargets.length - 1];
        yield put.resolve(action('PropsModel/sendProps')({ propId: hit.id, num: hit.num, quiet: true }));
      }

      Toast.show('制作成功，产出{0}个道具!!!'.format(actuallyNum), 'CenterToTop');

      yield put.resolve(action('composeSelected')({ composeId: composeState.selectComposeId }));
    },

    *filter({ payload }, { put, select }) {
      const composeState = yield select(state => state.ComposeModel);
      const { type } = payload;

      composeState.listData.length = 0;
      for (let k in composeState.__data.composeConfig) {
        const item = composeState.__data.composeConfig[k];
        if ((item.attrs.indexOf(type) == -1) && (type != '全部') && (type != ''))
          continue;

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
        // 判断需求道具
        if (enough) {
          for (let k in item.props) {
            const prop = item.props[k];
            const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: prop.id }));
            if (propNum < prop.num) {
              enough = false;
              break;
            }
          }
        }
        composeState.listData.push({ ...item, valid: enough });
      }

      yield put(action('updateState')({}));
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
