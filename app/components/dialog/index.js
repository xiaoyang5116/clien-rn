import React, {
} from 'react';

import RootView from '../RootView';
import HalfScreenDialog from './HalfScreenDialog';
import FullScreenDialog from './FullScreenDialog';

class Dialog {

    static add(type = 'HalfScreenDialog', title, popUpComplex = [], isGame = false) {
        switch (type) {
            case 'HalfScreenDialog':
                return key = RootView.add(
                    <HalfScreenDialog
                        isGame={isGame}
                        title={title}
                        popUpComplex={popUpComplex}
                        onHide={() => {
                            RootView.remove(key);
                        }}
                    />
                );
            case 'FullScreenDialog':
                return key = RootView.add(
                    <FullScreenDialog
                        isGame={isGame}
                        title={title}
                        popUpComplex={popUpComplex}
                        onHide={() => {
                            RootView.remove(key);
                        }}
                    />
                );
        }

    }
}

export default Dialog