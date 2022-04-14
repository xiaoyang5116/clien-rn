import React from 'react';

import {
    connect,
    Component,
} from "../../constants";

import RootView from '../../components/RootView';
import ExploreAreaPopPage from './ExploreAreaPopPage';

class ExploreTabPage extends Component {

    constructor(props) {
        super(props);
        this.unsubscribe = null;
    }

    showExploreArea() {
        let key =RootView.add(<ExploreAreaPopPage {...this.props} onClose={() => {
            RootView.remove(key);
            this.props.navigation.navigate('Home', { 
                screen: 'Profile'
            }); 
        }} />);
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            this.showExploreArea();
        });
        this.showExploreArea();
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (<></>);
    }

}

export default connect((state) => ({ ...state.AppModel }))(ExploreTabPage);