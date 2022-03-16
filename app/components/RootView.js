import React from 'react';

import {
    Component,
    StyleSheet,
  } from "../constants";

import { View } from '../constants/native-ui';

let viewRoot = null;

export default class RootView extends Component {
    constructor(props) {
        super(props);
        viewRoot = this;
        this.state = {
            views: [],
            key: 0,
        }
    }

    render() {
        return (<View style={styles.rootView} pointerEvents="box-none">
                    {this.state.views}
                </View>);
    }

    static add(view) {
        const key = viewRoot.state.key;
        let container = (<View style={styles.viewContainer} key={key} pointerEvents="box-none">{view}</View>);
        viewRoot.setState({
            views: [...viewRoot.state.views, container],
            key:  key + 1
        })
        return key;
    };

    static remove(key) {
        console.debug(key);
        viewRoot.setState({
            views: viewRoot.state.views.filter(e => e.key != key),
            key: viewRoot.state.key
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    rootView: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    viewContainer: {
        flex: 1,
    },
});
