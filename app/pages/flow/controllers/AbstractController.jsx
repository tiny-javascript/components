import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { STATUS_DEFAULT, STATUS_ACTIVE, LAYOUT_STATUS_EDIT } from '../constants';
import { getLinkPoints } from '../utils';
const move = {
    id: '',
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
    _getPoints() {
        let { width, height } = this.state.data.attrs;
        return getLinkPoints(width, height);
    }
    _onMouseDown(e) {
        e.stopPropagation();
        let { id, attrs } = this.state.data;
        move.id = id;
        move.active = true;
        move.begin.x = e.clientX;
        move.begin.y = e.clientY;
        move.origin.x = attrs.x;
        move.origin.y = attrs.y;
        move.node = ReactDom.findDOMNode(this.refs.shape);
        // 将需要移动的节点放在最上层
        setTimeout(() => {
            document.getElementById('container').appendChild(move.node);
        }, 50);
    }
    _onMouseMove(e) {
        e.stopPropagation();
        if (!move.active) {
            return;
        }
        let { data } = this.state;
        if (move.id !== data.id) {
            return;
        }
        let x = move.origin.x + e.clientX - move.begin.x;
        let y = move.origin.y + e.clientY - move.begin.y;
        data.attrs.x = x;
        data.attrs.y = y;
        move.node.setAttribute('transform', "translate(" + x + "," + y + ")");
        this.props.onMove && this.props.onMove(move.id);
    }
    _onMouseUp(e) {
        e.stopPropagation();
        move.active = false;
    }
    render() {
        return 'this is abstract controller';
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
