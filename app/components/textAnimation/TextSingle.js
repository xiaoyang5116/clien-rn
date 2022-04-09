import { Text, } from 'react-native';
import React, { PureComponent } from 'react';

export default class TextSingle extends PureComponent {
    state = {
        currentText: '',
        iconShow: false,
    };

    timer = null;

    single = () => {
        if (this.timer === null) {
            this.timer = setTimeout(() => {
                this.timer = setInterval(() => {
                    if (this.state.currentText.length < this.props.children.length) {
                        this.setState({
                            currentText:
                                this.state.currentText +
                                this.props.children[this.state.currentText.length],
                        });
                    } else {
                        clearInterval(this.timer);
                        this.setState({
                            iconShow: true,
                        });
                    }
                }, 18);
            }, 0);
        }
    };
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        this.single();
        if (this.props.icon) {
            return (
                <Text style={{ fontSize: this.props.fontSize || 18, ...this.props.style }}>
                    {this.state.currentText + (this.state.iconShow ? this.props.icon : '')}
                </Text>
            );
        }
        return (
            <Text style={{ fontSize: this.props.fontSize || 18, ...this.props.style }}>
                {this.state.currentText}
            </Text>
        );
    }
}
