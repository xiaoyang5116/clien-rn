
import {
    action,
    LocalCacheKeys,
    UserPersistedKeys
} from '../constants';

import lo, { range } from 'lodash';
import { GetPlantComposeDataApi } from '../services/GetPlantComposeDataApi';
import { GetLingTianDataApi } from '../services/GetLingTianDataApi';

import EventListeners from '../utils/EventListeners';
import LocalStorage from '../utils/LocalStorage';
import Toast from '../components/toast';
import { now } from '../utils/DateTimeUtils';
import { confirm } from '../components/dialog/ConfirmDialog';
import { DeviceEventEmitter } from 'react-native';

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

        plantComposeConfig: [],  // 种植配方 配置 数据

        lingTianData: [],  // 灵田数据

        // 当前选中的灵田
        selectedLingTian: {
            lingTianName: null,
            lingTianId: null,
        },
    },

    effects: {
        *reload({ }, { select, put, call }) {
            const composeState = yield select(state => state.PlantModel);

            // 种植配方数据
            const data = yield call(GetPlantComposeDataApi);
            if (data != null) {
                composeState.plantComposeConfig.length = 0;
                composeState.plantComposeConfig.push(...data.rules);
            }

            // 初始化灵田数据
            let lingTianData = yield call(LocalStorage.get, LocalCacheKeys.LINGTIAN_DATA);
            if (lingTianData === null) {
                const { data } = yield call(GetLingTianDataApi);
                yield call(LocalStorage.set, LocalCacheKeys.LINGTIAN_DATA, data);
                yield put(action('updateState')({ lingTianData: data }))
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
        },

        // 获取灵田数据
        *getLingTianData({ payload }, { put, select, call }) {
            const lingTianData = yield call(LocalStorage.get, LocalCacheKeys.LINGTIAN_DATA);
            yield put(action('updateState')({ lingTianData }))
        },

        // 当前选中的灵田
        *selectedLingTian({ payload }, { put, select, call }) {
            const composeState = yield select(state => state.PlantModel);
            composeState.selectedLingTian.lingTianName = payload.lingTianName
            composeState.selectedLingTian.lingTianId = payload.lingTianId
        },

        // 种植
        *plant({ payload }, { put, select, call }) {
            // {"attrs": ["材料"], 
            // "desc": "冰镇西瓜", 
            // "id": 101, 
            // "lingQiZhi": 10, 
            // "name": "西瓜", 
            // "props": [{"id": 51, "num": 1}], "quality": 2,
            // "stuffs": [{"id": 20, "num": 1}, {"id": 21, "num": 2}], "tags": [], 
            // "targets": [{"id": 52, "num": 1, "rate": 80}, {"id": 53, "num": 1, "rate": 20}],
            // "time": 1000, 
            // "valid": true}
            const composeState = yield select(state => state.PlantModel);

            // 扣除原料
            for (let k in payload.stuffs) {
                const stuff = payload.stuffs[k];
                yield put.resolve(action('PropsModel/use')({ propId: stuff.id, num: stuff.num, quiet: true }));
            }
            // 扣除辅助材料
            for (let k in payload.props) {
                const props = payload.props[k];
                yield put.resolve(action('PropsModel/use')({ propId: props.id, num: props.num, quiet: true }));
            }

            // 随机产生种植成果
            const sortTargets = payload.targets.map(e => ({ ...e }))
            sortTargets.sort((a, b) => b.rate - a.rate);
            let prevRange = 0;
            sortTargets.forEach(e => {
                e.range = [prevRange, prevRange + e.rate];
                prevRange = e.range[1];
            });
            const randValue = lo.random(0, 100, false);
            let hit = sortTargets.find(e => randValue >= e.range[0] && randValue < e.range[1]);
            if (hit == undefined) hit = sortTargets[sortTargets.length - 1];
            // 发送道具，这就先存储 种植成果的道具信息
            // yield put.resolve(action('PropsModel/sendProps')({ propId: hit.id, num: hit.num, quiet: true }));

            for (let index = 0; index < composeState.lingTianData.length; index++) {
                // 找到对应名字的灵田
                if (composeState.lingTianData[index].name === composeState.selectedLingTian.lingTianName) {
                    for (let l = 0; l < composeState.lingTianData[index].lingTian.length; l++) {
                        // 找到对应 id 的灵田格子,进行修改
                        if (composeState.lingTianData[index].lingTian[l].id === composeState.selectedLingTian.lingTianId) {
                            composeState.lingTianData[index].lingTian[l].lingQiZhi -= payload.lingQiZhi
                            composeState.lingTianData[index].lingTian[l].status = 2
                            composeState.lingTianData[index].lingTian[l].targets = hit
                            composeState.lingTianData[index].lingTian[l].plantTime = now()
                            composeState.lingTianData[index].lingTian[l].needTime = payload.time
                            composeState.lingTianData[index].lingTian[l].plantRecipeId = payload.id
                        }
                    }
                }
            }
            Toast.show("种植成功")

            // 种植时间
            if (payload.time >= 100) {
                const v = yield put.resolve(action('UserModel/checkAndSetPersistedState')({ key: UserPersistedKeys.PLANT_CONFIRM }));
                if (v) DeviceEventEmitter.emit('__@PlantModel.noticationIcon');
            }

            yield put.resolve(action("updateLingTianData")(composeState.lingTianData))
        },

        // 获取采集的道具数据
        *getCollectionData({ payload }, { put, select, call }) {
            const composeState = yield select(state => state.PlantModel);

            let targetsData = {}  // {"id": 1006, "num": 1, "range": [0, 80], "rate": 80}

            for (let index = 0; index < composeState.lingTianData.length; index++) {
                // 找到对应名字的灵田
                if (composeState.lingTianData[index].name === payload.lingTianName) {
                    for (let l = 0; l < composeState.lingTianData[index].lingTian.length; l++) {
                        // 找到对应 id 的灵田格子,进行修改
                        if (composeState.lingTianData[index].lingTian[l].id === payload.lingTianId) {
                            targetsData = composeState.lingTianData[index].lingTian[l].targets
                            composeState.lingTianData[index].lingTian[l].status = 1
                        }
                    }
                }
            }

            // 获取道具配置
            const propConfig = yield put.resolve(action('PropsModel/getPropConfig')({ propId: targetsData.id }));

            return { propConfig, currentLingTianData: composeState.lingTianData, targetsData }
        },
        // 采集
        *collection({ payload }, { put, select, call }) {
            const { lingTianData, targetsData, propConfig } = payload

            // 发放道具
            yield put.resolve(action('PropsModel/sendProps')({ propId: targetsData.id, num: targetsData.num, quiet: true }));
            Toast.show(`采集成功，获得道具: ${propConfig.name}`, 'CenterToTop');

            // 更新数据
            yield put.resolve(action("updateLingTianData")(lingTianData))
        },

        // 改变灵田状态
        *changePlantStatus({ payload }, { put, select, call }) {
            const composeState = yield select(state => state.PlantModel);
            for (let index = 0; index < composeState.lingTianData.length; index++) {
                // 找到对应名字的灵田
                if (composeState.lingTianData[index].name === payload.lingTianName) {
                    for (let l = 0; l < composeState.lingTianData[index].lingTian.length; l++) {
                        // 找到对应 id 的灵田格子,进行修改
                        if (composeState.lingTianData[index].lingTian[l].id === payload.lingTianId) {
                            composeState.lingTianData[index].lingTian[l].status = payload.status
                        }
                    }
                }
            }

            yield put.resolve(action("updateLingTianData")(composeState.lingTianData))
        },

        // 获取 对应类型 道具数据
        *getProps({ payload }, { put, select, call }) {
            const allProps = yield put.resolve(action("PropsModel/getBagProps")())
            const propsData = allProps.filter(i => i.type === payload.type)
            return propsData
        },

        // 改变灵气值
        *changeLingQiZhi({ payload }, { put, select, call }) {
            const composeState = yield select(state => state.PlantModel);
            for (let index = 0; index < composeState.lingTianData.length; index++) {
                // 找到对应名字的灵田
                if (composeState.lingTianData[index].name === payload.lingTianName) {
                    for (let l = 0; l < composeState.lingTianData[index].lingTian.length; l++) {
                        if (composeState.lingTianData[index].lingTian[l].id === payload.lingTianId) {
                            composeState.lingTianData[index].lingTian[l].lingQiZhi += payload.lingQiZhi
                            const lingQiZhi = composeState.lingTianData[index].lingTian[l].lingQiZhi
                            if (lingQiZhi % 1000 !== 0) {
                                composeState.lingTianData[index].lingTian[l].grade = parseInt(lingQiZhi / 1000) + 1
                            }
                        }
                    }
                }
            }

            // 扣除道具
            yield put.resolve(action('PropsModel/use')({ propId: payload.propsId, num: 1, quiet: true }));
            Toast.show(`灵气值增加${payload.lingQiZhi}`)

            yield put.resolve(action("updateLingTianData")(composeState.lingTianData))
        },

        // 加速种植时间
        *acceleratePlantTime({ payload }, { put, select, call }) {
            const composeState = yield select(state => state.PlantModel);
            for (let index = 0; index < composeState.lingTianData.length; index++) {
                // 找到对应名字的灵田
                if (composeState.lingTianData[index].name === payload.lingTianName) {
                    for (let l = 0; l < composeState.lingTianData[index].lingTian.length; l++) {
                        if (composeState.lingTianData[index].lingTian[l].id === payload.lingTianId) {
                            composeState.lingTianData[index].lingTian[l].needTime -= payload.plantTime
                        }
                    }
                }
            }

            // 扣除道具
            yield put.resolve(action('PropsModel/use')({ propId: payload.propsId, num: 1, quiet: true }));
            Toast.show(`种植时间减少${payload.plantTime}`)

            yield put.resolve(action("updateLingTianData")(composeState.lingTianData))
        },

        // 更新数据
        *updateLingTianData({ payload }, { put, select, call }) {
            const newLingTianData = [...payload]
            yield call(LocalStorage.set, LocalCacheKeys.LINGTIAN_DATA, newLingTianData);
            yield put(action('updateState')({ lingTianData: newLingTianData }))
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
