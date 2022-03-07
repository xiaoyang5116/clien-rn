import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import { View, Text, Image, Button } from '../../constants/native-ui';

class ShopTabPage extends Component {

    _alertCopper(value) {
        this.props.dispatch(action('UserModel/alertCopper')({ value: value }));
    }

    render() {
        return (
            <View style={this.props.currentStyles.viewContainer}>
                <Text>商城页面</Text>
                <Image style={styles.logo} source={{ uri: 'https://img2.baidu.com/it/u=2779209451,3625555914&fm=253&fmt=auto&app=138&f=JPEG?w=260&h=274' }} />
                <Text style={{ fontSize: 28 }}>铜币数量：{this.props.user.copper}</Text>
                <View style={[styles.buttonContainer, {backgroundColor: this.props.currentStyles.button.backgroundColor}]}>
                    <Button title='增加铜币+1' onPress={() => { this._alertCopper(1) }} color={this.props.currentStyles.button.color} />
                </View>
                <View style={[styles.buttonContainer, {backgroundColor: this.props.currentStyles.button.backgroundColor}]}>
                    <Button title='减少铜币-1' onPress={() => { this._alertCopper(-1) }} color={this.props.currentStyles.button.color} />
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

export default connect((state) => ({ ...state.AppModel, user: { ...state.UserModel } }))(ShopTabPage);