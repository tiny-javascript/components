import React from 'react';
import {Rect, Group, Text} from 'react-konva';
import BasicTask from './BasicTask';
export default class Task extends BasicTask {
    static defaultProps = {
        x: 0,
        y: 0,
        width: 180,
        height: 120,
        opacity: 1,
        backgroundColor: '#d5e5f7'
    }
    componentWillMount() {
        super.componentWillMount();
        this.state.cornerRadius = 0;
    }
    render() {
        const {width, height, draggable} = this.state;
        const {backgroundColor, cornerRadius} = this.state;
        const events = this._getEvents();
        const containerProps = this._getContainerProps();
        return (
            <Group ref="container" draggable={draggable} {...containerProps} {...events}>
                <Rect width={width} height={height} fill={backgroundColor} cornerRadius={cornerRadius}/>
                <Group></Group>
                {this._renderWrap()}
            </Group>
        )
    }
}
