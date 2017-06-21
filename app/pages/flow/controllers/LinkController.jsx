import React from 'react';
import AbstractController from './AbstractController';
import Line from '../graphs/line';
export default class TaskController extends AbstractController {
    render() {
        let { attrs } = this.state.data;
        let className = this._getClassName();
        return <Line ref="shape" className={className} {...attrs} />;
    }
    componentWillMount() {
        let { data } = this.state;
        let { attrs } = data;
        attrs = {
            id: data.id,
            text: data.name,
            x1: attrs.x1 || 0,
            y1: attrs.y1 || 0,
            x2: attrs.x2 || 0,
            y2: attrs.y2 || 0
        }
        data.attrs = attrs;
    }
    setPoint(x, y, isBegin) {
        let { data } = this.state;
        if (isBegin) {
            data.attrs.x1 = x;
            data.attrs.y1 = y;
        } else {
            data.attrs.x2 = x;
            data.attrs.y2 = y;
        }
        this.setState({ data });
    }
}