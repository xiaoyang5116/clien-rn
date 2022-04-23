import React from 'react';

import {
    action,
    connect,
    Component,
    ThemeContext,
} from "../../constants";

import { View, Text, TouchableOpacity } from '../../constants/native-ui';
import RootView from '../../components/RootView';
import ThemeComponent from '../../components/theme';

const ProfileTabPage = (props) => {
    const theme = React.useContext(ThemeContext);

    const _onChangeTheme = (themeId) => {
        if (themeId >= 0) {
            props.dispatch(action('AppModel/changeTheme')({ themeId: themeId }));
        }
    }


    return (
        <TouchableOpacity
            style={{ marginLeft: 10, marginRight: 10, marginBottom: 20, }}
            onPress={() => {
                const key = RootView.add(<ThemeComponent updateTheme={_onChangeTheme} onClose={() => { RootView.remove(key) }} />);
            }}
        >
            <View style={[{ width: "100%", paddingTop: 10, paddingBottom: 10, borderColor: '#999', borderWidth: 1, backgroundColor: '#ede7db' }, theme.rowCenter]}>
                <Text style={{ fontSize: 18 }}>选择风格</Text>
            </View>
        </TouchableOpacity>
    );

}


export default connect((state) => ({ ...state.AppModel }))(ProfileTabPage);