import React from 'react';

import { 
    View, 
    Text,
    StyleSheet,
    Image
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../constants/custom-ui';
import { confirm } from '../../components/dialog';
import { AppDispath } from '../../constants';

const PropTips = (props) => {

    const [ prop, setProp ] = React.useState({});
    const [ num, setNum ] = React.useState(0);

    React.useEffect(() => {
        AppDispath({ type: 'PropsModel/getPropConfig', payload: { propId: props.propId }, cb: (v) => {
            setProp(v);
        }});
        AppDispath({ type: 'PropsModel/getPropNum', payload: { propId: props.propId }, cb: (v) => {
            setNum(v);
        }});
    }, []);

    const useHandler = () => {
        confirm('确认使用？', 
        () => {
            AppDispath({ type: 'PropsModel/use', payload: { propId: props.propId, num: 1 }, cb: () => {
                if (props.onClose != undefined) {
                    props.onClose();
                }
            }});
        });
    }

    const discardHandler = () => {
        confirm('确认丢弃？', 
        () => {
            AppDispath({ type: 'PropsModel/discard', payload: { propId: props.propId }, cb: () => {
                if (props.onClose != undefined) {
                    props.onClose();
                }
            }});
        });
    }

    let propNameColor = {};
    if (prop.quality != undefined) {
        if (prop.quality == '1') {
            propNameColor = styles.quality1;
        } else if (prop.quality == '2') {
            propNameColor = styles.quality2;
        } else if (prop.quality == '3') {
            propNameColor = styles.quality3;
        }
    }

    return (
        <View style={styles.viewContainer} onTouchStart={() => {
            if (props.onClose != undefined) {
                props.onClose();
            }
        }}>
            <View style={styles.bodyContainer} onTouchStart={(e) => {
                e.stopPropagation();
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.icon}>
                        <Image source={require('../../../assets/props/prop_1.png')} />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={[{ fontSize: 24 }, propNameColor]}>{prop.name}</Text>
                        <Text></Text>
                    </View>
                </View>
                <View style={{ marginTop: 15 }}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>{prop.desc}</Text>
                </View>
                <View style={{ marginTop: 30, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#a69582', fontSize: 16 }}>拥有数量：</Text>
                    <Text style={{ color: '#fff' }}>{num}</Text>
                </View>
                {
                (lo.isBoolean(props.viewOnly) && props.viewOnly)
                ? <></>
                : (
                <View style={styles.bottomButtons}>
                    <TextButton title={'使用'} onPress={useHandler} />
                    <TextButton title={'丢弃'} onPress={discardHandler} />
                </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        position: 'absolute', 
        width: '100%', 
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bodyContainer: {
        width: 350,
        height: 500,
        borderWidth: 2,
        borderColor: '#333',
        borderRadius: 6,
        backgroundColor: '#191919',
        padding: 10,
    },
    icon: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: '#222',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
    },
    bottomButtons: {
        position: 'absolute',
        bottom: 0, 
        marginLeft: 10, 
        width: '100%', 
        height: 50, 
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    quality1: {
        color: '#929292'
    },
    quality2: {
        color: '#0433ff'
    },
    quality3: {
        color: '#00f900'
    },
});

export default PropTips;