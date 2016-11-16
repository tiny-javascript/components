import React from 'react';
import {Group, Arrow} from 'react-konva';
import AbstractElement from '../common/AbstractElement';
import {createLinePoints} from '../common/LineUtils';
import mixin from 'decorators/mixin';
import HoverMixin from '../mixins/HoverMixin';
import DragMixin from '../mixins/DragMixin';
@mixin(HoverMixin, DragMixin)
export default class BasicConnector extends AbstractElement {
    static contextTypes = {
        elements: React.PropTypes.any
    }
    _getArrowProps() {
        const {pointerLength, pointerWidth, borderWidth, borderColor, backgroundColor} = this.state;
        return {pointerLength, pointerWidth, fill: backgroundColor, stroke: borderColor, strokeWidth: borderWidth};
    }
    /**
     * 计算初始坐标
     */
    _calcLineAxis(key, position, shouldArray) {
        const element = this.context.elements.get(key);
        const {x, y, width, height} = element.props;
        const axis = {};
        switch (position) {
            case 'north':
                axis.x = x + width / 2;
                axis.y = y;
                break;
            case 'east':
                axis.x = x + width;
                axis.y = y + height / 2;
                break;
            case 'south':
                axis.x = x + width / 2;
                axis.y = y + height / 2;
                break;
            case 'west':
                axis.x = x;
                axis.y = y + height / 2;
                break;
        }
        return shouldArray && [axis.x, axis.y] || axis;
    }
    componentWillMount() {
        this._dragEvents = this._getDragEvents();
        this._hoverEvents = this._getHoverEvents();
        // 连接线宽度
        this.state.borderWidth = this.props.borderWidth;
        // 箭头长度
        this.state.pointerLength = this.props.pointerLength;
        // 箭头宽度
        this.state.pointerWidth = this.props.pointerWidth;
        // 源对象
        this.state.source = this.props.source;
        // 源对象point位置
        this.state.sourcePoint = this.props.sourcePoint;
        // 目标对象
        this.state.target = this.props.target;
        // 目标对象point位置
        this.state.targetPoint = this.props.targetPoint;
    }
    shouldComponentUpdate(state, props) {
        return this.state != state;
    }
    render() {
        const {elements} = this.context;
        const {source, sourcePoint, target, targetPoint} = this.state;
        const props = this._getArrowProps();
        // 开始坐标
        const startAxis = this._calcLineAxis(source, sourcePoint, true);
        // 结束坐标
        const endAxis = this._calcLineAxis(target, targetPoint, true);
        // 绘制坐标点
        const points = createLinePoints(startAxis, elements.get(source), sourcePoint)(endAxis, elements.get(target), targetPoint)();
        console.log(points);
        return <Arrow x="0" y="0" points={points} {...props}/>;
    }
}
