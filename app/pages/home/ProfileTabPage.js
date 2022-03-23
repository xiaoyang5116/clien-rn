import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import { View, Text, Image, Button } from '../../constants/native-ui';
import Toast from '../../components/toast';

class ProfileTabPage extends Component {

    _onClearArchive = (e) => {
        this.props.dispatch(action('AppModel/clearArchive')());
    }

    _onChangeTheme(themeId) {
        if (themeId >= 0) {
            this.props.dispatch(action('AppModel/changeTheme')({ themeId: themeId }));
        }
    }

    render() {
        return (
            <View style={this.props.currentStyles.viewContainer}>
                <Text>个人信息页面</Text>
                <Image style={styles.logo} source={{ uri: 'https://imgo.928vbi.com/img2020/6/11/15/2020061162540848.jpg' }} />
                <View style={[styles.buttonContainer, {backgroundColor: this.props.currentStyles.button.backgroundColor}]}>
                    <Button title='清档' onPress={this._onClearArchive} color={this.props.currentStyles.button.color} />
                </View>
                <View style={[styles.buttonContainer, {backgroundColor: this.props.currentStyles.button.backgroundColor}]}>
                    <Button title='皮肤1' onPress={() => { this._onChangeTheme(0) }} color={this.props.currentStyles.button.color} />
                </View>
                <View style={[styles.buttonContainer, {backgroundColor: this.props.currentStyles.button.backgroundColor}]}>
                    <Button title='皮肤2' onPress={() => { this._onChangeTheme(1) }} color={this.props.currentStyles.button.color} />
                </View>
                <View style={[styles.buttonContainer, {backgroundColor: this.props.currentStyles.button.backgroundColor}]}>
                    <Button title='Toast' onPress={() => { 
                        Toast.show('这是一段很长的对话',"LeftToRight")
                     }} color={this.props.currentStyles.button.color} />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    logo: {
        width: 80,
        height: 80
    },
    buttonContainer: {
        width: 100,
        marginTop: 25,
    }
});

export default connect((state) => ({ ...state.AppModel }))(ProfileTabPage);