import {
    View,
    Text,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';
import React from 'react';
import { ThemeContext } from '../../../constants';
import { HalfPanel } from '../../panel';

const HalfSingle = (props) => {
    const theme = React.useContext(ThemeContext);
    return (
        <HalfPanel>
            {/* head */}
            <View style={[theme.rowCenter, theme.blockBgColor1, { paddingLeft: 12, paddingRight: 12, height: 50 }]}>
                {/* 标题 */}
                <View style={[theme.rowCenter]}>
                    <Text style={[theme.titleColor1, { fontSize: 24, }]}>
                        {props.title}
                    </Text>
                </View>
            </View>

            {/* 显示区域 */}
            <TouchableWithoutFeedback
                onPress={props.nextParagraph}>
                <View style={[theme.blockBgColor2, { flex: 1, paddingLeft: 2, paddingRight: 2, paddingTop: 2, }]}>
                    {/* 内容显示区域 */}
                    <View style={[theme.blockBgColor3, { height: "70%", paddingLeft: 12, paddingRight: 12, }]}>
                        <FlatList
                            data={props.currentTextList}
                            renderItem={props.renderText}
                            keyExtractor={(item, index) => item + index}
                        />
                    </View>

                    {/* 按钮区域 */}
                    <View style={{ padding: 12, height: "30%" }}>
                        <FlatList
                            data={props.showBtnList}
                            renderItem={props.renderBtn}
                            keyExtractor={(item, index) => item.title + index}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </HalfPanel>
    );

};

export default HalfSingle;
