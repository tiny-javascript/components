import React from 'react';
import AbstractController from './AbstractController';
import Circle from '../graphs/circle';
import { ELEMENT_TYPE_EVENT_START, ELEMENT_TYPE_EVENT_OVER, SHAPE_HEIGHT, LAYOUT_WIDTH, LAYOUT_HEIGHT } from '../constants';
export default class EventController extends AbstractController {
    _getClassName() {
        let { data, status } = this.state;
        return [data.type, data.subType, status].join(' ');
    }
    render() {
        let events = this._getEvents();
        let { attrs } = this.state.data;
        let className = this._getClassName();
        return <Circle ref="shape" className={className} events={events} {...attrs} />;
    }
    componentWillMount() {
        let { data } = this.state;
        let { attrs } = data;
        attrs = {
            id: data.id,
            y: attrs.y || (LAYOUT_HEIGHT - SHAPE_HEIGHT) / 2,
            r: attrs.r || SHAPE_HEIGHT / 2,
            width: attrs.width || SHAPE_HEIGHT,
            height: attrs.height || SHAPE_HEIGHT,
            text: attrs.text || data.name
        }
        if (data.subType == ELEMENT_TYPE_EVENT_START) {
            attrs.x = attrs.x || SHAPE_HEIGHT;
        }
        if (data.subType == ELEMENT_TYPE_EVENT_OVER) {
            attrs.x = attrs.x || LAYOUT_WIDTH - SHAPE_HEIGHT * 2;
        }
        data.attrs = attrs;
        data.points = this._getPoints();
    }
}