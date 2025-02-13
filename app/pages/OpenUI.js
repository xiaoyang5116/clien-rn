import React from 'react';

import AlchemyRoomModal from '../components/alchemyRoom';
import { PlantPage } from '../components/plant';
import WorshipModal from '../components/worship';
import LianQiPage from '../components/lianQi'
import GongFa from '../components/gongFa';
import XiuXingUtils from '../utils/XiuXingUtils';
import { WorldMapUtils } from '../components/maps/WorldMap';
import Achievement from '../components/achievement';

export default class OpenUI {

    static open(input) {
        const splits = input.split('-')
        const isOpenBoot = (splits.length > 1);
        const name = splits[0];

        switch (name) {
            case 'XiuXing':
                XiuXingUtils.show();
                break;
            case 'LianDanFang':
                AlchemyRoomModal.show(isOpenBoot)
                break;
            case 'ZhongZhi':
                PlantPage.show();
                break;
            case 'LianQi':
                LianQiPage.show();
                break;
            case 'GongFeng':
                WorshipModal.show();
                break;
            case 'GongFa':
                GongFa.show();
                break;
            case 'WorldMap':
                WorldMapUtils.show();
                break;
            case 'ChengJiu':
                Achievement.show();
                break;
        }
    }

}