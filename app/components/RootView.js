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
            keyUniqueId: 0,
        }
    }

    render() {
        return (<View style={styles.rootView} pointerEvents="box-none">
                    {this.state.views}
                </View>);
    }

    static add(view) {
        const key = viewRoot.state.keyUniqueId;
        let container = (<View style={styles.viewContainer} key={key} pointerEvents="box-none">{view}</View>);
        viewRoot.setState({
            views: [...viewRoot.state.views, container],
            keyUniqueId:  key + 1
        })
        return key;
    };

    static remove(key) {
        let views = [];
        viewRoot.state.views.forEach(e => {
            if (e.key != undefined && e.key != key)
                views.push(e);
        });
        viewRoot.setState({
            views: views,
            keyUniqueId: viewRoot.state.keyUniqueId
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
