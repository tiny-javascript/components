import React from 'react';
import Shape from './shape';
export default class Diamond extends Shape {
    _getPoints() {
        let { width, height } = this.props;
        let points = [
            [width / 2, 0],
            [width, height / 2],
            [width / 2, height],
            [0, height / 2]
        ]
        return points.map(item => item.join(',')).join(' ');
    }
    _render() {
        let points = this._getPoints();
        return <polygon x="0" y="0" points={points} />
    }
}
