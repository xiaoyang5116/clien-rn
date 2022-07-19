import React from 'react';
import SpriteSheet from '../SpriteSheet';
import lo from 'lodash';

import {
    Animated,
    View,
    StyleSheet,
    DeviceEventEmitter,
} from 'react-native';


const IMAGES = [
    { id: 0, source: require('../../../assets/animations/buxue0-1.png'), frameWidth: 540, frameHeight: 540, frameNums: 9, columns: 3, rows: 3 },
    { id: 1, source: require('../../../assets/animations/buxue1-2.png'), frameWidth: 540, frameHeight: 540, frameNums: 9, columns: 3, rows: 3 },
    { id: 2, source: require('../../../assets/animations/buxue2-3.png'), frameWidth: 540, frameHeight: 540, frameNums: 9, columns: 3, rows: 3 },
    { id: 3, source: require('../../../assets/animations/buxue3-4.png'), frameWidth: 540, frameHeight: 540, frameNums: 9, columns: 3, rows: 3 },
    { id: 4, source: require('../../../assets/animations/buxue4-5.png'), frameWidth: 540, frameHeight: 540, frameNums: 6, columns: 3, rows: 2 },
]

const SheetItem = (props) => {

    const sheet = React.createRef(null);
    const opacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@BuXue.sheetItem', (id) => {
            if (props.data.id != id)
                return

            const play = type => {
                sheet.current.play({
                    type,
                    fps: Number(18),
                    resetAfterFinish: false,
                    loop: false,
                    onFinish: () => {
                        opacity.setValue(0);
                        const next = IMAGES.find(e => e.id == (id + 1));
                        if (next != undefined) {
                            DeviceEventEmitter.emit('__@BuXue.sheetItem', next.id);
                        } else  {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }
                    },
                });
            }

            opacity.setValue(1);
            play('walk');
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <Animated.View style={{ opacity: opacity }}>
            <SpriteSheet
                ref={ref => (sheet.current = ref)}
                source={props.data.source}
                columns={props.data.columns}
                rows={props.data.rows}
                frameWidth={props.data.frameWidth}
                frameHeight={props.data.frameHeight}
                imageStyle={{}}
                viewStyle={{}}
                animations={{
                    walk: lo.range(props.data.frameNums),
                }}
            />
        </Animated.View>
    );
}

const BuXue = (props) => {

    React.useEffect(() => {
        DeviceEventEmitter.emit('__@BuXue.sheetItem', 0);
    }, []);

    const items = [];
    IMAGES.forEach(e => {
        items.push(
            <View key={e.id} style={{ position: 'absolute' }}>
                <SheetItem data={e} {...props} />
            </View>
        );
    });

    return (
        <View style={styles.viewContainer}>
            {items}
        </View>
    );
}

export default BuXue;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});
