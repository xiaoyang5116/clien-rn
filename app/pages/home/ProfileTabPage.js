import React from 'react';

import {
    action,
    connect,
    ThemeContext,
} from "../../constants";

import {
    View,
    Text,
    FlatList,
} from '../../constants/native-ui';

import { Panel } from '../../components/panel';
import { ImageButton } from '../../constants/custom-ui';
import * as RootNavigation from '../../utils/RootNavigation';

class ProfileTabPage extends React.Component {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);
        this.flatListKey = 1; // 用于强制刷新
        this.data = [
            {
                id: 1,
                title: '界面风格设置',
                cb: () => {
                    RootNavigation.navigate('Settings', { screen: 'Appearance', });
                }
            },
            {
                id: 2,
                title: '...',
            },
            {
                id: 3,
                title: '...',
            },
        ];
    }

    _onChangeTheme = (themeId) => {
        if (themeId >= 0) {
            this.props.dispatch(action('AppModel/changeTheme')({ themeId: themeId }));
        }
    }

    _renderItem = (data) => {
        const item = data.item;
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', height: 80 }}>
                <ImageButton height={80}
                    source={this.context.profileItemImage}
                    selectedSource={this.context.profileItemImageSelected}
                    onPress={() => { if (item.cb != undefined) item.cb(); }}
                />
                <View style={{ position: 'absolute', left: 0, top: 30, width: '100%', justifyContent: 'center', alignItems: 'center' }} pointerEvents='none' >
                    <Text style={{ color: this.context.button.fontColor, fontSize: 20 }}>{item.title}</Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <Panel>
                <View style={{ flex: 1, marginTop: 10 }}>
                    <FlatList
                        key={this.flatListKey++}
                        data={this.data}
                        renderItem={this._renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            </Panel>
        );
    }
}


export default connect((state) => ({ ...state.AppModel }))(ProfileTabPage);