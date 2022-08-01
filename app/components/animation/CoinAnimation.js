import React from 'react';
import SpriteSheet from '../SpriteSheet';
import lo from 'lodash';

import {
    View,
    StyleSheet,
} from 'react-native';

// import { getFixedWidthScale } from '../../constants/resolution';

const CoinAnimation = (props) => {

    const sheet = React.createRef(null);

    React.useEffect(() => {
        const play = type => {
            sheet.current.play({
                type,
                fps: Number(18),
                resetAfterFinish: false,
                loop: true,
                onFinish: () => {
                },
            });
        }

        play('walk');
    }, []);

    return (
        <View style={styles.viewContainer}>
            <SpriteSheet
                ref={ref => (sheet.current = ref)}
                source={require('../../../assets/animations/coin.png')}
                columns={5}
                rows={5}
                frameWidth={60}
                frameHeight={60}
                imageStyle={{}}
                // viewStyle={{ transform: [{ scale: getFixedWidthScale() }] }}
                animations={{
                    walk: lo.range(24),
                }}
            />
        </View>
    );
}

export default CoinAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        // backgroundColor: 'rgba(0,0,0,0.5)',
    },
});
