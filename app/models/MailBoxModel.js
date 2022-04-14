import { GetMailDataApi } from '../services/GetMailDataApi';

import {
    action,
    LocalCacheKeys
} from "../constants";
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import { update } from 'lodash';


export default {
    namespace: 'MailBoxModel',

    state: {
        // 邮件历史数据
        mailHistoryData: [],

        // 邮件配置文件
        mailConfigData: [],
    },

    effects: {
        // 加载邮件历史数据
        *reload({ }, { call, put, select }) {
            // yield call(LocalStorage.clear, LocalCacheKeys.MAIL_DATA);
            const mailData = yield call(LocalStorage.get, LocalCacheKeys.MAIL_DATA);
            if (mailData === null) {
                const initMaildata = [{ id: '02', currentKey: "p1", isFinish: false, historyData: []}]
                const initSuccess = yield call(LocalStorage.set, LocalCacheKeys.MAIL_DATA, initMaildata);
                mailData = yield call(LocalStorage.get, LocalCacheKeys.MAIL_DATA);
            }
            yield put(action('updateMailHistoryData')(mailData));
        },

        // 获取邮件配置数据
        *getMailConfigData({ }, { call, put }) {
            const { mailData } = yield call(GetMailDataApi);
            yield put(action('changeMailConfigData')(mailData));
        },
    },

    reducers: {
        changeMailConfigData(prevState, { payload }) {
            return {
                ...prevState,
                mailConfigData: payload
            }
        },
        updateMailHistoryData(prevState, { payload }) {
            console.log("MailHistoryData", payload);
            // if (payload.length < 12) {

            // }
            return {
                ...prevState,
                mailHistoryData: payload
            }
        },
    },
    subscriptions: {
        registerReloadEvent({ dispatch }) {
            EventListeners.register('reload', (msg) => {
                dispatch({ 'type': 'reload' });
            });
        },
    }
}
