import React from 'react';
import {Line, Group} from 'react-konva';
export default class AbstractElement extends React.Component {
    state = {
        x: this.props.x,
        y: this.props.y,
        width: this.props.width,
        height: this.props.height,
        status: this.STATUS_DEFAULT,
        draggable: true,
        borderColor: this.props.borderColor,
        backgroundColor: this.props.backgroundColor
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
        // 回到初始地点闭环
        points = points.concat([0.5, 0.5]);
        return points;
    }
    /**
     * 设置状态
     */
    setStatus(status) {
        this.setState({status});
    }
    /**
     * 设置坐标
     */
    setAxis(x, y, callback) {
        this.setState({
            x,
            y
        }, callback);
    }
    setCursor(cursor = 'default') {
        document.body.style.cursor = cursor;
    }
    render() {
        return null;
    }
}
