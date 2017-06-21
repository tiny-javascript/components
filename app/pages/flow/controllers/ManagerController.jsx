import React from 'react';
import AbstractController from './AbstractController';
import Diamond from '../graphs/diamond';
import { SHAPE_WIDTH, SHAPE_HEIGHT } from '../constants';
import { getTextWidth } from '../utils';
export default class TaskController extends AbstractController {
    _getActualWidth(text) {
        if (!text) {
            return SHAPE_WIDTH;
        }
        let textWidth = getTextWidth(text) + 20;
        return textWidth > SHAPE_WIDTH && textWidth || SHAPE_WIDTH;
    }
    render() {
        let events = this._getEvents();
        let { attrs } = this.state.data;
        let className = this._getClassName();
        return <Diamond ref="shape" className={className} events={events} {...attrs} />;
    }
    componentWillMount() {
        let { data } = this.state;
        let { attrs } = data;
        attrs = {
            id: data.id,
            text: data.name,
            x: attrs.x || 10,
            y: attrs.y || 10,
            width: attrs.width || SHAPE_WIDTH,
            height: attrs.height || SHAPE_HEIGHT,
        }
        attrs.width = this._getActualWidth(attrs.text);
        data.attrs = attrs;
        data.points = this._getPoints();
    }
}