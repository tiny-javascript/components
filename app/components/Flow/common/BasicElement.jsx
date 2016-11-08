import React from 'react';
import mixin from 'decorators/mixin';
import DragMixin from '../mixins/DragMixin';
@mixin(DragMixin)
export default class Component extends React.Component {
    /*默认状态*/
    STATUS_DEFAULT = 0
    /*活动状态*/
    STATUS_ACTIVE = 1
    /*移动状态*/
    STATUS_MOVE = 2
    /*悬浮状态*/
    STATUS_HOVER = 4
    /*禁用状态*/
    STATUS_DISABLE = 5
    state = {
        axis: {
            x: this.props.x,
            y: this.props.y
        },
        width: this.props.width,
        height: this.props.height,
        status: this.STATUS_DEFAULT,
        background: this.props.background
    }
    /**
     * 获取容器属性
     */
    _getContainerProps() {
        return {x: this.state.axis.x, y: this.state.axis.y, opacity: this.state.opacity};
    }
    setAxis(x, y, callback) {
        this.setState({
            axis: {
                x,
                y
            }
        }, callback);
    }
    render() {
        return null;
    }
}
