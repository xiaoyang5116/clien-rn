import React from 'react';

import {
    connect,
    Component,
    DeviceEventEmitter,
} from "../../constants";

import RootView from '../../components/RootView';
import ExploreAreaPopPage from './ExploreAreaPopPage';
import ExploreMainPopPage from './ExploreMainPopPage';

class ExploreTabPage extends Component {

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.eventListener = null;
    }

    _showExploreArea() {
        let key = RootView.add(<ExploreAreaPopPage {...this.props} onClose={() => {
            RootView.remove(key);
            this.props.navigation.navigate('Home', { 
                screen: 'Profile'
            });
        }} />);
    }

    _showExploreMain() {
        let key = RootView.add(<ExploreMainPopPage {...this.props} onClose={() => {
            RootView.remove(key);
            this.props.navigation.navigate('Home', { 
                screen: 'Profile'
            });
        }} />);
    }

    componentDidMount() {
        this.eventListener = DeviceEventEmitter.addListener('ExploreTabPage.show', (payload) => {
            switch (payload) {
                case 'ExploreMainPopPage':
                    this._showExploreMain();
                    break;
                    
                case 'ExploreAreaPopPage':
                    this._showExploreArea();
                    break;
            }
        });

        this.unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            DeviceEventEmitter.emit('ExploreTabPage.show', 'ExploreAreaPopPage');
        });

        //
        DeviceEventEmitter.emit('ExploreTabPage.show', 'ExploreAreaPopPage');
    }
    
    componentWillUnmount() {
        this.unsubscribe();
        this.eventListener.remove();
    }

    render() {
        return (<></>);
    }

}

export default connect((state) => ({ ...state.AppModel }))(ExploreTabPage);