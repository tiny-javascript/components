import React from 'react';
import {Group, Line} from 'react-konva';
import BasicGateway from './BasicGateway';
export default class ExclusiveGateway extends BasicGateway {
    static defaultProps = {
        x: 30,
        y: 30,
        radius: 30,
        padding: 12,
        iconLineWidth: 4
    }
    _renderIcon() {
        const {radius, iconLineWidth, padding} = this.state;
        let xMin,
            yMin,
            xMax,
            yMax;
        xMin = yMin = radius / 2 + Math.sqrt(padding);
        xMax = yMax = radius * 1.5 - Math.sqrt(padding);
        const leftLinePoints = [xMin, yMin, xMax, yMax];
        const rightLinePoints = [xMax, yMin, xMin, yMax];
        return (
            <Group>
                <Line points={leftLinePoints} stroke="#000" strokeWidth={iconLineWidth}></Line>
                <Line points={rightLinePoints} stroke="#000" strokeWidth={iconLineWidth}></Line>
            </Group>
        )
    }
}
