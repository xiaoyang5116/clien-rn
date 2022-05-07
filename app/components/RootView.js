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
        RootView.instance.setState((state) => ({ views: [...state.views, container] }));
        return key;
    };

    static remove(key) {
        RootView.instance.setState((state) => ({ views: state.views.filter(e => parseInt(e.key) != key) }));
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
