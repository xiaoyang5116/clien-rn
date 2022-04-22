import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import React, { useState, useContext } from 'react'

import { TextButton } from '../../constants/custom-ui';
import {
    connect,
    theme,
} from "../../constants";
import MailBox from './MailBox'
import CompletedLetter from './CompletedLetter'


const MailBoxPage = (props) => {

    /**
     * currentStyles: 主题样式
     * onClose: 关闭弹窗
     */
    const { currentStyles, onClose } = props;
    const [currentTab, setCurrentTab] = useState('MailBox')
    const [isHide, setIsHide] = useState(false)

    // 主题样式
    const theme = useContext(ThemeContext);

    return (
        <View style={[styles.mailBox]}>
            <View style={[currentStyles.bgColor, {
                width: 360,
                height: 500,
                position: "relative",
            }]}>
                {currentTab === 'MailBox' ? <MailBox hideMailBoxPage={setIsHide} /> : <CompletedLetter hideMailBoxPage={setIsHide} />}
                <View style={{
                    position: 'absolute',
                    bottom: -30,
                    height: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    display: isHide ? 'none' : 'flex',
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            setCurrentTab('MailBox')
                        }}
                        style={{ width: 60, height: 50, backgroundColor: currentTab === 'MailBox' ? "#003964" : "#e8ddcc", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{}}>
                            <Text style={{ color: currentTab === 'MailBox' ? "#fff" : '#868076' }}>新信件</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setCurrentTab('CompletedLetter')
                        }}
                        style={{ width: 60, height: 50, backgroundColor: currentTab === 'CompletedLetter' ? "#003964" : "#e8ddcc", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 20, }}>
                        <View style={{}}>
                            <Text style={{ color: currentTab === 'CompletedLetter' ? "#fff" : '#868076' }}>已完成</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ width: 360, marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <View></View>
                <TextButton style={{ width: 100 }} currentStyles={currentStyles} title={"返回"} onPress={onClose} />
            </View>
        </View>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(MailBoxPage)

const styles = StyleSheet.create({
    mailBox: {
        flex: 1,
        backgroundColor: "rgba(102, 102, 102, 0.5)",
        justifyContent: 'center',
        alignItems: 'center',
    },
})