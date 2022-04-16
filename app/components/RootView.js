import React from 'react';

import {
    Component,
    StyleSheet,
  } from "../constants";

import { View } from '../constants/native-ui';

export default class RootView extends Component {

    static instance = null;
    static key = 0;

    constructor(props) {
        super(props);

        this.state = {
            views: [],
        }

        this.removeList = []; // 记录移除列表，setState是异步执行。
        RootView.instance = this;
    }

    render() {
        return (<View style={styles.viewContainer} pointerEvents="box-none">
                    {this.state.views}
                </View>);
    }

    static add(view) {        
        const key = RootView.key++;
        const container = (<View style={styles.viewContainer} key={key} pointerEvents="box-none">{view}</View>);
        const validList = RootView.instance.state.views.filter(e => (RootView.instance.removeList.indexOf(parseInt(e.key)) == -1));
        RootView.instance.setState({ views: [...validList, container] });
        return key;
    };

    static remove(key) {
        RootView.instance.removeList.push(key);
        RootView.instance.setState({
            views: RootView.instance.state.views.filter(e => parseInt(e.key) != key),
        })
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
});
