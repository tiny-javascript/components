import React from 'react';
import Shape from './shape';
import { createLinePath } from '../utils';
export default class Line extends Shape {
    state = {
        id: this.props.id,
        x1: this.props.x1,
        y1: this.props.y1,
        x2: this.props.x2,
        y2: this.props.y2,
        status: 'default'
    }
    setBegin(x, y) {
        this.setState({ x1: x, y1: y });
    }
    setEnd(x, y) {
        this.setState({ x2: x, y2: y });
    }
    render() {
        let { id, x1, y1, x2, y2, status } = this.state;
        let path = createLinePath(x1, y1, x2, y2);
        let events = this.events;
        let markerEnd = "url(#arrow)";
        if (status == 'hover') {
            markerEnd = "url(#arrowHover)";
        } else if (status == 'active') {
            markerEnd = "url(#arrowActive)";
        }
        return (
            <g id={id} className={"shape line " + status} {...events}>
                <path className="bg" d={path} />
                <path markerEnd={markerEnd} d={path} />
            </g>
        )
    }
}
