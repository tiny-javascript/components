import React from 'react';
import Shape from './shape';
export default class Circle extends Shape {
    _render() {
        let { r } = this.props;
        return <circle cx={r} cy={r} r={r} />
    }
}
