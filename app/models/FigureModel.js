import { GetFigureDataApi } from '../services/GetFigureDataApi';

export default {
    namespace: 'FigureModel',

    state: {
        figureList: [],
    },

    effects: {
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
}
