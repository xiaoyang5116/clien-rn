import React from 'react';
import Modal from 'react-native-modal';

import {
    action,
    connect,
    DeviceEventEmitter,
    EventKeys,
    PureComponent,
} from "../../constants";

import { Button, Text, View } from '../../constants/native-ui';
import { DialogTemple } from '../dialog';
import MultiplayerDialog from '../dialog/MultiplayerDialog';
import BlackNarration from './BlackNarration';
import Narration from './Narration'

import lo from 'lodash';

// 遮挡层
class MaskModal extends PureComponent {

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener(EventKeys.MODAL_SHOW, (payload) => {
            this.props.dispatch(action('MaskModel/showDialog')(payload));
        })
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    _onDialogConfirm = () => {
        this.props.dispatch(action('MaskModel/onDialogConfirm')());
    }

    _onDialogCancel = () => {
        this.props.dispatch(action('MaskModel/hide')());
    }

    _onModalHide = () => {
        this.props.dispatch(action('MaskModel/onActionsAfterModalHidden')())
            .then(r => {
                if (this.props.onModalHide != undefined && lo.isFunction(this.props.onModalHide)) {
                    this.props.onModalHide();
                }
            });
    }

    _onAsideNext = () => {
        this.props.dispatch(action('MaskModel/onNextAside')());
    }

    _renderForDialog() {
        const currentStyles = this.props.currentStyles;
        return (
            <Modal isVisible={this.props.visible} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropColor="#666" backdropOpacity={0.5}>
                <View style={currentStyles.dlgCenter}>
                    <View style={[currentStyles.dlgParent, currentStyles.dlgCenter]}>
                        <View style={{ flex: 4 }}>
                            <View style={currentStyles.dlgTitleContainer}>
                                <Text style={currentStyles.dlgTitle}>{this.props.title}</Text>
                            </View>
                            <View style={currentStyles.dlgContentContainer}>
                                <Text style={currentStyles.dlgContent}>{this.props.content}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 2 }}>
                            <View style={[currentStyles.dlgBottomBanner, { backgroundColor: currentStyles.button.backgroundColor }]}>
                                <Button title='确认' onPress={this._onDialogConfirm} color={currentStyles.button.color} />
                            </View>
                            <View style={[currentStyles.dlgBottomBanner, { backgroundColor: currentStyles.button.backgroundColor }]}>
                                <Button title='取消' onPress={this._onDialogCancel} color={currentStyles.button.color} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    _renderForAside() {
        const currentStyles = this.props.currentStyles;
        const style = parseInt(this.props.style);

        // 6  代表 popUp dialog 弹出对话框
        if (style >= 6 && style <= 7) {
            return (
                <Modal isVisible={this.props.visible} coverScreen={false} style={{ padding: 0, margin: 0, flex: 1, zIndex: 1 }} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropColor="#666" backdropOpacity={0.5}>
                    <DialogTemple
                        viewData={this.props.viewData}
                        onDialogCancel={this._onDialogCancel}
                    />
                </Modal>
            )
        }

        // 8 代表 多人对话框
        if (style === 8) {
            return (
                <Modal isVisible={this.props.visible} style={{ padding: 0, margin: 0, flex: 1 }} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropColor="#666" backdropOpacity={0.5}>
                    <MultiplayerDialog {...this.props} onDialogCancel={this._onDialogCancel} />
                </Modal>
            )
        }

        return (
            <Modal isVisible={this.props.visible} style={{ padding: 0, margin: 0, flex: 1, }} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropColor="#fff" backdropOpacity={1}>
                {/* <TouchableWithoutFeedback onPress={this._onAsideNext}> */}
                {/* <View style={[currentStyles.asideCenter,{ flex:1,padding:20,}]}> */}
                <View style={[currentStyles.asideCenter]}>
                    {
                        this.props.viewData.style == 1 ? <BlackNarration {...this.props} onAsideNext={this._onAsideNext} /> : <Narration {...this.props} onAsideNext={this._onAsideNext} />
                    }
                </View>
                {/* </TouchableWithoutFeedback> */}
            </Modal>
        );
    }

    render() {
        if (this.props.primaryType == 1)
            return this._renderForDialog();
        else if (this.props.primaryType == 2)
            return this._renderForAside();
        else {
            return (<View></View>);
        }
    }
};

export default connect((state) => ({ ...state.MaskModel, ...state.AppModel }))(MaskModal);