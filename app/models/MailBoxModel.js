import { GetMailConfigApi } from '../services/GetMailConfigApi';
import { GetMailDataApi } from '../services/GetMailDataApi';

import {
    action,
    LocalCacheKeys
} from "../constants";
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import { now } from '../utils/DateTimeUtils';


export default {
    namespace: 'MailBoxModel',

    state: {
        // 当前邮件id
        currentMailId: '',

        //  当前人物id
        currentFigureId: '',

        // 当前的邮件key
        currentKey: '',

        // 邮件历史数据
        mailHistoryData: [],

        // 邮件配置文件
        mailConfigData: [],
    },

    effects: {
        // 加载邮件历史数据
        *reload({ }, { call, put, select }) {
            let mailData = yield call(LocalStorage.get, LocalCacheKeys.MAIL_DATA);
            if (mailData === null) {
                yield put.resolve(action('getMailConfigData')());
                const { mailConfigData } = yield select(state => state.MailBoxModel);
                const initMaildata = []
                mailConfigData.forEach(item => {
                    if (item.require.day === '1') {
                        initMaildata.push({
                            mailId: item.mailId,
                            figureId: item.figureId,
                            title: item.title,
                            currentKey: item.startKey,
                            isFinish: false,
                            historyData: [
                                {
                                    key: item.startKey, status: 'receive', isOpen: false, time: now(),
                                    mailContent: item.mail.find(f => f.key === item.startKey).content,
                                },
                            ]
                        })
                    }
                });
                const initSuccess = yield call(LocalStorage.set, LocalCacheKeys.MAIL_DATA, initMaildata);
                mailData = yield call(LocalStorage.get, LocalCacheKeys.MAIL_DATA);
            }
            yield put.resolve(action('updateMailHistoryData')(mailData));
        },
        // 获取邮件配置数据
        *getMailConfigData({ }, { call, put }) {
            const mailConfigData = []
            const { mail } = yield call(GetMailConfigApi);
            for (let item in mail.mailList) {
                const { data } = yield call(GetMailDataApi, mail.mailList[item]);
                mailConfigData.push(data);
            }
            yield put(action('updateMailConfigData')(mailConfigData));
        },
        // 更改当前的邮件数据
        *changeCurrentMailData({ payload }, { call, put }) {
            yield put(action('updateCurrentMailData')(payload));
        },
        // 添加新邮件
        *addNewMail({ payload }, { call, put, select }) {
            const { mailHistoryData, mailConfigData, currentFigureId, currentMailId } = yield select(state => state.MailBoxModel);
            const addHistoryData = {
                key: payload.tokey,
                status: 'receive',
                isOpen: false,
                time: now() + (parseInt(payload.nextTime) * 1000),
                mailContent: mailConfigData.find(m => m.mailId === currentMailId).mail.find(f => f.key === payload.tokey).content,
            }
            const newMailData = mailHistoryData.map(m => m.mailId === currentMailId ? {
                ...m,
                historyData: [addHistoryData, ...m.historyData]
            } : m);

            yield put.resolve(action('saveHistory')(newMailData));
        },

        // 打开邮件
        *openLetter({ payload }, { call, put, select }) {
            const { mailHistoryData, currentMailId } = yield select(state => state.MailBoxModel);
            const newMailData = mailHistoryData.map(m => m.mailId === currentMailId ? {
                ...m,
                historyData: m.historyData.map(i => i.key === payload.key ? { ...i, isOpen: true } : i)
            } : m);
            yield put.resolve(action('saveHistory')(newMailData));
        },

        // 回信
        *replyLetter({ payload }, { call, put, select }) {
            // {"content": "去拿菜刀", "nextTime": "5", "tokey": "p2"}
            // { content: "退出", tokey: "finish" }
            const { mailHistoryData, currentKey, currentFigureId, currentMailId } = yield select(state => state.MailBoxModel);
            let newMailData = []
            // 当前邮件添加回信
            if (payload.tokey !== 'finish') {
                newMailData = mailHistoryData.map(m => m.mailId === currentMailId ? {
                    ...m,
                    currentKey: payload.tokey,
                    historyData: m.historyData.map(i => i.key === currentKey ? { ...i, replyContent: payload.content, status: "reply" } : i)
                } : m);
                yield put(action('updateCurrentMailData')({ mailId: currentMailId, figureId: currentFigureId, currentKey: payload.tokey, }));
                yield put.resolve(action('saveHistory')(newMailData));
                yield put(action('addNewMail')({ tokey: payload.tokey, nextTime: payload.nextTime, id: currentFigureId }));
            }
            else {
                newMailData = mailHistoryData.map(m => m.mailId === currentMailId ? {
                    ...m,
                    currentKey: payload.tokey,
                    isFinish: true,
                    historyData: m.historyData.map(i => i.key === currentKey ? { ...i, replyContent: payload.content, status: "reply" } : i)
                } : m);
                yield put(action('updateCurrentMailData')({ mailId: currentMailId, figureId: currentFigureId, currentKey: payload.tokey }));
                yield put.resolve(action('saveHistory')(newMailData));
            }
        },

        // 保存历史记录
        *saveHistory({ payload }, { call, put, select }) {
            yield call(LocalStorage.set, LocalCacheKeys.MAIL_DATA, payload);
            yield put(action('updateMailHistoryData')(payload));
        },
    },

    reducers: {
        // 更新邮件历史数据
        updateMailHistoryData(prevState, { payload }) {
            // [{
            //    mailId:'qgdg_day_1', 
            //    figureId: '02', currentKey: "p1", isFinish: false, title: '乞丐大哥来信', 
            //    historyData: [
            //        { key: 'p1', status: 'receive', isOpen: false, mailContent: '你迅速跑过去，地面有些东西。', time: '2019-01-01' },
            //        { key: 'p1', status: 'reply', isOpen: true, mailContent: '你迅速跑过去，地面有些东西。', replyContent: '去拿菜刀', time: '2019-01-01' },
            //    ],
            //  }]
            return {
                ...prevState,
                mailHistoryData: payload
            }
        },
        // 获取邮件配置数据
        updateMailConfigData(prevState, { payload }) {
            return {
                ...prevState,
                mailConfigData: payload
            }
        },
        // 更新当邮件信息
        updateCurrentMailData(prevState, { payload }) {
            return {
                ...prevState,
                currentMailId: payload.mailId,
                currentFigureId: payload.figureId,
                currentKey: payload.currentKey,
            }
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
