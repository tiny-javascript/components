import React from 'react';
import {Line, Group} from 'react-konva';
import AbstractElement from './AbstractElement';
import ResizePoint from '../points/ResizePoint';
import ConnectorPoint from '../points/ConnectorPoint';
import mixin from 'decorators/mixin';
import DragMixin from '../mixins/DragMixin';
import ClickMixin from '../mixins/ClickMixin';
import ResizeMixin from '../mixins/ResizeMixin';
import HoverMixin from '../mixins/HoverMixin';
@mixin(DragMixin, ClickMixin, ResizeMixin, HoverMixin)
export default class BasicElement extends AbstractElement {
    /**
     * 开始变形时记录4个变形点的坐标
     */
    _onResizeStart() {
        const {x, y, width, height} = this.state;
        this._spins = this._getSpins(x, y, width, height);
    }
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
     * 获取矩形边框坐标
     */
    _getRectBorderPoints(width, height) {
        const xMax = width + 0.5;
        const yMax = height + 0.5;
        let points = [];
        // 左上角坐标
        points = points.concat([-0.5, -0.5]);
        // 右上角坐标
        points = points.concat([xMax, -0.5]);
        // 右下角坐标
        points = points.concat([xMax, yMax]);
        // 左下角坐标
        points = points.concat([-0.5, yMax]);
        return points;
    }
    /**
     * 获取连接点坐标
     */
    _getConnectorPointPosition(width, height, pointRaduis) {
        var borderWidth = 1;
        const top = {
            x: width / 2 - pointRaduis - borderWidth + 1,
            y: borderWidth / 2 - pointRaduis - 1
        };
        const right = {
            x: width - pointRaduis - borderWidth / 2 + 1,
            y: height / 2 - pointRaduis - borderWidth
        };
        const bottom = {
            x: width / 2 - pointRaduis - borderWidth + 1,
            y: height - pointRaduis - borderWidth / 2 + 1
        };
        const left = {
            x: borderWidth / 2 - pointRaduis - 1,
            y: height / 2 - pointRaduis - borderWidth
        };
        return [top, right, bottom, left];
    }
    /**
     * 获取变形点坐标
     */
    _getResizePointPosition(width, height, pointRaduis) {
        var borderWidth = 1;
        const topLeft = {
            x: borderWidth - pointRaduis - 1,
            y: borderWidth - pointRaduis - 1,
            cursor: 'nw-resize'
        };
        const topRight = {
            x: width - pointRaduis - borderWidth + 1,
            y: borderWidth - pointRaduis - 1,
            cursor: 'ne-resize'
        };
        const bottomLeft = {
            x: borderWidth - pointRaduis - 1,
            y: height - pointRaduis - borderWidth + 1,
            cursor: 'sw-resize'
        };
        const bottomRight = {
            x: width - pointRaduis - borderWidth + 1,
            y: height - pointRaduis - borderWidth + 1,
            cursor: 'se-resize'
        };
        return [topLeft, topRight, bottomRight, bottomLeft];
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
    _renderBackground() {
        const {width, height, pointRaduis} = this.state;
        const {borderVisible, resizePointVisible, connectorPointVisible} = this.state;
        const borderPoints = this._getRectBorderPoints(width, height);
        const resizePoints = this._getResizePointPosition(width, height, pointRaduis);
        const connectorPoints = this._getConnectorPointPosition(width, height, pointRaduis);
        const resizeEvents = this._resizeEvents;
        return (
            <Group width={width} height={height}>
                <Line visible={borderVisible} x="0" y="0" points={borderPoints} stroke="red" strokeWidth="1" closed></Line>
                {resizePoints.map((point, index) => {
                    point.ref = `rp${index}`;
                    return <ResizePoint visible={resizePointVisible} key={index} radius={pointRaduis} {...point} {...resizeEvents}/>
                })}
                {connectorPoints.map((point, index) => {
                    point.ref = `cp${index}`;
                    return <ConnectorPoint visible={connectorPointVisible} key={index} radius={pointRaduis} {...point}/>
                })}
            </Group>
        )
    }
    componentWillMount() {
        super.componentWillMount();
        this._clickEvents = this._getClickEvents();
        this._dragEvents = this._getDragEvents();
        this._resizeEvents = this._getResizeEvents();
        this._hoverEvents = this._getHoverEvents();
        // 设置初始状态
        this.state.status = this._STATUS_DEFAULT_;
        // 最小区域
        this.state.minArea = 30;
        // 边框可见
        this.state.borderVisible = false;
        // 变形点可见
        this.state.resizePointVisible = false;
        // 连接点可见
        this.state.connectorPointVisible = false;
        // point半径
        this.state.pointRaduis = 4;
        // 初始化状态池
        this._statusPool.push(this._STATUS_DEFAULT_);
    }
}
