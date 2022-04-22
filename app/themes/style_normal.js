
import { StyleSheet } from 'react-native';
import sharedStyles from './sharedStyles';

StyleSheet

const styles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
    /* 通用样式 */
    ...sharedStyles,

    /* 按钮样式 */
    button: {
        color: '#bcfefe',
        backgroundColor: '#003964',
    },
    /** ================================ */
    /**             选择框                */
    /** ================================ */
    /* 对话选项框条目 */
    chatItem: {
        backgroundColor: "#003964",
        paddingTop: 2,
        paddingBottom: 2,
        marginVertical: 2
    },
    /* 导航栏样式 */
    navigation: {
        primary: '#ff2d55',
        background: '#f2f2f2',
        card: '#ffffff',
        text: '#000000',
        border: '#c7c7cc',
        notification: '#ff453a',
    },
});

export default styles;