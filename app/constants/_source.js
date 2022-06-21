
import lo from 'lodash';
import { px2pd } from './resolution';

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
    chapterBg: [
        { id: 'V1_1080', width: px2pd(1080), height: px2pd(1080), source: require('../../assets/chapter/V1_1080.png') },
        { id: 'V2_1080', width: px2pd(1080), height: px2pd(1799), source: require('../../assets/chapter/V2_1080.png') },
        { id: 'V3_1080', width: px2pd(1080), height: px2pd(703), source: require('../../assets/chapter/V3_1080.png') },
        { id: 'V4_1080', width: px2pd(1080), height: px2pd(1800), source: require('../../assets/chapter/V4_1080.png') },
        { id: 'V5_1080', width: px2pd(1080), height: px2pd(1800), source: require('../../assets/chapter/V5_1080.png') },
        { id: 'V6_1080', width: px2pd(1080), height: px2pd(1800), source: require('../../assets/chapter/V6_1080.png') },
    ]
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

// 获取文章背景图片
export const getChapterImage = (imageId) => {
    return _images.chapterBg.find(e => lo.isEqual(e.id, imageId));
}