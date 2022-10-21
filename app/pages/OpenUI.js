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

    static open(name) {
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
            case 'LianQi':
                LianQiPage.show();
                break;
            case 'GongFeng':
                WorshipModal.show();
                break;
            case 'GongFa':
                Gongfa.show();
                break;

        if (lo.isEqual(name, 'XiuXing')) {
            const key = RootView.add(
                <Transitions id={'OPEN_XIUXING_UI'}>
                    <XiuXingTabPage onClose={() => { RootView.remove(key); }} />
                </Transitions>
            );
        } else if (lo.isEqual(name, 'LianDanFang')) {
            AlchemyRoomModal.show(isOpenBoot);
        } else if (lo.isEqual(name, 'ZhongZhi')) {
            PlantPage.show();
        } else if (lo.isEqual(name, 'LianQi')) {
            LianQiPage.show();
        } else if (lo.isEqual(name, 'GongFeng')) {
            WorshipModal.show();
        } else if (lo.isEqual(name, 'WorldMap')) {
            const key = RootView.add(<WorldMap onClose={() => {
                RootView.remove(key);
            }} />);
        } else {
            return (<></>);
        }
    }

}