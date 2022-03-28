import React, {
    Component,
} from 'react';

import {
    connect,
    BOTTOM_TOP_SMOOTH,
    BOTTOM_TOP,
    CENTER_TOP,
    LEFT_RIGHT
} from '../../constants'
// 导入不同的追加提示模板
import BottomToTop from './behaviors/BottomToTop';
import LeftToRight from './behaviors/LeftToRight';
import BottomToTopSmooth from './behaviors/BottomToTopSmooth';
import CenterToTop from './behaviors/CenterToTop';


class ToastView extends Component {

    onHide = () => {
        this.props.onHide()
    }
    render() {
        switch (this.props.type) {
            case BOTTOM_TOP:
                return (
                    <BottomToTop {...this.props} onHide={this.onHide} />
                )
            case BOTTOM_TOP_SMOOTH:
                return (
                    <BottomToTopSmooth {...this.props} onHide={this.onHide} />
                )
            case CENTER_TOP:
                return (
                    <CenterToTop {...this.props} onHide={this.onHide} />
                )
            case LEFT_RIGHT:
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