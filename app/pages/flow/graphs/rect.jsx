import React from 'react';
import Shape from './shape';
export default class Rect extends Shape {
    _render() {
        let { width, height, borderRadius } = this.props;
        return <rect x="0" y="0" rx={borderRadius} ry={borderRadius} width={width} height={height}></rect>
    }
}
