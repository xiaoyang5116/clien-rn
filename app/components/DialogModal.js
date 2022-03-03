import React from 'react';
import Modal from 'react-native-modal';

import {
    action,
    connect,
    StyleSheet,
    PureComponent,
  } from "../constants";

import { Button, Text, View } from '../constants/native-ui';

// 普通对话框
class DialogModal extends PureComponent {

    _onConfirm = () => {    
        this.props.dispatch(action('DialogModel/confirm')());
    }

    _onCancel = () => {    
        this.props.dispatch(action('DialogModel/hide')());
    }

    _onModalHide = () => {
        this.props.dispatch(action('DialogModel/onActionsAfterModalHidden')());
    }

    render() {
        return (
            <Modal isVisible={this.props.visible} onModalHide={this._onModalHide} animationIn="fadeIn" animationOut="fadeOut" backdropColor="#666" backdropOpacity={0.5}>
                <View style={[styles.center]}>
                    <View style={[styles.parent, styles.center]}>
                        <View style={{ flex: 4 }}>
                            <View style={{ flex: 1, marginTop: 3, width: 280, borderBottomWidth: 1, borderBottomColor: "#000", justifyContent: "center" }}>
                                <Text style={styles.title}>{this.props.title}</Text>
                            </View>
                            <View style={{ flex: 3, padding: 10, justifyContent: "space-around" }}>
                                <Text style={styles.content}>{this.props.content}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center' }}>
                            <View style={{backgroundColor: "#003964", width: 280, marginBottom: 3}}>
                                <Button title='确认' color="#bcfefe" onPress={this._onConfirm} />
                            </View>
                            <View style={{backgroundColor: "#003964", width: 280, marginTop: 3}}>
                                <Button title='取消' color="#bcfefe" onPress={this._onCancel} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
};

const styles = StyleSheet.create({
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

export default connect(({ DialogModel }) => ({ ...DialogModel }))(DialogModal);