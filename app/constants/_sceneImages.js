
import lo from 'lodash';

const topBgImages = [
    { name: 'default', img: require('../../assets/scene/bg_default.jpg') },
];

// 场景背景图
export const getSceneTopBackgroundImage = (name) => {
    return topBgImages.find(e => lo.isEqual(e.name, name));
}