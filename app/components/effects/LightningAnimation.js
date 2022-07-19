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
    { id: 0, source: require('../../../assets/animations/lightning/light0-1.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 1, source: require('../../../assets/animations/lightning/light1-2.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 2, source: require('../../../assets/animations/lightning/light2-3.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 3, source: require('../../../assets/animations/lightning/light3-4.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 4, source: require('../../../assets/animations/lightning/light4-5.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 5, source: require('../../../assets/animations/lightning/light5-6.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 6, source: require('../../../assets/animations/lightning/light6-7.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 7, source: require('../../../assets/animations/lightning/light7-8.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 8, source: require('../../../assets/animations/lightning/light8-9.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 9, source: require('../../../assets/animations/lightning/light9-10.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 10, source: require('../../../assets/animations/lightning/light10-11.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 11, source: require('../../../assets/animations/lightning/light11-12.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 12, source: require('../../../assets/animations/lightning/light12-13.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 13, source: require('../../../assets/animations/lightning/light13-14.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 14, source: require('../../../assets/animations/lightning/light14-15.png'), frameWidth: 1280, frameHeight: 720, frameNums: 2, columns: 1, rows: 2 },
    { id: 15, source: require('../../../assets/animations/lightning/light15-16.png'), frameWidth: 1280, frameHeight: 720, frameNums: 1, columns: 1, rows: 1 },
]

const SheetItem = (props) => {
    const sheet = React.createRef(null);
    const opacity = React.useRef(new Animated.Value(0)).current;
    const rotate = lo.isNumber(props.rotate) ? props.rotate : 90;

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@LightningAnimation.sheetItem', (id) => {
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
                            DeviceEventEmitter.emit('__@LightningAnimation.sheetItem', next.id);
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
        <Animated.View style={{ opacity: opacity, transform: [{ rotate: `${rotate}deg` }] }}>
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

const LightningAnimation = (props) => {

    React.useEffect(() => {
        DeviceEventEmitter.emit('__@LightningAnimation.sheetItem', 0);
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

export default LightningAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});
