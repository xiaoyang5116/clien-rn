import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import HeaderView from './HeaderView';
import PlainView from './PlainView';
import EventView from './EventView';

export default class ArticleBlock extends PureComponent {

    render() {
        const dataType = this.props.data.type;
        if (dataType == 'plain') {
            return (<PlainView itemKey={this.props.data.key} content={this.props.data.content} />)
        } else if (dataType == 'code' && this.props.data.object != null) {
            const { header, toast, ref } = this.props.data.object;
            if (header != undefined) {
                return (<HeaderView itemKey={this.props.data.key} content={header} />);
            } else if (toast != undefined) {
                return (<EventView itemKey={this.props.data.key} content={toast} />);
            } else if (ref != undefined) {
            }
        }
        return (<></>);
    }

}
