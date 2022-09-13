
import lo from 'lodash';

const topBgImages = [
    { name: 'BGT_1', img: require('../../assets/scene/BGT_1.webp') },
    { name: 'BGT_2', img: require('../../assets/scene/BGT_2.webp') },
    { name: 'BGT_3', img: require('../../assets/scene/BGT_3.webp') },
    { name: 'BGT_4', img: require('../../assets/scene/BGT_4.webp') },
    { name: 'BGT_5', img: require('../../assets/scene/BGT_5.webp') },
    { name: 'BGT_6', img: require('../../assets/scene/BGT_6.webp') },
    { name: 'BGT_7', img: require('../../assets/scene/BGT_7.webp') },
    { name: 'BGT_8', img: require('../../assets/scene/BGT_8.webp') },
    { name: 'BGT_9', img: require('../../assets/scene/BGT_9.webp') },
    { name: 'BGT_10', img: require('../../assets/scene/BGT_10.webp') },
    { name: 'BGT_11', img: require('../../assets/scene/BGT_11.webp') },
    { name: 'BGT_12', img: require('../../assets/scene/BGT_12.webp') },
    { name: 'BGT_13', img: require('../../assets/scene/BGT_13.webp') },
    { name: 'BGT_14', img: require('../../assets/scene/BGT_14.webp') },
    { name: 'BGT_15', img: require('../../assets/scene/BGT_15.webp') },
    { name: 'BGT_16', img: require('../../assets/scene/BGT_16.webp') },
    { name: 'BGT_17', img: require('../../assets/scene/BGT_17.webp') },
    { name: 'BGT_18', img: require('../../assets/scene/BGT_18.webp') },
    { name: 'BGT_19', img: require('../../assets/scene/BGT_19.webp') },
    { name: 'BGT_20', img: require('../../assets/scene/BGT_20.webp') },
    { name: 'BGT_21', img: require('../../assets/scene/BGT_21.webp') },
    { name: 'BGT_22', img: require('../../assets/scene/BGT_22.webp') },
    { name: 'BGT_23', img: require('../../assets/scene/BGT_23.webp') },
    { name: 'BGT_24', img: require('../../assets/scene/BGT_24.webp') },
    { name: 'BGT_25', img: require('../../assets/scene/BGT_25.webp') },
    { name: 'BGT_26', img: require('../../assets/scene/BGT_26.webp') },
    { name: 'BGT_27', img: require('../../assets/scene/BGT_27.webp') },
    { name: 'BGT_28', img: require('../../assets/scene/BGT_28.webp') },
    { name: 'BGT_29', img: require('../../assets/scene/BGT_29.webp') },
    { name: 'BGT_30', img: require('../../assets/scene/BGT_30.webp') },
    { name: 'BGT_31', img: require('../../assets/scene/BGT_31.webp') },
    { name: 'BGT_32', img: require('../../assets/scene/BGT_32.webp') },
    { name: 'BGT_33', img: require('../../assets/scene/BGT_33.webp') },
    { name: 'BGT_34', img: require('../../assets/scene/BGT_34.webp') },
    { name: 'BGT_35', img: require('../../assets/scene/BGT_35.webp') },
    { name: 'BGT_36', img: require('../../assets/scene/BGT_36.webp') },
    { name: 'BGT_37', img: require('../../assets/scene/BGT_37.webp') },
    { name: 'BGT_38', img: require('../../assets/scene/BGT_38.webp') },
    { name: 'BGT_39', img: require('../../assets/scene/BGT_39.webp') },
    { name: 'BGT_40', img: require('../../assets/scene/BGT_40.webp') },
    { name: 'BGT_41', img: require('../../assets/scene/BGT_41.webp') },
    { name: 'BGT_42', img: require('../../assets/scene/BGT_42.webp') },
    { name: 'BGT_43', img: require('../../assets/scene/BGT_43.webp') },
    { name: 'BGT_44', img: require('../../assets/scene/BGT_44.webp') },
    { name: 'BGT_45', img: require('../../assets/scene/BGT_45.webp') },
    { name: 'BGT_46', img: require('../../assets/scene/BGT_46.webp') },
    { name: 'BGT_47', img: require('../../assets/scene/BGT_47.webp') },
    { name: 'BGT_48', img: require('../../assets/scene/BGT_48.webp') },
    { name: 'BGT_49', img: require('../../assets/scene/BGT_49.webp') },
    { name: 'BGT_50', img: require('../../assets/scene/BGT_50.webp') },
    



   // { name: '上部背景图57656', img: require('../../assets/scene/BGT_70789789.jpg') },
];

// 场景背景图
export const getSceneTopBackgroundImage = (name) => {
    return topBgImages.find(e => lo.isEqual(e.name, name));
}