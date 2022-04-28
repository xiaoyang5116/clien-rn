import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';

import { ThemeContext } from '../constants';
import MailPanel from './mail/components/MailPanel';
import NewMailPage from './mail/NewMailPage';
import CompletedMailPage from './mail/CompletedMailPage';


const MailBoxPage = props => {
    const theme = React.useContext(ThemeContext);
    // onClose: 关闭弹窗
    const { onClose } = props;
    const [currentTab, setCurrentTab] = React.useState('NewMailPage');
    const [isHide, setIsHide] = useState(false);

    // 切换tab
    const changeTab = tab => {
        setCurrentTab(tab);
    };

    // 底部tab
    const BottomTab = props => {
        return (
            <TouchableOpacity
                onPress={() => {
                    changeTab(props.tab);
                }}
                style={[
                    theme.rowCenter,
                    currentTab === props.tab ? theme.btnBgColor1 : theme.btnBgColor2,
                    {
                        width: 60,
                        height: 50,
                    },
                ]}>
                <View style={{}}>
                    <Text style={[currentTab === props.tab ? theme.contentColor1 : theme.contentColor2]}>
                        {props.title}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <MailPanel onClose={onClose} style={{ display: isHide ? 'none' : 'flex', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={[{ position: 'relative', flex: 1 }]}>
                {/* 当前tab内容 */}
                {currentTab === 'NewMailPage' ? (
                    <NewMailPage hideMailBoxPage={setIsHide} />
                ) : (
                    <CompletedMailPage hideMailBoxPage={setIsHide} />
                )}

                {/* 底部tab */}
                <View
                    style={[
                        theme.rowSpaceBetween,
                        {
                            position: 'absolute',
                            left: 0,
                            bottom: -40,
                            height: 50,
                            width: 130,
                        },
                    ]}>
                    <BottomTab title={'新信件'} tab={'NewMailPage'} />
                    <BottomTab title={'已完成'} tab={'CompletedMailPage'} />
                </View>
            </View>
        </MailPanel>
    );
};

export default MailBoxPage;
