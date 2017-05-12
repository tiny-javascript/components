import React from 'react';
import Shape from './shape';
import {SHAPE_WIDTH, SHAPE_HEIGHT, RECT_BORDER_RADIUS} from '../constants';
export default class Rect extends Shape {
    _getTextWidth(text) {
        text = text || '';
        const node = document.getElementById('text');
        node.innerHTML = text;
        return node.offsetWidth;
    }
    _getActualWidth() {
        const textWidth = this._getTextWidth(this.state.text);
        return textWidth > SHAPE_WIDTH && textWidth || SHAPE_WIDTH;
    }
    componentWillMount() {
        super.componentWillMount();
        this.state.text = this.props.text;
        this.state.width = this._getActualWidth();
    }
    draw() {
        const {fill, stroke, strokeWidth} = this.state;
        const width = this._getActualWidth();
        return <rect x="0" y="0" rx={RECT_BORDER_RADIUS} ry={RECT_BORDER_RADIUS} width={width} height={SHAPE_HEIGHT} fill={fill} stroke={stroke} strokeWidth={strokeWidth}></rect>
    }
}
