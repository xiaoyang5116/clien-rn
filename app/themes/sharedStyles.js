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
        backgroundColor:"#fff",
        justifyContent:'center',
        alignItems:'center'
    },
    prologueWrap:{
        width:350,
        height:150,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderColor: "black",
        borderWidth: 1,
    }
    // ----序章 end



});

export default sharedStyles;