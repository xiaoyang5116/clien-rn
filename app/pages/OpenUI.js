import React from 'react';

import lo from 'lodash';
import RootView from '../components/RootView';
import XiuXingTabPage from './home/XiuXingTabPage';
import AlchemyRoomModal from '../components/alchemyRoom';
import { PlantPage } from '../components/plant';
import Transitions from '../components/transition';
import WorshipModal from '../components/worship';
import LianQiPage from '../components/lianQi'
import Gongfa from '../components/gongfa';

export default class OpenUI {

    static open(input) {
        const splits = input.split('-')
        const isOpenBoot = (splits.length > 1);
        const name = splits[0];

        switch (name) {
            case 'XiuXing':
                const key = RootView.add(
                    <Transitions id={'OPEN_XIUXING_UI'}>
                        <XiuXingTabPage onClose={() => { RootView.remove(key); }} />
                    </Transitions>);
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
                Gongfa.show();
                break;
            case 'WorldMap':
                // show();
                break;
        }
    }

}