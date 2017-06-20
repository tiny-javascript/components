import React, { Component } from 'react';
import { STATUS_DEFAULT, STATUS_ACTIVE, LAYOUT_STATUS_EDIT } from '../constants';
const move = {
    origin: { x: 0, y: 0 },
    begin: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    active: false
}
export default class AbstractController extends Component {
    state = {
        data: this.props.data,
        status: STATUS_DEFAULT
    }
    _initAttrs() { }
    _getClassName() {
        let { data, status } = this.state;
        return [data.type, status].join(' ');
    }
    _getEvents() {
        if (this.props.layoutStatus != LAYOUT_STATUS_EDIT) {
            return {};
        }
        return {
            onMouseUp: this._onMouseUp.bind(this),
            onMouseDown: this._onMouseDown.bind(this),
            onMouseMove: this._onMouseMove.bind(this)
        }
    }
    _onMouseDown(e) {
        e.stopPropagation();
        let { attrs } = this.state.data;
        move.begin.x = e.clientX;
        move.begin.y = e.clientY;
        move.origin.x = attrs.x;
        move.origin.y = attrs.y;
        move.active = true;
    }
    _onMouseMove(e) {
        e.stopPropagation();
        if (!move.active) {
            return;
        }
        let { data } = this.state;
        data.attrs.x = move.origin.x + e.clientX - move.begin.x;
        data.attrs.y = move.origin.y + e.clientY - move.begin.y;
        this.setState({ data });
    }
    _onMouseUp(e) {
        e.stopPropagation();
        move.active = false;
    }
    render() {
        return 'this is abstract controller';
    }
    componentWillMount() {
        this._initAttrs();
        this.events = {

        }
    }
    componentWillReceiveProps(props) {
        this.state.status = props.active && STATUS_ACTIVE || STATUS_DEFAULT;
    }
    shouldComponentUpdate(props, state) {
        if (this.state != state) {
            return true;
        }
        if (this.props.active != props.active) {
            return true;
        }
        if (this.props.layoutStatus != props.layoutStatus) {
            return true;
        }
        return false;
    }
}
