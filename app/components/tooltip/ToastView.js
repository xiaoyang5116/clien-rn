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

    onHide = () => {
        this.props.onHide()
    }
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
}

export default connect((state) => ({ ...state.AppModel }))(ToastView)