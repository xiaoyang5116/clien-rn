import React from 'react';
import lo from 'lodash';

import HeaderView from './HeaderView';
import PlainView from './PlainView';
import EventView from './EventView';
import OptionView from './OptionView';
import PlainOptionView from './PlainOptionView';
import OverView from './OverView';
import ImageView from './ImageView';
import { AppDispath } from '../../constants';
import RootView from '../RootView';
import OptionsPage from '../../pages/OptionsPage';
import Transitions from '../../components/transition';

export default class ArticleBlock extends React.PureComponent {

    render() {
        const dataType = this.props.data.type;
        if (dataType == 'plain') {
            return (<PlainView itemKey={this.props.data.key} content={this.props.data.content} />)
        } else if (dataType == 'code' && this.props.data.object != null) {
            const { header, toast, pop, chatId, overview, image, background, effect, games, animations, sounds} = this.props.data.object;
            if (header != undefined) {
                return (<HeaderView itemKey={this.props.data.key} content={header} />);
            } else if (toast != undefined) {
                return (<EventView itemKey={this.props.data.key} content={toast} />);
            } else if (pop != undefined) {
                return (<EventView itemKey={this.props.data.key} content={pop.title} />);
            } else if (chatId != undefined) {
                return (lo.isBoolean(this.props.data.object.plain) && this.props.data.object.plain)
                    ? <PlainOptionView itemKey={this.props.data.key} {...this.props.data.object} />
                    : <OptionView itemKey={this.props.data.key} {...this.props.data.object} />;
            } else if (overview != undefined) {
                return (<OverView itemKey={this.props.data.key} {...this.props.data.object} />);
            } else if (image != undefined) {
                return (<ImageView itemKey={this.props.data.key} {...this.props.data.object} />);
            } else if (background != undefined || effect != undefined || games != undefined || animations != undefined) {
                return (<EventView itemKey={this.props.data.key} {...this.props.data.object} />);
            } else if (sounds != undefined) {
                return (<EventView itemKey={this.props.data.key} {...this.props.data.object} />);
            }
        }
        return (<></>);
    }

}

/**
 * 文章选项点击响应入口
 */
export class ArticleOptionActions {

    static invoke(payload, callback) {
        AppDispath({ type: 'SceneModel/processActions', payload: payload, cb: (v) => {
            // 如果是切换场景，显示选项页面
            if (payload.toScene != undefined) {
                const key = RootView.add(
                <Transitions id={'OPEN_SCENE_FROM_ARTICLE'}>
                    <OptionsPage onClose={() => { RootView.remove(key); }} />
                </Transitions>
                );
            }

            // 执行回调方法
            if (callback != undefined) {
                callback(v);
            }
        }});
    }

}
