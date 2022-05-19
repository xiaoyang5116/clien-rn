import { View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import React, { PureComponent } from 'react';
import Slider from '@react-native-community/slider';

import {
    connect,
    action,
    ThemeContext,
} from "../../../constants";
import Modal from 'react-native-modal';
import RowLayout from './RowLayout';
import { TButton } from '../_components';


class CustomParagraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            paragraphSpacing: this.props.readerStyle.paragraphSpacing,
            lineHeight: this.props.readerStyle.lineHeight,
            leftPadding: this.props.readerStyle.leftPadding,
            rightPadding: this.props.readerStyle.rightPadding,
        }
    }

    static contextType = ThemeContext;

    handleChange = (itme) => {
        const newStatus = {
            ...itme,
            selectedTypesetting: "自定义排版"
        }
        this.props.dispatch(action('ArticleModel/changeReaderStyle')(newStatus));
    }

    reset = (readerStyle) => {
        const newState = {
            paragraphSpacing: readerStyle.defaultStyle.paragraphSpacing,
            lineHeight: readerStyle.defaultStyle.lineHeight,
            leftPadding: readerStyle.defaultStyle.leftPadding,
            rightPadding: readerStyle.defaultStyle.rightPadding,
        }
        this.props.dispatch(action('ArticleModel/changeReaderStyle')({
            ...newState,
            selectedTypesetting: readerStyle.defaultStyle.selectedTypesetting
        }));
        this.setState(newState)
    }

    componentDidMount() {
        this.setState({ visible: true })
    }

    render() {
        const { readerStyle } = this.props
        const theme = this.context;

        return (
            <Modal
                isVisible={this.state.visible}
                animationIn="slideInUp"
                animationInTiming={300}
                animationOut="slideOutDown"
                animationOutTiming={300}
                backdropOpacity={0}
                backgroundTransitionOutTiming={0}
                hideModalContentWhileAnimating={true}
                onModalHide={() => { this.props.onClose() }}
                onBackButtonPress={() => {
                    this.setState({ visible: false })
                }}
                onBackdropPress={() => {
                    this.setState({ visible: false })
                }}
                style={{ padding: 0, margin: 0, flex: 1, zIndex: 2, }}
            >
                <View style={[{ backgroundColor: readerStyle.popUpBgColor }, theme.readerSettingContainer]}>
                    <RowLayout
                        min={-3}
                        max={20}
                        defaultValue={this.state.paragraphSpacing}
                        value={readerStyle.paragraphSpacing}
                        title={`段间距(${readerStyle.paragraphSpacing})`}
                        onChange={(value) => { this.handleChange({ paragraphSpacing: value }) }}
                        updataState={(value) => { this.setState({ paragraphSpacing: value }) }}
                    />
                    <RowLayout
                        min={-3}
                        max={20}
                        defaultValue={this.state.lineHeight}
                        value={readerStyle.lineHeight}
                        title={`行间距(${readerStyle.lineHeight})`}
                        onChange={(value) => { this.handleChange({ lineHeight: value }) }}
                        updataState={(value) => { this.setState({ lineHeight: value }) }}
                    />
                    <RowLayout
                        min={0}
                        max={100}
                        defaultValue={this.state.leftPadding}
                        value={readerStyle.leftPadding}
                        title={`左边空白(${readerStyle.leftPadding})`}
                        onChange={(value) => { this.handleChange({ leftPadding: value }) }}
                        updataState={(value) => { this.setState({ leftPadding: value }) }}
                    />
                    <RowLayout
                        min={0}
                        max={100}
                        defaultValue={this.state.rightPadding}
                        value={readerStyle.rightPadding}
                        title={`右边空白(${readerStyle.rightPadding})`}
                        onChange={(value) => { this.handleChange({ rightPadding: value }) }}
                        updataState={(value) => { this.setState({ rightPadding: value }) }}
                    />
                    <View style={{ width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: '100%', width: '50%' }}>
                            <TButton
                                title={"重置"}
                                onPress={() => { this.reset(readerStyle) }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

export default connect(state => ({ ...state.ArticleModel }))(CustomParagraph);