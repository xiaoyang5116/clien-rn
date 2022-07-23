import React, { useState, useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';

import {
    AppDispath,
    action,
    connect,
    EventKeys
} from '../../constants';
import Animation from '../animation';

import SingleDialog from './singleDialog';
import GameOverDialog from './gameOverDialog';
import MultiplayerDialog from './MultiplayerDialog';


const DialogRoutes = (props) => {
    const { style } = props.viewData

    // 场景id
    const __sceneId = props.viewData.__sceneId

    // 动作方法
    const actionMethod = (item) => {
        // 特效
        if (item.animation !== undefined) {
            specialEffects(item.animation)
        }

        // 场景里的动作
        props.dispatch(action('SceneModel/processActions')({ __sceneId, ...item }));

        // 发送道具
        if (item.props !== undefined) {
            AppDispath({
                type: 'PropsModel/sendPropsBatch',
                payload: { props: item.props },
            });
        }

        // 探索事件是否完成
        if (item.isFinish !== undefined) {
            props.dispatch(action('ExploreModel/changeExploreStatus')({ id: item.isFinish.id, type: item.isFinish.type }));
        }

        // 添加 线索
        if (item.addClues !== undefined) {
            props.dispatch(action('CluesModel/addClues')(item.addClues));
        }
    }

    // 特效方法
    const specialEffects = (arr) => {
        arr.forEach(item => {
            if (typeof item === 'string') {
                Animation(item)
            }
            else {
                props.dispatch(action('SceneModel/processActions')({ __sceneId, ...item }));
            }
        });
    }

    if (style === 6 || style === 7) {
        return (
            <SingleDialog
                {...props}
                actionMethod={actionMethod}
                specialEffects={specialEffects}
            />
        )
    } else if (style === 8) {
        return (
            <MultiplayerDialog
                {...props}
                actionMethod={actionMethod}
                specialEffects={specialEffects}
            />
        )
    }

}

export default connect((state) => ({ ...state.SceneModel, ...state.ExploreModel, ...state.CluesModel }))(DialogRoutes);