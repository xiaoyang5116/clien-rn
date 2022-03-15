import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import ProgressBar from '../../components/ProgressBar';
import { View, Button, Alert } from '../../constants/native-ui';

class SkillTabPage extends Component {

    constructor(props) {
        super(props);
        this.state = { percent: 100 };
    }

    _alertCopper(value) {
        this.props.dispatch(action('UserModel/alertCopper')({ value: value }));
    }

    render() {
        return (
            <View style={this.props.currentStyles.viewContainer}>
                <View style={{ flexDirection: 'row', height: 45, width: 350, paddingLeft: 0, paddingRight: 0 }}>
                    <ProgressBar percent={100} toPercent={0} duration={3000} onCompleted={() => {
                        Alert.alert('', 'Completed!!!');
                    }} />
                </View>
                <View style={{ flexDirection: 'row', height: 45, width: 350, paddingLeft: 0, paddingRight: 0 }}>
                    <ProgressBar percent={90} toPercent={50} duration={3000} onCompleted={() => {
                        // Alert.alert('', 'Completed!!!');
                    }} />
                </View>
                <View style={{ flexDirection: 'row', height: 45, width: 350, paddingLeft: 0, paddingRight: 0 }}>
                    <ProgressBar percent={50} toPercent={90} duration={3000} onCompleted={() => {
                        // Alert.alert('', 'Completed!!!');
                    }} />
                </View>
                <View style={{ flexDirection: 'row', height: 45, width: 350, paddingLeft: 0, paddingRight: 0 }}>
                    <ProgressBar percent={0} toPercent={100} duration={3000} onCompleted={() => {
                        // Alert.alert('', 'Completed!!!');
                    }} />
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

export default connect((state) => ({ ...state.AppModel, user: { ...state.UserModel } }))(SkillTabPage);