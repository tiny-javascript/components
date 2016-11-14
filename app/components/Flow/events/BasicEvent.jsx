import React from 'react';
import {Group, Circle} from 'react-konva';
import BasicElement from '../common/BasicElement';
export default class BasicEvent extends BasicElement {
    _onResize(e) {
        const {x, y, radius, minArea, pointRaduis} = this.state;
        const cx = this._cacheX;
        const cy = this._cacheY;
        const width = this._cacheWidth;
        const height = this._cacheHeight;
        const rx = e.target.attrs.x;
        const ry = e.target.attrs.y;
        const diff = rx > ry && rx || ry;
        let nx = x,
            ny = y,
            nw = width,
            nh = height,
            nr = radius;
        switch (e.position) {
            case 'nw-resize': //左上
                // rx作为变量避免卡在极限上
                // 减去最小区域后需要加上point半径的偏移量
                nx = (x - cx + diff <= width - minArea - pointRaduis) && (x + diff + pointRaduis) || x;
                ny = (y - cy + diff <= height - minArea - pointRaduis) && (y + diff + pointRaduis) || y;
                nw = radius + cx - nx;
                nh = height + cy - ny;
                break;
            case 'ne-resize': //右上
                nx = x;
                ny = (y - cy + ry <= height - minArea - pointRaduis) && (y + ry + pointRaduis) || y;
                
                nw = (rx > minArea && rx || minArea - pointRaduis) + pointRaduis;
                nh = height + cy - ny;
                console.log(nx, ny);
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
                nw = nh = (diff > minArea && diff || minArea) + pointRaduis;
                break;
        }
        nr = (nw > nh && nw || nh) / 2;
        nw = nh = nr * 2;
        this.setState({x: nx, y: ny, width: nw, height: nh, radius: nr});
        this._refreshPoints();
    }
    render() {
        const {radius, backgroundColor} = this.state;
        const events = Object.assign({}, this._clickEvents, this._dragEvents, this._hoverEvents);
        const containerProps = this._getContainerProps();
        return (
            <Group {...containerProps} {...events}>
                <Circle x={radius} y={radius} radius={radius} fill={backgroundColor}></Circle>
                {this._renderBackground()}
            </Group>
        )
    }
    componentWillMount() {
        super.componentWillMount();
        const {radius} = this.props;
        this.state.width = radius * 2;
        this.state.height = radius * 2;
        this.state.radius = this.props.radius;
    }
}
