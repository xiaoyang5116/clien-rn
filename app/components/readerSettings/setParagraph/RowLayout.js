import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
    connect,
} from "../../../constants";
import Slider from '@react-native-community/slider';


const RowLayout = props => {
    const { readerStyle } = props

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: readerStyle.color }]}>
                {props.title}
            </Text>

            <TouchableOpacity
                disabled={props.value === props.min}
                onPress={() => {
                    props.updataState(props.value - 1)
                    props.onChange(props.value - 1)
                }}
            >
                <Text style={[styles.fuhao, { color: readerStyle.color }]}>
                    -
                </Text>
            </TouchableOpacity>

            <View style={styles.slider}>
                <Slider
                    value={props.defaultValue}
                    step={1}
                    maximumValue={props.max}
                    minimumValue={props.min}
                    minimumTrackTintColor="#088f7b"
                    maximumTrackTintColor={readerStyle.color}
                    onValueChange={(value) => { props.onChange(value) }}
                    onSlidingComplete={(value) => { props.updataState(value) }}
                />
            </View>

            <TouchableOpacity
                disabled={props.value === props.max}
                onPress={() => {
                    props.updataState(props.value + 1)
                    props.onChange(props.value + 1)
                }}
            >
                <Text style={[styles.fuhao, { color: readerStyle.color }]}>
                    +
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default connect(state => ({ ...state.ArticleModel }))(RowLayout);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingLeft: 12,
        paddingRight: 12,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    title: {
        width: 100,
        fontSize: 14,
        justifyContent: 'center',
    },
    fuhao: {
        width: 35,
        fontSize: 22,
        lineHeight: 22,
        textAlign: 'center',
    },
    slider: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
    },
})
