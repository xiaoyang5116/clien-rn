import { View, Text, Image } from 'react-native'
import React from 'react'
import {
    changeAvatar,
    ThemeContext
} from '../../../constants'
import { formatDateTime, timeDiff, now } from '../../../utils/DateTimeUtils';


const HistoryLetter = (props) => {
    const theme = React.useContext(ThemeContext);
    const { item, figureInfo } = props
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
                <Text style={[theme.mailTips, { paddingTop: 2, paddingBottom: 2, paddingLeft: 24, paddingRight: 24, textAlign: 'center', fontSize: 14, borderRadius: 12, }]}>
                    {timeDiff(item.time, now())}前
                </Text>
            </View>
            <View style={[theme.blockBgColor1, { marginLeft: 18, marginRight: 18, borderRadius: 10, paddingLeft: 15, paddingRight: 15 }]}>
                <View style={{ height: 80, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center', }}>
                    <View>
                        <Image source={changeAvatar(figureInfo.avatar)} style={{ height: 50, width: 50, borderRadius: 5 }} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 20, marginLeft: 8, color: '#7690d2' }}>
                            {figureInfo.name}
                        </Text>
                        <Text style={[theme.titleColor2, { fontSize: 14, marginLeft: 8 }]}>
                            {formatDateTime(item.time)}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={[theme.contentColor3, { fontSize: 18 }]} >{item.mailContent}</Text>
                </View>
                <View style={[theme.blockBgColor2, { marginTop: 8, marginBottom: 12, padding: 12, borderRadius: 8 }]}>
                    <Text style={{ fontSize: 14, color: '#f9837b' }} >穿越者0000</Text>
                    <Text style={[theme.contentColor2, { fontSize: 14 }]} >
                        {item.replyContent}
                    </Text>
                </View>
            </View>
        </View >
    )
}

export default HistoryLetter