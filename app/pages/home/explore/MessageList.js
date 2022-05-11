import React from 'react';

import {
    DeviceEventEmitter,
    EventKeys,
    PureComponent,
} from "../../../constants";

import { 
    View, 
    FlatList, 
} from '../../../constants/native-ui';

import {
    RenderHTML
} from 'react-native-render-html';

// 消息列表，用于展现探索的各种信息
class MessageList extends PureComponent {
    constructor(props) {
        super(props);
        this.timer = null;
        this.queue = [];
        this.refList = React.createRef();
        this.listeners = [];
        this.state = {
            messages: [],
        };
    }

    renderItem = (data) => {
        const item = data.item;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 24 }} >
                <RenderHTML contentWidth={100} source={{html: item.msg}} />
            </View>
        );
    }

    addMsg(msg) {
        this.setState({ messages: [...this.state.messages, { msg }] });
    }

    addMsgs(list, interval = 600, cb = null) {
        this.queue.push(...list);
        if (this.timer == null) {
            this.timer = setInterval(() => {
                if (this.queue.length > 0) {
                    this.addMsg(this.queue.shift());
                } else {
                    clearInterval(this.timer);
                    this.timer = null;
                    if (cb != null) cb();
                }
            }, interval);
        }
    }

    componentDidMount() {
        this.listeners.push(DeviceEventEmitter.addListener(EventKeys.EXPLORE_MSGLIST_ADD, (msg) => this.addMsg(msg)));
        this.listeners.push(DeviceEventEmitter.addListener(EventKeys.EXPLORE_MSGLIST_ADDALL, (payload) => {
            const { list, interval, cb } = payload;
            this.addMsgs(list, interval, cb);
        }));
    }

    componentWillUnmount() {
        this.listeners.forEach(e => e.remove());
        this.listeners.length = 0;
        
        if (this.timer != null) {
            clearInterval(this.timer);
        }
    }

    render() {
        return (
        <FlatList
            ref={this.refList}
            style={{ alignSelf: 'stretch', margin: 10, borderColor: '#999', borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.85)' }}
            data={this.state.messages}
            renderItem={this.renderItem}
            getItemLayout={(_data, index) => (
                {length: 24, offset: 24 * index, index}
            )}
            onContentSizeChange={() => {
                if (this.state.messages.length > 0) {
                    this.refList.current.scrollToIndex({ index: this.state.messages.length - 1 });
                }
            }}
          />
        );
    }
}

export default MessageList;
