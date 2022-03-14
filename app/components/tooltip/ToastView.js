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

    constructor(props) {
        super(props);
        // 初始化数据，默认info，message为空
        this.state = {
            type: props.type,
            message: props.message,
            time: props.time,
            key: props.key,
        }
    }

    componentDidMount() {
        this.dismissHandler = setTimeout(() => {
            this.props.onHide()
        }, this.state.time)
    }
    onHide = () => {
        this.props.onHide()
    }

    render() {
        console.log("ToastView");
        const currentStyles = this.props.currentStyles
        return (
            <BottomToTop message={this.props.message} style={currentStyles} onHide={this.onHide} />
        )
    }

    // // 这里处理消息的内容、时间和类型
    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         type: nextProps.type ? nextProps.type : 'info',
    //         message: nextProps.message !== undefined ? nextProps.message : '',
    //         time: nextProps.time && nextProps.time < 1500 ? 1000 : 2000,
    //     })
    //     clearTimeout(this.dismissHandler)
    //     this.timingDismiss()
    // }
    // 组件加载完成后执行
    // componentDidMount() {
    //     Animated.timing(
    //         this.moveAnim,
    //         {
    //             toValue: 90,
    //             duration: 80,
    //             easing: Easing.ease,
    //             useNativeDriver: false
    //         },
    //     ).start();
    //     Animated.timing(
    //         this.opacityAnim,
    //         {
    //             toValue: 1,
    //             duration: 100,
    //             easing: Easing.linear,
    //             useNativeDriver: false
    //         },
    //     ).start();
    // }

    componentWillUnmount() {
        clearTimeout(this.dismissHandler)
    }


    // timingDismiss = () => {
    // this.dismissHandler = setTimeout(() => {
    //     this.dismiss()
    // }, this.state.time)
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
}

const styles = StyleSheet.create({
    textContainer: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        height: 40,
        // minWidth: 80,
        padding: 10,
        maxWidth: width / 2,
        alignSelf: "flex-end",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        shadowColor: '#BCBCBC',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 9,
        shadowOpacity: 0.5
    },
    defaultText: {
        color: "#4A4A4A",
        fontSize: 14
    },
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: "row",
        justifyContent: "center",
    }
});
export default connect((state) => ({ ...state.AppModel }))(ToastView)