import React from 'react';
import BasicEvent from './BasicEvent';
export default class EndEvent extends BasicEvent {
    static defaultProps = {
        x: 30,
        y: 30,
        radius: 30
    }
    componentWillMount() {
        super.componentWillMount();
        this.state.backgroundColor = 'rgb(255,0,0)';
    }
}
