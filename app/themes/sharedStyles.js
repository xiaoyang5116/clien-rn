/**
 * Layout stlye
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import { StyleSheet } from '../constants';

const sharedStyles = StyleSheet.create({
    // /** ================================ */
    // /**             公用                 */
    // /** ================================ */
    // /* 通用视图容器 */
    // viewContainer: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    /** ================================ */
    /**            小说阅读样式            */
    /** ================================ */

    // ----序章
    prologueContainer: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center'
    },
    prologueWrap: {
        width: 350,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderColor: "black",
        borderWidth: 1,
    },
    // ----序章 end

    // ----追加弹出提示
    tooltip: {
        backgroundColor: "#f2f6eb",
        borderColor: "black",
        borderWidth: 1,
    },
    tooltipContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    // 道具图片
    tooltipImg: {
        width: 20,
        height: 20,
        backgroundColor: "#8eb4e3",
        transform: [{ rotate: '45deg' }],
    },
    tooltipText: {
        fontSize: 18,
        // textAlign: 'center',
        paddingLeft: 12,
    },
    // ----追加弹出提示 end

    // ----Game over
    gameOverPage: {
        flex: 1,
        paddingTop: 70,
        paddingBottom: 70,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignContent: 'center',
    },
    GameOverModal: {
        flex: 1,
        borderColor: "black",
        borderWidth: 1,
        justifyContent: 'center',
    },
    GameOverModalContent: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'flex-start'
    },
    GameOverModalContent_Text: {
        fontSize: 24,
        paddingTop: 24,
    },
    GameOverModalButtonContainer: {
        flex: 1,
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent: 'flex-start',
    },
    GameOverModalButtonContainer_Button: {
        paddingTop: 24,
    },
    // ----Game over end






});

export default sharedStyles;