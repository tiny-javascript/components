import React from 'react';
import Shape from './shape';
import { createLinePath } from '../utils';
import { SHAPE_HEIGHT } from '../layout';
export default class Line extends Shape {
    static defaultProps = {
        id: '',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        text: ''
    }
    state = {
        id: this.props.id,
        x1: this.props.x1,
        y1: this.props.y1,
        x2: this.props.x2,
        y2: this.props.y2,
        text: this.props.text,
        status: 'default'
    }
    setBegin(x, y) {
        this.setState({ x1: x, y1: y });
    }
    setEnd(x, y) {
        this.setState({ x2: x, y2: y });
    }
    text() {
        let { text, x1, y1, x2, y2 } = this.state;
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
        let { id, x1, y1, x2, y2, status, fill } = this.state;
        let path = createLinePath(x1, y1, x2, y2);
        let events = this.events;
        let markerEnd = "url(#arrow)";
        if (status == 'hover') {
            markerEnd = "url(#arrowHover)";
        } else if (status == 'active') {
            markerEnd = "url(#arrowActive)";
        }
        return (
            <g id={id} className={"flow-shape condition " + status} {...events}>
                <path className="bg" d={path} />
                <path markerEnd={markerEnd} d={path} />
                {this.text()}
            </g>
        )
    }
}
