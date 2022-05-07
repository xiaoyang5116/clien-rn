import React from 'react';

import {
    connect,
    Component,
    DeviceEventEmitter,
    EventKeys,
} from "../../constants";

import RootView from '../../components/RootView';
import ExploreMapsPage from './ExploreMapsPage';
import ExploreMainPage from './ExploreMainPage';

class ExploreTabPage extends Component {

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.eventListener = null;
    }

    _showExploreMaps() {
        let key = RootView.add(<ExploreMapsPage {...this.props} onClose={() => {
            RootView.remove(key);
            this.props.navigation.navigate('Home', { 
                screen: 'Profile'
            });
        }} />);
    }

    _showExploreMain() {
        let key = RootView.add(<ExploreMainPage {...this.props} onClose={() => {
            RootView.remove(key);
            this.props.navigation.navigate('Home', { 
                screen: 'Profile'
            });
        }} />);
    }

    componentDidMount() {
        this.eventListener = DeviceEventEmitter.addListener(EventKeys.EXPLORETABPAGE_SHOW, (payload) => {
            switch (payload) {
                case 'ExploreMainPage':
                    this._showExploreMain();
                    break;
                    
                case 'ExploreMapsPage':
                    this._showExploreMaps();
                    break;
            }
        });

        this.unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            DeviceEventEmitter.emit(EventKeys.EXPLORETABPAGE_SHOW, 'ExploreMapsPage');
        });

        //
        DeviceEventEmitter.emit(EventKeys.EXPLORETABPAGE_SHOW, 'ExploreMapsPage');
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