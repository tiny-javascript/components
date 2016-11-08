import React from 'react';
import AbstractElement from './AbstractElement';
export default class BasicElement extends AbstractElement {
    /*默认状态*/
    STATUS_DEFAULT = 0
    /*活动状态*/
    STATUS_ACTIVE = 1
    /*移动状态*/
    STATUS_MOVE = 2
    /*变形状态*/
    STATUS_RESIZE = 3
    /*悬浮状态*/
    STATUS_HOVER = 4
    /*禁用状态*/
    STATUS_DISABLE = 5
    /**
     * 获取容器属性
     */
    _getContainerProps() {
        return {x: this.state.x, y: this.state.y, opacity: this.state.opacity};
    }
    /**
     * 获取矩形边框坐标
     */
    _getRectBorderPoints(width, height) {
        const xMax = width - 0.5;
        const yMax = height - 0.5;
        let points = [];
        // 左上角坐标
        points = points.concat([0.5, 0.5]);
        // 右上角坐标
        points = points.concat([xMax, 0.5]);
        // 右下角坐标
        points = points.concat([xMax, yMax]);
        // 左下角坐标
        points = points.concat([0.5, yMax]);
        return points;
    }
    /**
     * 获取连接点坐标
     */
    _getConnectorPointPosition(width, height, pointRaduis) {
        var borderWidth = 1;
        const top = {
            x: width / 2 - pointRaduis - borderWidth,
            y: borderWidth / 2 - pointRaduis
        };
        const right = {
            x: width - pointRaduis - borderWidth / 2,
            y: height / 2 - pointRaduis - borderWidth
        };
        const bottom = {
            x: width / 2 - pointRaduis - borderWidth,
            y: height - pointRaduis - borderWidth / 2
        };
        const left = {
            x: borderWidth / 2 - pointRaduis,
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
            x: borderWidth - pointRaduis,
            y: borderWidth - pointRaduis,
            cursor: 'nw-resize'
        };
        const topRight = {
            x: width - pointRaduis - borderWidth,
            y: borderWidth - pointRaduis,
            cursor: 'ne-resize'
        };
        const bottomLeft = {
            x: borderWidth - pointRaduis,
            y: height - pointRaduis - borderWidth,
            cursor: 'sw-resize'
        };
        const bottomRight = {
            x: width - pointRaduis - borderWidth,
            y: height - pointRaduis - borderWidth,
            cursor: 'se-resize'
        };
        return [topLeft, topRight, bottomRight, bottomLeft];
    }
    componentWillMount() {
        this.state.pointRaduis = 4;
    }
}
