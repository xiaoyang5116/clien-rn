import React, {
    Component,
} from 'react';

// 导入不同的追加提示模板
import BottomToTop from './BottomToTop';
import LeftToRight from './LeftToRight';

import {
    connect,
} from "../../constants";

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