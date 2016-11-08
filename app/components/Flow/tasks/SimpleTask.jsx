import React from 'react';
import {Rect, Group, Text} from 'react-konva';
import BasicTask from './BasicTask';
export default class Task extends BasicTask {
    static defaultProps = {
        x: 0,
        y: 0,
        width: 90,
        height: 60,
        opacity: 1,
        background: '#d5e5f7'
    }
    componentWillMount() {
        this.state.cornerRadius = 5;
    }
    render() {
        const {width, height, status, background, cornerRadius} = this.state;
        const events = Object.assign({
            onclick: () => {
                this.setState({status: this.STATUS_ACTIVE});
            }
        }, this._getDragEvents());
        const containerProps = this._getContainerProps();
        const backgroundOpacity = status == this.STATUS_ACTIVE && 1 || 0;
        return (
            <Group draggable={true} {...containerProps} {...events}>
                <Rect width={width} height={height} fill={background} cornerRadius={cornerRadius}/>
                <Rect opacity={backgroundOpacity} width={width} height={height} stroke="red" strokeWith="1"/>
            </Group>
        )
    }
}
