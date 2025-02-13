import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';

import ImageCapInset from 'react-native-image-capinsets-next';

import { ThemeContext } from '../../../constants';
import { TextButton } from '../../../constants/custom-ui';
import { Panel } from '../../../components/panel';
import { Popover } from '@ant-design/react-native';

const MailPanel = props => {
    const { onClose } = props;
    const theme = React.useContext(ThemeContext);
    return (
        <SafeAreaView style={{ flex: 1, ...props.style }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* content */}
                <View
                    style={[
                        theme.pageBgColor1,
                        { margin: 12, width: '90%', height: '75%', position: 'relative' },
                    ]}>
                    {/* 顶层 影响点击 */}
                    {/* <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 2 }}
                        source={require('../../../../assets/button/40dpi.png')}
                        capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                    /> */}
                    <Panel style={{ zIndex: 1 }}>
                        <View style={{ flex: 1, padding: 12 }}>{props.children}</View>
                    </Panel>
                </View>
                {/* button */}
                <View style={[theme.rowSpaceBetween, { marginTop: 24, width: '90%' }]}>
                    <View></View>
                    <TextButton style={{ width: 100 }} title={'返回'} onPress={onClose} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default MailPanel;
