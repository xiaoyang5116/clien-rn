import { GetMailDataApi } from '../services/GetMailDataApi';

import { LocalCacheKeys } from "../constants";
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

export default {
    namespace: 'MailBoxModel',

    state: {
        // 信箱数据
        mailBoxData: [],
    },

    effects: {
        *reload({ }, { call, put, select }) {
            const mailData = yield call(LocalStorage.get, LocalCacheKeys.MAIL_DATA);
            const mailConfigData = yield call(GetMailDataApi);
            console.log('mailData', mailConfigData);
            if (mailData != null) {

            }
        },
        *getFigureList({ }, { call, put }) {
            const { data } = yield call(GetFigureDataApi);
            yield put({
                type: 'changeFigureList',
                payload: data.figure
            });
        }
    },

    reducers: {
        changeFigureList(prevState, { payload }) {
            return {
                ...prevState,
                figureList: payload,
            }
        }
    },
    subscriptions: {
        registerReloadEvent({ dispatch }) {
            EventListeners.register('reload', (msg) => {
                dispatch({ 'type': 'reload' });
            });
        },
    }
}
