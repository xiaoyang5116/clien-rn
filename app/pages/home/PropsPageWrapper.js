import React from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import PropsPage from './PropsPage';
import { SafeAreaView, Text, View } from 'react-native';
import { Panel } from '../../components/panel';
import WorldUtils from '../../utils/WorldUtils';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const PropsPageWrapper = (props) => {

    const [worldName, setWorldName] = React.useState('');

    React.useEffect(() => {
        const worldName = WorldUtils.getWorldNameById(props.user.worldId);
        setWorldName(worldName);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <FastImage style={{ position: 'absolute', width: "100%", height: "100%" }} source={require('../../../assets/bg/porpPage_bg.png')} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <FastImage style={{ position: 'absolute', width: px2pd(1080), height: px2pd(175) }} source={require('../../../assets/bg/propPage_titleBg.png')} />
                    <View style={{ flex: 1, marginTop: px2pd(140) }}>
                        <PropsPage onClose={props.onClose} onWorldChanged={(worldId) => {
                            const worldName = WorldUtils.getWorldNameById(worldId);
                            setWorldName(worldName);
                        }} />
                    </View>
                </View>

            </SafeAreaView>
        </View>
        // <Panel patternId={2}>
        //     <SafeAreaView style={{ flex: 1 }}>
        //         <View style={{ width: '100%', height: 40, justifyContent: 'center', alignItems: 'center' }}>
        //             <FastImage style={{}} source />
        //             {/* <View style={{ position: 'absolute', left: 10 }}>
        //                 <AntDesign name='left' color={'#333'} size={28} onPress={() => {
        //                     if (props.onClose != undefined) {
        //                         props.onClose();
        //                     }
        //                 }} />
        //             </View>
        //             <Text style={{ fontSize: 26, color: '#000' }}>道具</Text>
        //             <View style={{ position: 'absolute', right: 20, bottom: 10 }}>
        //                 <Text style={{ fontSize: 20, color: '#000' }}>--- {worldName}</Text>
        //             </View> */}
        //         </View>
        //         <View style={{ flex: 1 }}>
        //             <PropsPage onWorldChanged={(worldId) => {
        //                 const worldName = WorldUtils.getWorldNameById(worldId);
        //                 setWorldName(worldName);
        //             }} />
        //         </View> 
        //     </SafeAreaView>
        // </Panel>
    );
}

export default connect((state) => ({ user: { ...state.UserModel } }))(PropsPageWrapper);