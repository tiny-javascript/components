import React from 'react';
import {Group, Line} from 'react-konva';
import BasicGateway from './BasicGateway';
export default class ParallelGateway extends BasicGateway {
    static defaultProps = {
        x: 30,
        y: 30,
        radius: 30,
        padding: 12,
        iconLineWidth: 4
    }
    _renderIcon() {
        const {radius, iconLineWidth, padding} = this.state;
        const max = radius * 2 - padding;
        const verticalLinePoints = [padding, radius, max, radius];
        const horizontalLinePoints = [radius, padding, radius, max];
        return (
            <Group>
                <Line points={horizontalLinePoints} stroke="#000" strokeWidth={iconLineWidth}></Line>
                <Line points={verticalLinePoints} stroke="#000" strokeWidth={iconLineWidth}></Line>
            </Group>
        )
    }
}
