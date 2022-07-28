import React from 'react';

import {
    AppDispath, getWindowSize,
} from "../../constants";

import {
    View,
} from '../../constants/native-ui';

import { 
    StyleSheet,
} from 'react-native';

import lo from 'lodash';
import EquipPlaceHolder from './EquipPlaceHolder';

const WIN_SIZE = getWindowSize();

const EquippedSideBar = (props) => {

    const tags = ['武器', '衣装', '防具', '其他', '饰品1', '饰品2', '法宝'];
    const [placeHolders, setPlaceHolders] = React.useState([]);

    React.useEffect(() => {
        AppDispath({ type: 'UserModel/getEquipsEntity', payload: { }, cb: (v) => {
            if (!lo.isArray(v))
                return

            const views = [];
            lo.forEach(tags, (t, k) => {
                const found = v.find(e => lo.isEqual(e.tag, t));
                views.push( <EquipPlaceHolder key={k} tag={t} initEquip={(found != undefined ? found.entity : null)} />);
            });
            setPlaceHolders(views);
        }});
    }, []);

    return (
        <View style={equipStyles.viewContainer}>
            {placeHolders}
        </View>
    );
}

const equipStyles = StyleSheet.create({
    viewContainer: {
        position: 'absolute', 
        right: 0, 
        // backgroundColor: 'rgba(128,128,128,0.5)', 
        width: WIN_SIZE.width / 2, 
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
});

export default EquippedSideBar;