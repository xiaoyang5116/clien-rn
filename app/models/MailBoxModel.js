import { GetMailDataApi } from '../services/GetMailDataApi';

import {
    action,
    LocalCacheKeys
} from "../constants";
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import { now, toDays } from '../utils/DateTimeUtils';


export default {
    namespace: 'MailBoxModel',

    state: {
        //  当前人物id
        figureId: '',
        // 当前的邮件key
        currentKey: '',
        // 当前的邮件数据
        currentMailData: [],
        // 当前的邮件是否完成
        currentIsFinish: false,
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
                const initMaildata = [{
                    id: '02', currentKey: "p1", isFinish: false, historyData: [
                        { key: 'p1', status: 'receive', isOpen: false, mailContent: '你迅速跑过去，地面有些东西。', time: now() },
                    ]
                }]
                const initSuccess = yield call(LocalStorage.set, LocalCacheKeys.MAIL_DATA, initMaildata);
                mailData = yield call(LocalStorage.get, LocalCacheKeys.MAIL_DATA);
            }
            yield put(action('updateMailHistoryData')(mailData));
        },

        // 获取邮件配置数据
        *getMailConfigData({ }, { call, put }) {
            const { mailData } = yield call(GetMailDataApi);
            yield put(action('updataMailConfigData')(mailData));
        },

        // 更改当前人物的邮件信息
        *changeCurrentFigureMailData({ payload }, { call, put }) {
            yield put(action('updateCurrentFigureMailData')(payload));
        },
        // 添加新邮件
        *addNewMail({ payload }, { call, put, select }) {
            const { mailHistoryData } = yield select(state => state.MailBoxModel);
            // 更新当前的邮件历史数据
            const currentMailData = mailHistoryData.find(f => f.id === payload.id)
            yield put(action('updateCurrentFigureMailData')(currentMailData));

            const oldMailData = currentMailData.historyData.filter(f => f.key === payload.newMailData.key)
            if (oldMailData.length > 0) return
            const currentMail = {
                key: payload.newMailData.key,
                status: 'receive',
                isOpen: false,
                mailContent: payload.newMailData.content,
                time: now(),
            }

            // 更新邮件历史数据
            const newMailData = mailHistoryData.map(i => i.id === payload.id ? { ...i, historyData: [currentMail, ...i.historyData] } : i)
            yield put(action('updateMailHistoryData')(newMailData));
        },

        // 打开邮件
        *openLetter({ payload }, { call, put, select }) {
            const { currentMailData } = yield select(state => state.MailBoxModel);
            const currentMail = currentMailData.map(m => m.key === payload.key ? { ...m, isOpen: true } : m);
            yield put(action('updateCurrentMailData')(currentMail));
            yield put.resolve(action('saveHistory')(currentMail));
        },
        // 保存历史记录
        *saveHistory({ payload }, { call, put, select }) {
            const { mailHistoryData, figureId } = yield select(state => state.MailBoxModel);
            const newHistory = mailHistoryData.map(m => m.id === figureId ? { ...m, historyData: payload } : m);
            yield call(LocalStorage.set, LocalCacheKeys.MAIL_DATA, newHistory);
            yield put(action('updateMailHistoryData')(newHistory));
        },
    },

    reducers: {
        // 更新邮件历史数据
        updateMailHistoryData(prevState, { payload }) {
            return {
                ...prevState,
                mailHistoryData: payload
            }
        },
        // 获取邮件配置数据
        updataMailConfigData(prevState, { payload }) {
            return {
                ...prevState,
                mailConfigData: payload
            }
        },
        // 更新当前人物的邮件信息
        updateCurrentFigureMailData(prevState, { payload }) {
            return {
                ...prevState,
                figureId: payload.id,
                currentKey: payload.currentKey,
                currentIsFinish: payload.isFinish,
                currentMailData: payload.historyData,
            }
        },
        // 更新当前邮件信息
        updateCurrentMailData(prevState, { payload }) {
            return {
                ...prevState,
                currentMailData: payload
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
