import React from 'react';
import Modal from 'react-native-modal';

import {
    action,
    connect,
    PureComponent,
} from "../../constants";

import { Button, Text, View } from '../../constants/native-ui';
import GameOverModal from '../GameOverModal';
import HalfScreenDialog from '../dialog/HalfScreenDialog';

import lo from 'lodash';

// 遮挡层
class MaskModal extends PureComponent {

    componentDidMount() {
        this.props.dispatch(action('MaskModel/showDialog')(this.props.viewData));
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
        // 6  代表 popUp dialog 弹出对话框
        if (this.props.style === 6) {
            // console.log("this.props", this.props);
            return (
                <Modal isVisible={this.props.visible} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropColor="#666" backdropOpacity={0.5}>
                    <HalfScreenDialog isGame={true} onDialogCancel={this._onDialogCancel} onAsideNext={this._onAsideNext} popUpComplex={this.props.__data.current.popUpComplex} />
                </Modal>
            )
        }

        // 7 代表 game over
        if (this.props.style === 7) {
            return (
                <Modal isVisible={this.props.visible} style={{ flex: 1, }} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropColor="#fff" backdropOpacity={1}>
                    <View style={currentStyles.gameOverPage}>
                        <GameOverModal onDialogCancel={this._onDialogCancel} {...this.props} />
                    </View>
                </Modal>
            )
        }
        return (
            <Modal isVisible={this.props.visible} style={{ flex: 1, }} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropColor="#fff" backdropOpacity={1}>
                <View style={[currentStyles.asideCenter]}>
                    <View style={[currentStyles.asideCenter]}>
                        <View style={[this.props.subStype == 1 ? currentStyles.asideParent1 : currentStyles.asideParent2,]}>
                            <View style={currentStyles.asideTitleContainer}>
                                <Text style={currentStyles.asideTitle}>{this.props.title}</Text>
                            </View>
                            <View style={currentStyles.asideContentContainer}>
                                <Text style={currentStyles.asideContent}>{this.props.content}</Text>
                            </View>
                        </View>
                        <View style={currentStyles.asideBottomContainer}>
                            <View style={[currentStyles.asideBottomBanner, { backgroundColor: currentStyles.button.backgroundColor }]}>
                                <Button title='>>>' onPress={this._onAsideNext} color={currentStyles.button.color} />
                            </View>
                        </View>
                    </View>
                </View>
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