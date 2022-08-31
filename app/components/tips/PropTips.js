import React from 'react';

import { 
    View, 
    Text,
    StyleSheet,
    Image
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../constants/custom-ui';
import qualityStyle from '../../themes/qualityStyle';
import { confirm } from '../../components/dialog';
import { AppDispath } from '../../constants';
import PropGrid from '../prop/PropGrid';

const PropTips = (props) => {

    const [ prop, setProp ] = React.useState({});
    const [ num, setNum ] = React.useState('');

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

    const quality_style = (prop.quality != undefined) ? qualityStyle.styles.find(e => e.id == prop.quality) : {};

    return (
        <View style={[styles.viewContainer,{zIndex: props.zIndex ? props.zIndex : null}]} onTouchStart={() => {
            if (props.onClose != undefined) {
                props.onClose();
            }
        }}>
            <View style={styles.bodyContainer} onTouchStart={(e) => {
                e.stopPropagation();
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.icon}>
                        {(prop.id != undefined) ? <PropGrid prop={prop} showLabel={false} showNum={false} /> : <></>}
                    </View>
                    <View style={{ marginLeft: 10, marginTop: 0 }}>
                        <Text style={[{ fontSize: 24 }, { color: quality_style.fontColor }]}>{prop.name}</Text>
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
        marginTop: 8, 
        marginLeft: 8,
        marginRight: 8,
        transform: [{ scale: 1.2 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButtons: {
        position: 'absolute',
        bottom: 10, 
        marginLeft: 10, 
        width: '100%', 
        height: 50, 
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
});

export default PropTips;