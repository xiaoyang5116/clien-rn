import React, {
    Component,
} from 'react';

// 导入不同的追加提示模板
import BottomToTop from './BottomToTop';
import LeftToRight from './LeftToRight';
import BottomToTopSmooth from './BottomToTopSmooth';
import CenterToTop from './CenterToTop';

import {
    connect,
} from "../../constants";

class ToastView extends Component {

    onHide = () => {
        this.props.onHide()
    }
    render() {
        switch (this.props.type) {
            case "BottomToTop":
                return (
                    <BottomToTop {...this.props} onHide={this.onHide} />
                )
            case "BottomToTopSmooth":
                return (
                    <BottomToTopSmooth {...this.props} onHide={this.onHide} />
                )
            case "CenterToTop":
                return (
                    <CenterToTop {...this.props} onHide={this.onHide} />
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