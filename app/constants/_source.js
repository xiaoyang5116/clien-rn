
const _images = {
    avatar: [
        { id: 1, img: require('../../assets/avatar/1.jpg') },
        { id: 2, img: require('../../assets/avatar/2.jpg') },
    ],
    panel: [
        { id: 1, img: require('../../assets/bg/panel_b.png') },
        { id: 2, img: require('../../assets/bg/panel_b2.png') },
        { id: 3, img: require('../../assets/bg/panel_b3.png') },
    ],
}

// 获得头像
export const changeAvatar = (avatar) => {
    return _images.avatar.find(a => a.id == avatar).img
}

// 获取面板风格图片
export const getPanelPatternImage = (patternId) => {
    const item = _images.panel.find(e => e.id == patternId);
    return (item != undefined) ? item.img : null;
}