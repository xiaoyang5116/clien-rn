import React from 'react';
import RootView from '../components/RootView';
import XiuXingTabPage from './home/XiuXingTabPage';
import AlchemyRoomModal from '../components/alchemyRoom';
import { PlantPage } from '../components/plant';
import Transitions from '../components/transition';
import WorshipModal from '../components/worship';

export default class OpenUI {

    static open(name) {
        switch (name) {
            case 'XiuXing':
                const key = RootView.add(
                    <Transitions id={'OPEN_XIUXING_UI'}>
                        <XiuXingTabPage onClose={() => { RootView.remove(key); }} />
                    </Transitions>);
                break;
            case 'LianDanFang':
                AlchemyRoomModal.show()
                break;
            case 'ZhongZhi':
                PlantPage.show();
                break;
            case 'GongFeng':
                WorshipModal.show();
                break;
        }
    }

}