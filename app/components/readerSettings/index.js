import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useEffect } from 'react';

import Modal from 'react-native-modal';

const RowLayout = (props) => {
    return (
        <View style={styles.row}>
            <View style={styles.itemLeft}>{props.left}</View>
            <View style={styles.itemRight}>{props.right}</View>
        </View>
    )
}

const SetFontSize = () => {
    return (
        <RowLayout left={<Button title='ssss' />} right={<Button title='ssss' />} />
    )
}

const ReaderSettings = () => {
    const [visible, setVisible] = React.useState(false);
    useEffect(() => {
        setVisible(true);
        return () => {
            setVisible(false);
        };
    }, []);
    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationInTiming={300}
            animationOut="slideOutDown"
            animationOutTiming={300}
            backdropOpacity={0}
            onBackButtonPress={() => {
                setVisible(false);
            }}
            onBackdropPress={() => {
                setVisible(false);
            }}
            style={{ padding: 0, margin: 0, flex: 1, zIndex: 1 }}
        >
            <View style={[styles.container, { backgroundColor: '#fff' }]}>
                <SetFontSize />
                <SetFontSize />
                <SetFontSize />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 200,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    row: {
        width: '100%',
        height: 50,
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 12,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLeft: {
        width: '70%',
        height: '100%',
    },
    itemRight: {
        width: '30%',
        height: '100%',
    }
});

export default ReaderSettings;
