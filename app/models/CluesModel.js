
import {
    action,
    LocalCacheKeys,
    DeviceEventEmitter,
    EventKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import { GetClueDataApi } from "../services/GetClueDataApi";
import { GetClueConfigDataApi } from "../services/GetClueConfigDataApi";


export default {
    namespace: 'CluesModel',

    state: {
        cluesList: [],
        cluesConfigData: {},
    },

    effects: {
        *reload({ }, { call, put, select }) {
            let cluesList = yield call(LocalStorage.get, LocalCacheKeys.CLUES_DATA);
            const { cluesConfigData } = yield call(GetClueConfigDataApi);
            if (cluesList !== null) {
                yield put.resolve(action('updateState')({ cluesList, cluesConfigData }));
            }
            // 当本地 线索数据 为 null 时, 根据配置文件获取默认的线索 id,找到对应的线索数据,更新线索列表并存储到本地
            if (cluesList === null) {
                const { cluesConfigData } = yield call(GetClueConfigDataApi);
                const { defaultClues } = cluesConfigData;
                const { allCluesListData } = yield call(GetClueDataApi);
                let newCluesList = [];
                for (let index = 0; index < defaultClues.length; index++) {
                    for (let i = 0; i < allCluesListData.length; i++) {
                        if (defaultClues[index] === allCluesListData[i].id) {
                            newCluesList.push({ ...allCluesListData[i], state: true });
                        }
                    }
                }
                yield call(LocalStorage.set, LocalCacheKeys.CLUES_DATA, newCluesList);
                yield put(action('updateState')({ cluesConfigData, cluesList: newCluesList }));
            }
            // let cluesList = yield call(LocalStorage.get, LocalCacheKeys.CLUES_DATA);
            // if (cluesList !== null) {
            //     yield put.resolve(action('updateState')({ cluesList }));
            // }
            // if (cluesList === null) {
            //     const { clueConfig } = yield call(GetClueConfigDataApi);
            //     let newCluesList = []
            //     for (let index = 0; index < clueConfig.length; index++) {
            //         let clues = {
            //             cluesType: clueConfig[index].cluesType,
            //             cluesTypeName: clueConfig[index].cluesTypeName,
            //             filter: clueConfig[index].filter,
            //             data: []
            //         }
            //         for (let d = 0; d < clueConfig[index].data.length; d++) {
            //             const clueData = yield call(GetClueDataApi, { cluesType: clueConfig[index].cluesType, cluesName: clueConfig[index].data[d] });
            //             clues.data.push(clueData)
            //         }
            //         newCluesList.push(clues)
            //     }
            //     yield put.resolve(action('saveCluesList')(newCluesList));
            // }
        },

        // 获取线索配置数据
        *getCluesConfigData({ }, { call, put, select }) {
            const { cluesConfigData } = yield call(GetClueConfigDataApi);
            yield put(action('updateState')({ cluesConfigData }));
        },

        // 添加线索
        *addClues({ payload }, { call, put, select }) {
            // payload: [1,2,3]
            const { cluesList } = yield select(state => state.CluesModel);
            const { allCluesListData } = yield call(GetClueDataApi);
            let newCluesList = [];
            for (let index = 0; index < payload.length; index++) {
                // 跳过已经存在的线索
                if (cluesList.filter(item => item.id === payload[index]).length !== 0) {
                    continue;
                }
                for (let i = 0; i < allCluesListData.length; i++) {
                    if (payload[index] === allCluesListData[i].id) {
                        newCluesList.push({ ...allCluesListData[i], state: true });
                    }
                }
            }
            yield put.resolve(action('saveCluesList')([...newCluesList, ...cluesList]));
        },

        // 保存线索
        * saveCluesList({ payload }, { call, put, select }) {
            yield call(LocalStorage.set, LocalCacheKeys.CLUES_DATA, payload);
            yield put(action('updateState')({ cluesList: payload }));
        }
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
                return dispatch({ 'type': 'reload' });
            });
        },
    }
}

