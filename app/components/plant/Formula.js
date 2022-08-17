import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    SafeAreaView,
    Image
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { connect, action } from '../../constants';
import { h_m_s_Format } from '../../utils/DateTimeUtils';
import RootView from '../RootView';
import { px2pd } from '../../constants/resolution';

import { HalfPanel } from '../panel/HalfPanel';
import { TextButton } from '../../constants/custom-ui';
import Detail from './Detail';
import ImageCapInset from 'react-native-image-capinsets-next';



const Formula = props => {

    const { plantRecipeList, lingTianId } = props
    const [update, setUpdate] = useState(false)

    React.useEffect(() => {
        props.dispatch(action('PlantModel/defaultSort')())
    }, []);

    // console.log("plantComposeConfig", props.plantComposeConfig);
    const showDetailPage = (item) => {
        const key = RootView.add(
            <Detail
                item={item}
                onCloseFormula={props.onClose}
                onClose={() => {
                    RootView.remove(key);
                }}
            />,
        );

    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ height: 70, borderWidth: 1, borderColor: "#000", borderRadius: 3, marginTop: 12, backgroundColor: "rgba(255,255,255,0.5)" }} onPress={() => { showDetailPage(item) }}>
                <ImageCapInset
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    source={require('../../../assets/button/40dpi_gray.png')}
                    capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                />
                <View style={{ flex: 1, flexDirection: "row", paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontSize: 16, color: "#000", }}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {!item.valid ? <Text style={styles.btn}>材料不足</Text> : null}
                        <Text style={styles.btn}>耗时 {h_m_s_Format(item.time)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const sortHandler = (type) => {
        props.dispatch(action('PlantModel/sortFunction')(type)).then(r => {
            setUpdate(!update)
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <Image style={{ position: "absolute", width: px2pd(1080), height: px2pd(2400) }} source={require('../../../assets/plant/plantBg.jpg')} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, }}>
                    <Text style={{
                        height: 50,
                        lineHeight: 50,
                        textAlign: 'center',
                        fontSize: 24,
                        color: '#000',
                    }}>
                        种植选择
                    </Text>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            {/* <TextButton title={'等级'} onPress={()=>{} } /> */}
                            <TextButton title={'种植时间'} onPress={() => { sortHandler("time") }} />
                            <TextButton title={'品质'} onPress={() => { sortHandler("quality") }} />
                        </View>
                        <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={plantRecipeList}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                                extraData={update}
                            />
                        </View>
                    </View>
                    <View>
                        <TextButton
                            title={'退出'}
                            onPress={() => {
                                props.onClose();
                            }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default connect((state) => ({ ...state.PlantModel, ...state.PropsModel }))(Formula);

const styles = StyleSheet.create({
    btn: {
        backgroundColor: "#237804",
        fontSize: 14,
        color: '#fff',
        textAlign: "center",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 4,
        paddingBottom: 4,
    }
})

