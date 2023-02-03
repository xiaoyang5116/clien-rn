import React from 'react';

import {
    AppDispath,
} from "../../constants";

import {
    View,
    Text,
    TouchableWithoutFeedback,
} from '../../constants/native-ui';

import { 
    DeviceEventEmitter, StyleSheet,
} from 'react-native';

import lo from 'lodash';
import RootView from '../../components/RootView';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EquipSelector from './EquipSelector';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const EquipPlaceHolder = (props) => {

    const refEquip = React.useRef(props.initEquip);
    const [equip, setEquip] = React.useState(props.initEquip);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@EquipSelector.select', ({ tag, e }) => {
            if (!lo.isEqual(tag, props.tag))
                return
            
            if (lo.isEmpty(e)) {
                AppDispath({ type: 'EquipModel/removeEquip', payload: { equipId: refEquip.current.id }, cb: (v) => {
                    if (v) {
                        setEquip(null);
                        refEquip.current = null;
                    }
                }});
            } else {
                AppDispath({ type: 'EquipModel/addEquip', payload: { equipId: e.id }, cb: (v) => {
                    if (v) {
                        setEquip(e);
                        refEquip.current = e;
                    }
                }});
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => {
            const key = RootView.add(<EquipSelector tag={props.tag} currentEquipId={(lo.isEmpty(equip) ? 0 : equip.id)} onClose={() => {
                RootView.remove(key);
            }} />);
        }}>
            <View style={equipStyles.equipItem}>
                {
                    lo.isEmpty(equip) 
                    ? <FastImage style={{ width:px2pd(449), height:px2pd(76), position:"absolute" }} source={require(`../../../assets/character/zb_0.png`)}/>
                    : <FastImage style={{ width:px2pd(445), height:px2pd(72), position:"absolute" }} source={require(`../../../assets/character/zb_1.png`)}/>
                }
                
                <Text style={{ color: '#000', fontSize: 16 }}>{(lo.isEmpty(equip) ? props.tag : equip.name)}</Text>
                <View style={{ position: 'absolute', right: 12 }}>
                    <FastImage style={{width:px2pd(55),height:px2pd(56)}} source={require('../../../assets/character/addBtn.png')} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const equipStyles = StyleSheet.create({
    equipItem: {
        width:px2pd(449),
        height:px2pd(76),
        // width: 120, 
        // height: 30, 
        // borderWidth: 1, 
        // borderColor: '#4d4b49', 
        // borderRadius: 10, 
        flexDirection: 'row',
        // backgroundColor: '#b7b2ad',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
        marginRight: 10,
    },
});

export default EquipPlaceHolder;