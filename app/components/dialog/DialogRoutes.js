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
import MultiplayerDialog from './MultiplayerDialog';
import BlackAndWhiteClickDialog from './blackAndWhiteClickDialog';
import BustDialog from './bustDialog';
import BgDialog from './bgDialog';
import DrawLotsOption from './drawLotsOption'
import GorgeousTemplate from './gorgeousTemplate'
import Transitions from '../transition';
import { ArticleOptionActions } from '../article';


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
        // props.dispatch(action('SceneModel/processActions')({ __sceneId, ...item }));
        ArticleOptionActions.invoke({ __sceneId, ...item });

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
        if (item.addCluesId !== undefined) {
            // addCluesId: ["xiansuo4"]
            props.dispatch(action('CluesModel/addClues')({ addCluesId: item.addCluesId }));
        }

        // 记录点击动作数据
        props.dispatch(action('StateModel/saveDialogBtnClickState')(item));
    }

    // 特效方法
    const specialEffects = (arr) => {
        arr.forEach(item => {
            if (typeof item === 'string') {
                Animation(item)
            }
            else {
                ArticleOptionActions.invoke({ __sceneId, ...item });
            }
        });
    }

    if (style === 5) {
        return (
            <BgDialog
                {...props}
                actionMethod={actionMethod}
                specialEffects={specialEffects}
            />
        )
    } else if (style === 6 || style === 7) {
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
    } else if (style === 9 || style === "9A" || style === "9B") {
        return (
            <BlackAndWhiteClickDialog
                {...props}
                actionMethod={actionMethod}
                specialEffects={specialEffects}
            />
        )
    } else if (style === 10) {
        return (
            <BustDialog
                {...props}
                actionMethod={actionMethod}
                specialEffects={specialEffects}
            />
        )
    } else if (style === 11) {
        return (
            <DrawLotsOption
                {...props}
                actionMethod={actionMethod}
                specialEffects={specialEffects}
            />
        )
    } else if (style === 12) {
        return (
            <Transitions id={"OPEN_GorgeousTemplate"}>
                <GorgeousTemplate
                    {...props}
                    templateId={1}
                    actionMethod={actionMethod}
                    specialEffects={specialEffects}
                />
            </Transitions>
        )
    } else if (style === 13) {
        return (
            <GorgeousTemplate
                {...props}
                templateId={2}
                actionMethod={actionMethod}
                specialEffects={specialEffects}
            />
        )
    }

}

export default connect((state) => ({ ...state.SceneModel, ...state.ExploreModel, ...state.CluesModel }))(DialogRoutes);