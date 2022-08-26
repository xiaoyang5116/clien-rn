import React from 'react';
import RootView from '../components/RootView';
import XiuXingTabPage from './home/XiuXingTabPage';
import AlchemyRoomModal from '../components/alchemyRoom';

export default class OpenUI {

    static open(name) {
        console.log("ssss");
        switch (name) {
            case 'XiuXing':
                const key = RootView.add(<XiuXingTabPage onClose={() => {
                    RootView.remove(key);
                }} />);
                break;
            case 'LianDanFang':
                AlchemyRoomModal.show()
                break;
        }
    }

}