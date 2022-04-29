import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import {
    changeAvatar,
    ThemeContext
} from '../../../constants'
import TextAnimation from '../../../components/textAnimation'
import { now } from '../../../utils/DateTimeUtils'


const NewLetter = (props) => {
    const theme = React.useContext(ThemeContext);

    const { item, openLetter, replyLetter, figureInfo } = props
    const [currentTime, setCurrentTime] = useState(now())
    let timer = null
    useEffect(() => {
        if (currentTime < item.time) {
            timer = setInterval(() => {
                setCurrentTime((currentTime) => currentTime + 1000)
            }, 1000);
        }
        return () => {
            clearInterval(timer)
        }
    }, [])
    if (currentTime < item.time) {
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
                    <Text style={[theme.mailTips, { paddingTop: 2, paddingBottom: 2, paddingLeft: 24, paddingRight: 24, textAlign: 'center', fontSize: 14, borderRadius: 12, }]}>
                        你的信笺已发出，等待他回信！
                    </Text>
                </View>
            </View >
        )
    }
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
                <Text style={[theme.mailTips, { paddingTop: 2, paddingBottom: 2, paddingLeft: 24, paddingRight: 24, textAlign: 'center', fontSize: 14, borderRadius: 12, }]}>
                    {item.isOpen ? '请你尽快给它回信吧！' : '你收到了一封新信笺！'}
                </Text>
            </View>
            <TouchableOpacity onPress={() => { item.isOpen ? replyLetter() : openLetter(item.key) }}>
                <View style={[theme.blockBgColor1, { marginLeft: 18, marginRight: 18, borderRadius: 10, paddingLeft: 15, paddingRight: 15 }]}>
                    <View style={{ height: 80, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center', }}>
                        <View>
                            <Image source={changeAvatar(figureInfo.avatar)} style={{ height: 50, width: 50, borderRadius: 5 }} />
                        </View>
                        <View>
                            <Text style={[theme.titleColor3, { fontSize: 20, marginLeft: 8, }]}>{item.isOpen ? figureInfo.name : "新信笺！"}</Text>
                            <Text style={[theme.titleColor2, { fontSize: 14, marginLeft: 8 }]}>{item.isOpen ? "该信笺还未回复~" : "请点击信笺，阅读内容~"}</Text>
                        </View>
                    </View>
                    {
                        item.isOpen && (
                            <View style={{ paddingBottom: 12 }}>
                                <TextAnimation type={'TextSingle'} fontSize={18} style={theme.contentColor3} >{item.mailContent}</TextAnimation>
                            </View>
                        )
                    }
                </View>
            </TouchableOpacity>
        </View >
    )
}

export default NewLetter