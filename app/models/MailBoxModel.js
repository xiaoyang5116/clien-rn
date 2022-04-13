import { GetFigureDataApi } from '../services/GetFigureDataApi';

import { LocalCacheKeys } from "../constants";
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

export default {
    namespace: 'MailBoxModel',

    state: {
        mailBoxList: [],
    },

    effects: {
        *reload({ }, { call, put, select }) {
            const mailData = yield call(LocalStorage.get, LocalCacheKeys.MAIL_DATA);
            console.log('mailData', mailData);
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
