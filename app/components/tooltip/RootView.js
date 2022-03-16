import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Easing,
    Dimensions,
    Text,
    Animated
} from 'react-native';
import ToastView from './ToastView'

viewRoot = null;

export default class RootView extends Component {
    constructor(props) {
        super(props);
        viewRoot = this;
        this.state = {
            list: [],
            key: 0
        }
    }

    handleHide = (key) => {
        this.setState({
            list: this.state.list.filter(item => item.key != key)
        })
    }

    render() {
        return (
            this.state.list.length > 0 && <View style={styles.rootView} pointerEvents="box-none">
                <View style={{
                    position: 'absolute',
                    left: 25,
                    bottom: 90,
                    // // height: 100,
                    // backgroundColor: 'pink',
                }}>
                    {
                        this.state.list.map((item) => {
                            return <ToastView style={styles.toastView} onHide={this.handleHide.bind(this, item.key)} {...item} />
                        })
                    }
                </View>

            </View>
        )
    }

    static addView = (params = { message: '', type: 'BottomToTop', time: 1000 }) => {
        params.key = viewRoot.state.key
        viewRoot.setState({
            list: [...viewRoot.state.list, params],
            key: viewRoot.state.key + 1
        })
    }
}
const styles = StyleSheet.create({
    rootView: {
        position: 'relative',
    },
});