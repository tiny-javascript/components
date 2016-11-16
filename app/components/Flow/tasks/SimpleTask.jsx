import React from 'react';
import {Rect, Group, Text} from 'react-konva';
import BasicTask from './BasicTask';
export default class Task extends BasicTask {
    static defaultProps = {
        x: 0,
        y: 0,
        width: 90,
        height: 60,
        backgroundColor: '#009ef1'
    }
    componentWillMount() {
        super.componentWillMount();
        this.state.cornerRadius = 5;
    }
    render() {
        const {width, height, draggable} = this.state;
        const {backgroundColor, cornerRadius} = this.state;
        const events = Object.assign({}, this._clickEvents, this._dragEvents, this._hoverEvents);
        const containerProps = this._getContainerProps();
        return (
            <Group {...containerProps} {...events}>
                <Rect width={width} height={height} fill={backgroundColor} cornerRadius={cornerRadius}></Rect>
                {this._renderBackground()}
            </Group>
        )
    }
}
