import React from 'react';
import BasicEvent from './BasicEvent';
export default class StartEvent extends BasicEvent {
    static defaultProps = {
        x: 30,
        y: 30,
        radius: 30
    }
    componentWillMount() {
        super.componentWillMount();
        this.state.backgroundColor = '#66c484';
    }
}
