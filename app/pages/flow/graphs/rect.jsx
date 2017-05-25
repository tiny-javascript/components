import React from 'react';
import Shape from './shape';
export default class Rect extends Shape {
    _getTextWidth(text) {
        text = text || '';
        const node = document.getElementById('text');
        node.innerHTML = text;
        return node.offsetWidth;
    }
    _getActualWidth() {
        const { width } = this.state;
        const textWidth = this._getTextWidth(this.state.text);
        return textWidth > width && textWidth || width;
    }
    componentWillMount() {
        super.componentWillMount();
        this.state.text = this.props.text;
        this.state.borderRadius = 3;
        this.state.width = this._getActualWidth();
    }
    draw() {
        const { fill, stroke, strokeWidth, height, borderRadius } = this.state;
        const width = this._getActualWidth();
        return <rect x="0" y="0" rx={borderRadius} ry={borderRadius} width={width} height={height}></rect>
    }
}
