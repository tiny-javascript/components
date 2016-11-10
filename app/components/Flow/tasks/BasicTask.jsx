import React from 'react';
import {Line, Group} from 'react-konva';
import BasicElement from '../common/BasicElement';
import ResizePoint from '../points/ResizePoint';
import ConnectorPoint from '../points/ConnectorPoint';
import mixin from 'decorators/mixin';
import DragMixin from '../mixins/DragMixin';
import ClickMixin from '../mixins/ClickMixin';
import ResizeMixin from '../mixins/ResizeMixin';
@mixin(DragMixin, ClickMixin, ResizeMixin)
export default class BasicTask extends BasicElement {
    _getEvents() {
        let events = Object.assign({}, this._clickEvents);
        if (this.state.draggable) {
            events = Object.assign(events, this._dragEvents);
        }
        return events;
    }
    _refreshPoints() {
        const {width, height, pointRaduis} = this.state;
        const resizePoints = this._getResizePointPosition(width, height, pointRaduis);
        const connectorPoints = this._getConnectorPointPosition(width, height, pointRaduis);
        resizePoints.forEach((point, index) => {
            const ref = `rp${index}`;
            this.refs[ref].setAxis(point.x, point.y);
        });
        connectorPoints.forEach((point, index) => {
            const ref = `cp${index}`;
            this.refs[ref].setAxis(point.x, point.y);
        });
    }
    /**
     * 渲染基础层
     */
    _renderWrap() {
        const {width, height, pointRaduis} = this.state;
        const borderPoints = this._getRectBorderPoints(width, height);
        const resizePoints = this._getResizePointPosition(width, height, pointRaduis);
        const connectorPoints = this._getConnectorPointPosition(width, height, pointRaduis);
        const resizeEvents = this._resizeEvents;
        return (
            <Group width={width} height={height}>
                <Line x="0" y="0" points={borderPoints} stroke="red" strokeWidth="1" closed/>
                <Group></Group>
                {resizePoints.map((point, index) => {
                    point.ref = `rp${index}`;
                    return <ResizePoint key={index} radius={pointRaduis} {...point} {...resizeEvents}/>
                })}
                <Group></Group>
                {connectorPoints.map((point, index) => {
                    point.ref = `cp${index}`;
                    return <ConnectorPoint key={index} radius={pointRaduis} {...point}/>
                })}
            </Group>
        )
    }
    _cache(x, y, w, h) {
        this._cacheX = x;
        this._cacheY = y;
        this._cacheWidth = w;
        this._cacheHeight = h;
    }
    _onDragMove(e) {
        this.forceUpdate();
    }
    _onResizeStart() {
        const {x, y, width, height} = this.state;
        this._cache(x, y, width, height);
    }
    _onResize(e) {
        const {x, y, minArea, pointRaduis} = this.state;
        const cx = this._cacheX;
        const cy = this._cacheY;
        const width = this._cacheWidth;
        const height = this._cacheHeight;
        const rx = e.target.attrs.x;
        const ry = e.target.attrs.y;
        let nx = x,
            ny = y,
            nw = width,
            nh = height;
        switch (e.position) {
            case 'nw-resize': //左上
                // rx作为变量避免卡在极限上
                // 减去最小区域后需要加上point半径的偏移量
                nx = (x - cx + rx <= width - minArea - pointRaduis) && (x + rx + pointRaduis) || x;
                ny = (y - cy + ry <= height - minArea - pointRaduis) && (y + ry + pointRaduis) || y;
                nw = width + cx - nx;
                nh = height + cy - ny;
                break;
            case 'ne-resize': //右上
                // X轴不变，Y轴变化
                nx = x;
                ny = (y - cy + ry <= height - minArea - pointRaduis) && (y + ry + pointRaduis) || y;
                // X轴修复偏移量
                nw = (rx > minArea && rx || minArea - pointRaduis) + pointRaduis;
                nh = height + cy - ny;
                break;
            case 'sw-resize': //左下
                // Y轴不变，X轴变化
                nx = (x - cx + rx <= width - minArea - pointRaduis) && (x + rx + pointRaduis) || x;
                ny = y;
                nw = width + cx - nx;
                // Y轴修复偏移量
                nh = (ry > minArea && ry || minArea - pointRaduis) + pointRaduis;
                break;
            case 'se-resize': //右下
                // 坐标不变，宽度变化，并修复偏移量
                nx = x;
                ny = y;
                nw = (rx > minArea && rx || minArea) + pointRaduis;
                nh = (ry > minArea && ry || minArea) + pointRaduis;
                break;
        }
        this.setState({x: nx, y: ny, width: nw, height: nh});
        this._refreshPoints();
    }
    _onResizeEnd() {
        this._cache(0, 0, 0, 0);
    }
    setStatus(status) {
        this.setState({
            status,
            draggable: status != this.STATUS_RESIZE
        });
    }
    componentWillMount() {
        super.componentWillMount();
        this._clickEvents = this._getClickEvents();
        this._dragEvents = this._getDragEvents();
        this._resizeEvents = this._getResizeEvents();
        this.state.minArea = 30;
    }
}
