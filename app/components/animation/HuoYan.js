import React from 'react';
import SpriteSheet from '../SpriteSheet';
import lo from 'lodash';

import {
    Animated,
    View,
    StyleSheet,
} from 'react-native';

const IMAGES = [
  { id: 0, source: require('../../../assets/animations/huoyan/vv-0-1.png'), frameWidth: 480, frameHeight: 480, frameNums: 16, columns: 4, rows: 4 },
  { id: 1, source: require('../../../assets/animations/huoyan/vv-1-2.png'), frameWidth: 480, frameHeight: 480, frameNums: 16, columns: 4, rows: 4 },
  { id: 2, source: require('../../../assets/animations/huoyan/vv-2-3.png'), frameWidth: 480, frameHeight: 480, frameNums: 16, columns: 4, rows: 4 },
  { id: 3, source: require('../../../assets/animations/huoyan/vv-3-4.png'), frameWidth: 480, frameHeight: 480, frameNums: 12, columns: 4, rows: 4 },
]

class SheetItem extends React.Component {

    constructor(props) {
        super(props);
        this.sheet = React.createRef(null);
        this.opacity = new Animated.Value(0);
    }

    start() {
        const play = type => {
            this.sheet.current.play({
                type,
                fps: Number(18),
                resetAfterFinish: false,
                loop: false,
                onFinish: () => {
                    this.opacity.setValue(0);
                    if (this.props.next.current != null) {
                        this.props.next.current.start();
                    } else {
                        if (this.props.onClose != undefined) {
                            this.props.onClose();
                        }
                    }
                },
            });
        }
        //
        this.opacity.setValue(1);
        play('walk');
    }

    render() {
        return (
            <Animated.View style={{ opacity: this.opacity }}>
                <SpriteSheet
                    ref={ref => (this.sheet.current = ref)}
                    source={this.props.data.source}
                    columns={this.props.data.columns}
                    rows={this.props.data.rows}
                    frameWidth={this.props.data.frameWidth}
                    frameHeight={this.props.data.frameHeight}
                    imageStyle={{}}
                    viewStyle={{}}
                    animations={{
                        walk: lo.range(this.props.data.frameNums),
                    }}
                />
            </Animated.View>
        );
    }
}

const HuoYanAnimation = (props) => {

    const first = React.useRef(null);

    React.useEffect(() => {
        if (first != null) {
            first.current.current.start();
        }
    }, []);

    let nextRef = React.createRef();
    first.current = nextRef;

    const items = [];
    IMAGES.forEach(e => {
        //
        const ref = nextRef;
        nextRef = React.createRef();
        //
        items.push(
            <View key={e.id} style={{ position: 'absolute' }}>
                <SheetItem ref={ref} next={nextRef} data={e} {...props} />
            </View>
        );
    });

    return (
        <View style={styles.viewContainer}>
            {items}
        </View>
    );
}

export default HuoYanAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});
