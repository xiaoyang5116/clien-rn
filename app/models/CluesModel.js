
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
    },

    effects: {
        *reload({ }, { call, put, select }) {
            let cluesList = yield call(LocalStorage.get, LocalCacheKeys.CLUES_DATA);
            if (cluesList !== null) {
                yield put.resolve(action('updateState')({ cluesList }));
            }
            if (cluesList === null) {
                const { clueConfig } = yield call(GetClueConfigDataApi);
                let newCluesList = []
                for (let index = 0; index < clueConfig.length; index++) {
                    let clues = {
                        cluesType: clueConfig[index].cluesType,
                        cluesTypeName: clueConfig[index].cluesTypeName,
                        filter: clueConfig[index].filter,
                        data: []
                    }
                    for (let d = 0; d < clueConfig[index].data.length; d++) {
                        const clueData = yield call(GetClueDataApi, { cluesType: clueConfig[index].cluesType, cluesName: clueConfig[index].data[d] });
                        clues.data.push(clueData)
                    }
                    newCluesList.push(clues)
                }
                yield put.resolve(action('saveCluesList')(newCluesList));
            }
        },
        *addClue({ payload }, { call, put, select }) {
            // payload: { cluesType: "CLUES", cluesName: "xiansuo1" }
            const { cluesList } = yield select(state => state.CluesModel);
            const clueData = yield call(GetClueDataApi, payload);
            if (clueData === undefined) {
                // 没有数据
                return;
            }
            else {
                const newCluesList = cluesList.map(f => f.cluesType === payload.cluesType ? { ...f, data: [clueData, ...f.data] } : f);
                yield put.resolve(action('saveCluesList')(newCluesList));
            }
        },

        // 保存线索
        *saveCluesList({ payload }, { call, put, select }) {
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

