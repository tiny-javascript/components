import React from 'react';
import {Line, Group} from 'react-konva';
import BasicElement from '../common/BasicElement';
import ResizePoint from '../points/ResizePoint';
import ConnectorPoint from '../points/ConnectorPoint';
import mixin from 'decorators/mixin';
import DragMixin from '../mixins/DragMixin';
import ClickMixin from '../mixins/ClickMixin';
import ResizeMixin from '../mixins/ResizeMixin';
import HoverMixin from '../mixins/HoverMixin';
@mixin(DragMixin, ClickMixin, ResizeMixin, HoverMixin)
export default class BasicTask extends BasicElement {
    /**
     * 重写设置状态
     */
    _handleStatus(status) {
        // 处理透明度
        this.state.opacity = status != this._STATUS_MOVE_ && 1 || 0.5;
        // 处理边框显示
        this.state.borderVisible = status != this._STATUS_DEFAULT_;
        // 处理point显示
        if (status == this._STATUS_DEFAULT_) {
            this._setPointsVisible(false);
        } else {
            this._setPointsVisible(true);
        }
    }
    /**
     * 设置point透明度
     */
    _setPointsVisible(visible, point) {
        for (var ref in this.refs) {
            if (this.refs.hasOwnProperty(ref)) {
                if (point) {
                    if (ref.indexOf(point) !== -1) {
                        this.refs[ref].setVisible(visible);
                    }
                } else {
                    if (ref.indexOf('rp') !== -1 || ref.indexOf('cp') !== -1) {
                        this.refs[ref].setVisible(visible);
                    }
                }
            }
        }
    }
    /**
     * 刷新所有的point
     */
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
        const {borderVisible, resizePointVisible, connectorPointVisible} = this.state;
        const borderPoints = this._getRectBorderPoints(width, height);
        const resizePoints = this._getResizePointPosition(width, height, pointRaduis);
        const connectorPoints = this._getConnectorPointPosition(width, height, pointRaduis);
        const resizeEvents = this._resizeEvents;
        return (
            <Group width={width} height={height}>
                <Line visible={borderVisible} x="0" y="0" points={borderPoints} stroke="red" strokeWidth="1" closed/>
                <Group></Group>
                {resizePoints.map((point, index) => {
                    point.ref = `rp${index}`;
                    return <ResizePoint visible={resizePointVisible} key={index} radius={pointRaduis} {...point} {...resizeEvents}/>
                })}
                <Group></Group>
                {connectorPoints.map((point, index) => {
                    point.ref = `cp${index}`;
                    return <ConnectorPoint visible={connectorPointVisible} key={index} radius={pointRaduis} {...point}/>
                })}
            </Group>
        )
    }
    /**
     * 变形开始
     */
    _onResizeStart() {
        this.state.draggable = false;
    }
    /**
     * 变形结束
     */
    _onResizeEnd() {
        this.state.draggable = true;
    }
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
    componentWillMount() {
        super.componentWillMount();
        this._clickEvents = this._getClickEvents();
        this._dragEvents = this._getDragEvents();
        this._resizeEvents = this._getResizeEvents();
        this._hoverEvents = this._getHoverEvents();
        // 最小区域
        this.state.minArea = 30;
        // 边框可见
        this.state.borderVisible = false;
        // 变形点可见
        this.state.resizePointVisible = false;
        // 连接点可见
        this.state.connectorPointVisible = false;
        // 初始化状态池
        this._statusPool.push(this._STATUS_DEFAULT_);
    }
}
