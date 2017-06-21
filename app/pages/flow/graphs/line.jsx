import React from 'react';
import Shape from './shape';
import { createLinePath } from '../utils';
import { SHAPE_HEIGHT, SHAPE_LINE } from '../constants';
export default class Line extends Shape {
    static defaultProps = {
        id: '',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        text: '',
        className: ''
    }
    text() {
        let { text, x1, y1, x2, y2 } = this.props;
        let px = x2 - x1 > 0 && 1 || -1;
        let py = y2 - y1 > 0 && 1 || -1;
        let w = Math.abs(x2 - x1);
        let h = Math.abs(y2 - y1);
        let x = x1 + (w / 2) * px;
        let y = y1 + (h + 12) / 2 * py;
        if (x1 > x2) {
            if (y1 >= y2 && y1 - y2 < SHAPE_HEIGHT + 50) {
                y = y2 - SHAPE_HEIGHT - 6;
            }
            if (y1 < y2 && y2 - y1 < SHAPE_HEIGHT + 50) {
                y = y2 + SHAPE_HEIGHT;
            }
        }
        return text && (
            <text x={x} y={y}>{text}</text>
        ) || null;
    }
    render() {
        let { id, x1, y1, x2, y2, className } = this.props;
        let path = createLinePath(x1, y1, x2, y2, true);
        return (
            <g id={id} className={className}>
                <path className="bg" d={path} />
                <path d={path} />
                {this.text()}
            </g>
        )
    }
}
