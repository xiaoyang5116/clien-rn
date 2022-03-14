import React from 'react';

import {
    action,
    connect,
    delay,
    Component,
    StyleSheet,
} from "../../constants";

import { View, Button } from '../../constants/native-ui';
import ProgressBar from '../../components/ProgressBar';

class SkillTabPage extends Component {

    constructor(props) {
        super(props);
        this.state = { percent: 100 };
    }

    _alertCopper(value) {
        this.props.dispatch(action('UserModel/alertCopper')({ value: value }));
    }

    _reset() {
        this.setState(
            { percent: 100 }
        );
    }

    render() {
        return (
            <View style={this.props.currentStyles.viewContainer}>
                <View style={{ flexDirection: 'row', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <ProgressBar percent={this.state.percent} duration={10000} />
                </View>
                <View style={{ flexDirection: 'row', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <ProgressBar percent={this.state.percent} duration={6000} />
                </View>
                <View style={{ flexDirection: 'row', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <ProgressBar percent={this.state.percent} duration={3000} />
                </View>
                <Button title='重置' onPress={(e) => { this._reset(); }} />
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