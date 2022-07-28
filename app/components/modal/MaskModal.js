import React from 'react';
import Modal from 'react-native-modal';

import {
    action,
    connect,
    PureComponent,
} from "../../constants";

import ImageCapInset from 'react-native-image-capinsets-next';
import { Button, Text, View } from '../../constants/native-ui';
import BlackNarration from './BlackNarration';
import Narration from './Narration'
import { DialogRoutes } from '../dialog';
import lo from 'lodash';
import OnlyClickModal from './OnlyClickModal'


// 遮挡层
class MaskModal extends PureComponent {

    componentDidMount() {
        this.props.dispatch(action('MaskModel/showDialog')(this.props.data));
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
        const style = this.props.style

        if (style === "1A" || style === "1B") {
            return (
                <Modal isVisible={this.props.visible} coverScreen={false} style={{ margin: 0, backgroundColor: "rgba(102, 102, 102, 0.6)" }} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0}>
                    <OnlyClickModal
                        viewData={this.props.viewData}
                        onDialogConfirm={this._onDialogConfirm}
                    />
                </Modal>
            )
        }

        return (
            <Modal isVisible={this.props.visible} coverScreen={false} style={{ margin: 0, backgroundColor: "rgba(102, 102, 102, 0.6)" }} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0}>
                <View style={currentStyles.dlgCenter}>
                    <View style={[currentStyles.dlgParent, currentStyles.dlgCenter]}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: "100%", height: "100%", position: "absolute", zIndex: 0, padding: 2, }}>
                            <ImageCapInset
                                source={require("../../../assets/button/40dpi_gray.png")}
                                style={{ width: "100%", height: "100%" }}
                                capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                            />
                        </View>
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
        const style = this.props.style

        // 6  代表 popUp dialog 弹出对话框
        if ((style >= 6 && style <= 9) || (style === "9A" || style === "9B")) {
            return (
                <Modal isVisible={this.props.visible} coverScreen={false} style={{ padding: 0, margin: 0, flex: 1, zIndex: 1, backgroundColor: "rgba(102, 102, 102, 0.6)" }} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0}>
                    <DialogRoutes
                        viewData={this.props.viewData}
                        onDialogCancel={this._onDialogCancel}
                    />
                </Modal>
            )
        }


        return (
            <Modal isVisible={this.props.visible} coverScreen={false} style={{ margin: 0, backgroundColor: "#fff" }} useNativeDriver={false} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0}>
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