import React from 'react';
import {Group, Circle} from 'react-konva';
import BasicPoint from './BasicPoint';
export default class ConnectorPoint extends BasicPoint {
    static defaultProps = {
        x: 0,
        y: 0,
        radius: 5,
        borderColor: 'red',
        visible: false
    }
    _onDragStart(e) {
        this.props.onConnectStart && this.props.onConnectStart(e);
    }
    _onDragMove(e) {
        const {x, y} = this.props;
        this.props.onConnect && this.props.onConnect(e);
        this.setState({x, y});
    }
    _onDragEnd(e) {
        this.props.onConnectEnd && this.props.onConnectEnd(e);
    }
    _onMouseEnter(e) {
        this.setCursor("crosshair");
    }
    render() {
        const {x, y, radius, borderColor} = this.state;
        const {draggable, visible} = this.state;
        const events = Object.assign({}, this._dragEvents, this._hoverEvents);
        return (
            <Group draggable={draggable} visible={visible} x={x} y={y} width={radius * 2} height={radius * 2} {...events}>
                <Circle x={radius} y={radius} radius={radius} fill={borderColor}/>
                <Circle x={radius} y={radius} radius={radius - 1} fill="white"/>
            </Group>
        );
    }
}
