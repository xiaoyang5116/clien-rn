import React, { PureComponent } from 'react';
import HeaderView from './HeaderView';
import PlainView from './PlainView';
import EventView from './EventView';
import OptionView from './OptionView';
import ArticleOverview from './ArticleOverview';

export default class ArticleBlock extends PureComponent {

    render() {
        const dataType = this.props.data.type;
        if (dataType == 'plain') {
            return (<PlainView itemKey={this.props.data.key} content={this.props.data.content} />)
        } else if (dataType == 'code' && this.props.data.object != null) {
            const { header, toast, pop, chatId, overview } = this.props.data.object;
            if (header != undefined) {
                return (<HeaderView itemKey={this.props.data.key} content={header} />);
            } else if (toast != undefined) {
                return (<EventView itemKey={this.props.data.key} content={toast} />);
            } else if (pop != undefined) {
                return (<EventView itemKey={this.props.data.key} content={pop.title} />);
            } else if (chatId != undefined) {
                return (<OptionView itemKey={this.props.data.key} {...this.props.data.object} />);
            } else if (overview != undefined) {
                return (<ArticleOverview itemKey={this.props.data.key} {...this.props.data.object} />);
            }
        }
        return (<></>);
    }

}
