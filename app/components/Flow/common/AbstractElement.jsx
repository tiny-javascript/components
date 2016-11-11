import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Line, Group} from 'react-konva';
import EventContainer from './EventContainer';
export default class AbstractElement extends React.Component {
    /*默认状态*/
    _STATUS_DEFAULT_ = '_STATUS_DEFAULT_'
    /*活动状态*/
    _STATUS_ACTIVE_ = '_STATUS_ACTIVE_'
    /*移动状态*/
    _STATUS_MOVE_ = '_STATUS_MOVE_'
    /*变形状态*/
    _STATUS_RESIZE_ = '_STATUS_RESIZE_'
    /*悬浮状态*/
    _STATUS_HOVER_ = '_STATUS_HOVER_'
    /*禁用状态*/
    _STATUS_DISABLE_ = '_STATUS_DISABLE_'
    /*链接状态*/
    _STATUS_CONNECT_ = '_STATUS_CONNECT_'
    // 状态池
    _statusPool = []
    /*状态*/
    state = {
        x: this.props.x,
        y: this.props.y,
        width: this.props.width,
        height: this.props.height,
        status: this._STATUS_DEFAULT_,
        draggable: true,
        opacity: 1,
        borderColor: this.props.borderColor,
        backgroundColor: this.props.backgroundColor
    }
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
     * 缓存状态
     */
    _cacheStatus(status) {
        if (this._statusPool.length >= 10) {
            this._statusPool.shift();
        }
        this._statusPool.push(status);
    }
    /**
     * 处理状态
     * @desc 需要被重写
     */
    _handleStatus() {}
    _onBlur() {
        this.setStatus(this._STATUS_DEFAULT_);
    }
    /**
     * 设置状态
     */
    setStatus(status) {
        this._handleStatus(status);
        this._cacheStatus(status);
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
    componentWillMount() {
        EventContainer.addEventListener('element.blur', this, '_onBlur');
    }
    render() {
        return null;
    }
    componentWillUnmount() {
        EventContainer.removeEventListener('element.blur', this);
    }
}
