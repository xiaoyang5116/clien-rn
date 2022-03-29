import React, {
} from 'react';

import RootView from '../RootView';
import HalfScreenDialog from './HalfScreenDialog';


class Dialog {

    static halfScreenDialog() {
        const key = RootView.add(
            <HalfScreenDialog onHide={() => {
                RootView.remove(key);
            }} />
        );
    }
}

export default Dialog