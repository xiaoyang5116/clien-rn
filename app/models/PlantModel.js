
import {
    action,
} from '../constants';

import { GetPlantComposeDataApi } from '../services/GetPlantComposeDataApi';
import EventListeners from '../utils/EventListeners';

import Toast from '../components/toast';

export default {
    namespace: 'PlantModel',

    state: {
        plantRecipeList: [],  // 页面显示的种植配方数据
        plantRecipeDetail: {
            id: null,  // 配方id
            stuffsDetail: [],  // 原材料
            propsDetail: [],  // 辅助材料
            targets: []  // 产品
        },

        plantComposeConfig: []  // 种植配方 配置 数据
    },

    effects: {
        *reload({ }, { select, put, call }) {
            const composeState = yield select(state => state.PlantModel);
            const data = yield call(GetPlantComposeDataApi);

            if (data != null) {
                composeState.plantComposeConfig.length = 0;
                composeState.plantComposeConfig.push(...data.rules);
            }
        },

        // 默认排序
        *defaultSort({ }, { put, select, call }) {
            const { plantComposeConfig } = yield select(state => state.PlantModel);
            let validData = []
            let notValidData = []

            for (let i = 0; i < plantComposeConfig.length; i++) {
                const item = plantComposeConfig[i];
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
                if (enough) {
                    validData.push({ ...item, valid: enough })
                } else {
                    notValidData.push({ ...item, valid: enough })
                }
            }

            const newPlantRecipeList = [...validData, ...notValidData]
            yield put(action("updateState")({ plantRecipeList: newPlantRecipeList }))
        },

        // 排序方法
        *sortFunction({ payload }, { put, select, call }) {
            const { plantRecipeList } = yield select(state => state.PlantModel);
            const newPlantRecipeList = plantRecipeList.sort(compareSort(payload))
            yield put(action("updateState")({ plantRecipeList: newPlantRecipeList }))
        },

        // 配方详情
        *formulaDetail({ payload }, { put, select, call }) {
            const stuffsDetail = []
            for (let k in payload.stuffs) {
                const stuff = payload.stuffs[k];
                const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: stuff.id }));
                const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: stuff.id }));
                stuffsDetail.push({ name: propConfig.name, reqNum: stuff.num, currNum: propNum });
            }

            const propsDetail = [];
            for (let k in payload.props) {
                const prop = payload.props[k];
                const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: prop.id }));
                const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: prop.id }));
                propsDetail.push({ name: propConfig.name, reqNum: prop.num, currNum: propNum });
            }

            const targets = [];
            for (let k in payload.targets) {
                const item = payload.targets[k];
                const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: item.id }));
                const propNum = yield put.resolve(action('PropsModel/getPropNum')({ propId: item.id }));
                targets.push({ name: propConfig.name, desc: propConfig.desc, currNum: propNum, productNum: item.num });
            }
            yield put(action('updateState')({
                plantRecipeDetail: {
                    id: payload.id,
                    stuffsDetail,
                    propsDetail,
                    targets,
                },
            }));
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

function compareSort(property) {
    return function (obj1, obj2) {
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value1 - value2;     // 升序
    }
}
