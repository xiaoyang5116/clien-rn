import React from 'react';
import RootView from '../components/RootView';
import XiuXingTabPage from './home/XiuXingTabPage';
import AlchemyRoomModal from '../components/alchemyRoom';
import { PlantPage } from '../components/plant';
import Transitions from '../components/transition';
import WorshipModal from '../components/worship';

export default class OpenUI {

    static open(name) {
        console.log("name", name);
        const pageName = name.split('-')
        const isOpenBoot = pageName.length > 1 ? true : false
        switch (pageName[0]) {
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
            case 'GongFeng':
                WorshipModal.show();
                break;

            default: return <></>
        }
    }

}