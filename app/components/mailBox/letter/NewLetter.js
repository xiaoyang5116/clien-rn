import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect } from 'react'
import { changeAvatar } from '../../../constants'
import TextAnimation from '../../textAnimation'

const NewLetter = (props) => {
    const { item, openLetter, replyLetter, figureInfo } = props
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
                <Text style={{ paddingTop: 2, paddingBottom: 2, paddingLeft: 24, paddingRight: 24, textAlign: 'center', fontSize: 14, backgroundColor: '#d3c2aa', borderRadius: 12, }}>
                    {item.isOpen ? '请你尽快给它回信吧！' : '你收到了一封新信笺！'}
                </Text>
            </View>
            <TouchableOpacity onPress={() => { item.isOpen ? replyLetter() : openLetter(item.key) }}>
                <View style={{ backgroundColor: '#e8d2b0', marginLeft: 18, marginRight: 18, borderRadius: 10, paddingLeft: 15 }}>
                    <View style={{ height: 80, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center', }}>
                        <View>
                            <Image source={changeAvatar(figureInfo.avatar)} style={{ height: 50, width: 50, borderRadius: 5 }} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 20, marginLeft: 8, color: '#d86362' }}>{item.isOpen ? figureInfo.name : "新信笺！"}</Text>
                            <Text style={{ fontSize: 14, marginLeft: 8 }}>{item.isOpen ? "改信笺还未回复~" : "请点击信笺，阅读内容~"}</Text>
                        </View>
                    </View>
                    {
                        item.isOpen && (
                            <View style={{ paddingBottom: 12 }}>
                                <TextAnimation type={'TextSingle'} style={{ fontSize: 18 }} >{item.mailContent}</TextAnimation>
                            </View>
                        )
                    }
                </View>
            </TouchableOpacity>
        </View >
    )
}

export default NewLetter