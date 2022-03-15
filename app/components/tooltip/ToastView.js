import React, {
    Component,
} from 'react';

import {
    StyleSheet,
    View,
    Easing,
    Dimensions,
    Text,
    Animated
} from 'react-native';
import PropTypes from 'prop-types';
// import Toast from "./index";
// 导入不同的追加提示模板
import BottomToTop from './BottomToTop';
import LeftToRight from './LeftToRight';

import {
    action,
    connect,
    PureComponent,
} from "../../constants";


const { width } = Dimensions.get("window");

class ToastView extends Component {

    dismissHandler = null;

    // constructor(props) {
    //     super(props);
    //     // 初始化数据，默认info，message为空
    //     this.state = {
    //         type: props.type,
    //         message: props.message,
    //         time: props.time,
    //         key: props.key,
    //     }
    // }

    // componentDidMount() {
    //     this.dismissHandler = setTimeout(() => {
    //         this.props.onHide()
    //     }, this.props.time)
    // }
    onHide = () => {
        this.props.onHide()
    }
    // timingDismiss = () => {
    //     this.dismissHandler = setTimeout(() => {
    //         this.dismiss()
    //     }, this.props.time)
    // };

    // dismiss = () => {
    //     Animated.timing(
    //         this.opacityAnim,
    //         {
    //             toValue: 0,
    //             duration: 100,
    //             easing: Easing.linear,
    //             useNativeDriver: false
    //         },
    //     ).start(this.onDismiss);
    // };

    // onDismiss = () => {
    //     if (this.props.onDismiss) {
    //         this.props.onDismiss()
    //     }
    // }

    render() {
        switch (this.props.type) {
            case "BottomToTop":
                return (
                    <BottomToTop {...this.props} onHide={this.onHide}  timingDismiss={this.timingDismiss}/>
                )
            case "LeftToRight":
                return (
                    <LeftToRight {...this.props} onHide={this.onHide} />
                )

            default:
                return (
                    <BottomToTop {...this.props} onHide={this.onHide} />
                )
        }
    }

    componentWillUnmount() {
        // clearTimeout(this.dismissHandler)
    }
}

export default connect((state) => ({ ...state.AppModel }))(ToastView)