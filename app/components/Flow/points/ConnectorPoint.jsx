import React from 'react';
import {Group, Circle} from 'react-konva';
import BasicPoint from './BasicPoint';
export default class ConnectorPoint extends BasicPoint {
    static defaultProps = {
        x: 0,
        y: 0,
        radius: 5,
        borderColor: 'red'
    }
    _onMouseEnter() {
        this.setCursor("crosshair");
    }
    render() {
        const events = Object.assign({}, this._getHoverEvents());
        const {x, y, radius, borderColor} = this.state;
        return (
            <Group x={x} y={y} width={radius * 2} height={radius * 2} {...events}>
                <Circle x={radius} y={radius} radius={radius} fill={borderColor}/>
                <Circle x={radius} y={radius} radius={radius - 1} fill="white"/>
            </Group>
        );
    }
}
