import React from 'react';
import {Group, Circle} from 'react-konva';
import BasicGateway from './BasicGateway';
export default class InclusiveGateway extends BasicGateway {
    static defaultProps = {
        x: 30,
        y: 30,
        radius: 30,
        padding: 12,
        iconLineWidth: 4
    }
    _renderIcon() {
        const {radius, iconLineWidth, padding} = this.state;
        const nRadius = radius / 2;
        return <Circle x={radius} y={radius} radius={nRadius} strokeWidth={iconLineWidth} stroke='#000'/>;
    }
}
