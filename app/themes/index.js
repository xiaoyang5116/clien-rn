
export default {
    // 当前风格ID
    themeId: 0,

    // 风格列表
    themes: [
        { id: 0, name: '白天模式', style: require('./style_normal').default },
        { id: 1, name: '夜晚模式', style: require('./style_dark').default },
    ],
}
