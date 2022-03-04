import React from 'react';
import Modal from 'react-native-modal';

import {
    action,
    connect,
    StyleSheet,
    PureComponent,
  } from "../constants";

import { Button, Text, View } from '../constants/native-ui';

// 遮挡层
class MaskModal extends PureComponent {

    _onDialogConfirm = () => {    
        this.props.dispatch(action('MaskModel/onDialogConfirm')());
    }

    _onDialogCancel = () => {    
        this.props.dispatch(action('MaskModel/hide')());
    }

    _onModalHide = () => {
        this.props.dispatch(action('MaskModel/onActionsAfterModalHidden')());
    }

    _onAsideNext = () => {    
        this.props.dispatch(action('MaskModel/onNextAside')());
    }

    _renderForDialog() {
        return (
            <Modal isVisible={this.props.visible} useNativeDriver={true} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropColor="#666" backdropOpacity={0.5}>
                <View style={[dlgStyles.center]}>
                    <View style={[dlgStyles.parent, dlgStyles.center]}>
                        <View style={{ flex: 4 }}>
                            <View style={{ flex: 1, marginTop: 3, width: 280, borderBottomWidth: 1, borderBottomColor: "#000", justifyContent: "center" }}>
                                <Text style={dlgStyles.title}>{this.props.title}</Text>
                            </View>
                            <View style={{ flex: 3, padding: 10, justifyContent: "space-around" }}>
                                <Text style={dlgStyles.content}>{this.props.content}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center' }}>
                            <View style={{backgroundColor: "#003964", width: 280, marginBottom: 3}}>
                                <Button title='确认' color="#bcfefe" onPress={this._onDialogConfirm} />
                            </View>
                            <View style={{backgroundColor: "#003964", width: 280, marginTop: 3}}>
                                <Button title='取消' color="#bcfefe" onPress={this._onDialogCancel} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    _renderForAside() {
        return (
            <Modal style={{ flex: 1 }} useNativeDriver={true} onModalHide={this._onModalHide} isVisible={this.props.visible} animationIn="fadeIn" animationOut="fadeOut"  backdropColor="#fff" backdropOpacity={1}>
                <View style={[asideStyles.center]}>
                    <View style={[this.props.subStype == 1 ? asideStyles.parent1 : asideStyles.parent2, asideStyles.center]}>
                        <View style={{ flex: 4 }}>
                            <View style={asideStyles.titleContainer}>
                                <Text style={asideStyles.title}>{this.props.title}</Text>
                            </View>
                            <View style={asideStyles.contentContainer}>
                                <Text style={asideStyles.content}>{this.props.content}</Text>
                            </View>
                        </View>
                        <View style={asideStyles.bottomContainer}>
                            <View style={asideStyles.bottomBanner}>
                                <Button title='>>>' color="#bcfefe" onPress={this._onAsideNext} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    render() {
        if (this.props.mtype == 1)
            return this._renderForDialog();
        else if (this.props.mtype == 2)
            return this._renderForAside();
        else {
            return (<View></View>);
        }
    }
};

const dlgStyles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    parent: {
        width:300,
        height:300,
        backgroundColor: '#FFFFFF',
        borderRadius: 10
    },
    title: {
        fontSize: 25,
        color: '#000',
        textAlign: 'center',
    },
    content: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center'
    },
});

const asideStyles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    parent1: {
        width:300,
        height:300,
        backgroundColor: '#CCC',
        borderRadius: 10
    },
    parent2: {
        width:300,
        height:300,
        borderRadius: 10
    },
    titleContainer: {
        flex: 1, 
        marginTop: 3, 
        width: 280, 
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    contentContainer: {
        flex: 3, 
        padding: 10, 
        justifyContent: "space-around"
    },
    bottomContainer: {
        flex: 2, 
        justifyContent: 'center'
    },
    bottomBanner: {
        backgroundColor: "#003964", 
        width: 280, 
        marginBottom: 3
    },
    title: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
    },
    content: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center'
    },
});

export default connect((state) => ({ ...state.MaskModel, ...state.AppModel }))(MaskModal);