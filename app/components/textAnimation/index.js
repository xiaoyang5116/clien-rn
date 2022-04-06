import React, { PureComponent } from 'react';

import TextSingle from './TextSingle';
import TextFadeIn from './TextFadeIn'


export default class TextAnimation extends PureComponent { 
    render() { 
        switch (this.props.type) {
            case 'TextSingle':
                return <TextSingle {...this.props} />
            case 'TextFadeIn':
                return <TextFadeIn {...this.props} />
            default:
                return <TextFadeIn {...this.props} />
        }
    }
}
