import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import { View, Text, TouchableOpacity } from '../../constants/native-ui';
// import { TextButton } from '../../constants/custom-ui';
// import * as DateTime from '../../utils/DateTimeUtils';
import RootView from '../../components/RootView';
import Theme from '../../components/theme';

class ProfileTabPage extends Component {

    constructor(props) {
        super(props);
    }

    _onChangeTheme = (themeId) => {
        if (themeId >= 0) {
            this.props.dispatch(action('AppModel/changeTheme')({ themeId: themeId }));
        }
    }

    render() {
        return (
            // <View style={this.props.currentStyles.viewContainer}>
            //     <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 20, paddingTop: 10, paddingBottom: 10, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', 
            //         borderColor: '#999', borderWidth: 1, backgroundColor: '#ede7db' }}>
            //         <Text>选择风格：</Text>
            //         <TextButton {...this.props} title="白天模式" onPress={() => { this._onChangeTheme(0) }} />
            //         <TextButton {...this.props} title="夜晚模式" onPress={() => { this._onChangeTheme(1) }} />
            //     </View>
            // </View>
            <TouchableOpacity
                style={{ marginLeft: 10, marginRight: 10, marginBottom: 20, }}
                onPress={() => {
                    const key = RootView.add(<Theme updateTheme={this._onChangeTheme} onClose={() => { RootView.remove(key) }} />);
                }}
            >
                <View style={{ width: "100%", paddingTop: 10, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderColor: '#999', borderWidth: 1, backgroundColor: '#ede7db' }}>
                    <Text style={{ fontSize: 18 }}>选择风格</Text>
                    {/* <TextButton {...this.props} title="白天模式" onPress={() => { this._onChangeTheme(0) }} />
                                <TextButton {...this.props} title="夜晚模式" onPress={() => { this._onChangeTheme(1) }} /> */}
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    logo: {
        width: 80,
        height: 80
    },
});

export default connect((state) => ({ ...state.AppModel }))(ProfileTabPage);