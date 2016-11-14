import React from 'react';
import BasicElement from '../common/BasicElement';
export default class BasicTask extends BasicElement {
    /**
     * 变形中
     */
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
}
