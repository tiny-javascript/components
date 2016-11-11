import React from 'react';
import {Line, Group} from 'react-konva';
import BasicPoint from './BasicPoint';
import mixin from 'decorators/mixin';
import DragMixin from '../mixins/DragMixin';
@mixin(DragMixin)
export default class ResizePoint extends BasicPoint {
    static defaultProps = {
        x: 0,
        y: 0,
        radius: 5,
        borderColor: 'red',
        visible: false
    }
    _onDragStart(e) {
        this.props.onResizeStart && this.props.onResizeStart(e);
    }
    _onDragMove(e) {
        e.position = this.props.cursor;
        this.props.onResize && this.props.onResize(e);
    }
    _onDragEnd(e) {
        this.props.onResizeEnd && this.props.onResizeEnd(e);
    }
    _onMouseEnter(e) {
        this.setCursor(this.props.cursor);
    }
    render() {
        const events = Object.assign({}, this._getHoverEvents(), this._getDragEvents());
        const {x, y, radius, borderColor} = this.state;
        const {draggable, visible} = this.state;
        const points = this._getRectBorderPoints(radius * 2, radius * 2);
        return (
            <Group draggable={draggable} visible={visible} x={x} y={y} {...events}>
                <Line points={points} stroke={borderColor} strokeWidth="1" fill="white" closed/>
            </Group>
        );
    }
}
