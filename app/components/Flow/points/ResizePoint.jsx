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
        borderColor: 'red'
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
    _getDragRange(cursor, parent) {
        const {minArea} = this.state;
        const limitX = parent.width - minArea;
        const limitY = parent.height - minArea;
        const area = {};
        switch (cursor) {
            case 'nw-resize': //左上
                area.x = [null, limitX];
                area.y = [null, limitY];
                break;
            case 'ne-resize': //右上
                area.x = [minArea, null];
                area.y = [null, limitY];
                break;
            case 'sw-resize': //左下
                area.x = [null, limitX];
                area.y = [minArea, null];
                break;
            case 'se-resize': //右下
                area.x = [minArea, null];
                area.y = [minArea, null];
                break;
        }
        return area;
    }
    render() {
        const events = Object.assign({}, this._getHoverEvents(), this._getDragEvents());
        const {x, y, radius, borderColor, draggable} = this.state;
        const points = this._getRectBorderPoints(radius * 2, radius * 2);
        return (
            <Group draggable={draggable} x={x} y={y} {...events}>
                <Line points={points} stroke={borderColor} strokeWidth="1" fill="white" closed/>
            </Group>
        );
    }
}
