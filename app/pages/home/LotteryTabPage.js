import React from 'react';

import {
    connect,
    Component,
} from "../../constants";

import RootView from '../../components/RootView';
import { LotteryPopPage } from './LotteryPopPage';

class LotteryTabPage extends Component {

    constructor(props) {
        super(props);
        this.unsubscribe = null;
    }

    showPopView() {
        let key =RootView.add(<LotteryPopPage {...this.props} onClose={() => {
            RootView.remove(key);
            this.props.navigation.navigate('Home', { 
                screen: 'Profile'
            }); 
        }} />);
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            this.showPopView();
        });
        this.showPopView();
    }
    
    componentWillUnmount() {
    this.unsubscribe();
    }

    render() {
        return (<></>);
    }

}

export default connect((state) => ({ ...state.AppModel }))(LotteryTabPage);