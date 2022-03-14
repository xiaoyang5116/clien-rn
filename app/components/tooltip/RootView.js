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
let toastList = [];

export default class RootView extends Component {
    constructor(props) {
        super(props);
        viewRoot = this;
        this.state = {
            // toastObj: null,
            list: [],
        }
    }

    add = (params = { content: '', type: 'info', key: '' }) => {
        this.setState({
            list: this.state.list.concat([params])
        })
    }

    handleHide = (key) => {
        this.setState({
            list: this.state.list.filter(item => item.key != key)
        })
    }

    render() {
        console.log("this.state.list", this.state.list);
        return (
            this.state.list.length > 0 && <View style={styles.rootView} pointerEvents="box-none">
                {
                    this.state.list.map((item) => {
                        return <ToastView onHide={this.handleHide.bind(this, item.key)} {...item} />
                    })
                }
            </View>
        )
    }

    // static setView = (view) => {
    //     viewRoot.setState({ toast: view })
    // };
    static addView = (params = { message: '', type: 'BottomToTop', key: '', time: 1000 }) => {
        // console.log("params",params);
        // toastList.push(params)
        // console.log("toastList",toastList);
        viewRoot.setState({ list: [...viewRoot.state.list, params] })
    }
}
const styles = StyleSheet.create({
    rootView: {
        position: "relative",
    }
});