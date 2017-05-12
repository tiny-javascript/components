import React from 'react';
import {COLOR_FILL, COLOR_STROKE, STROKE_WIDTH} from '../constants';
const status = {
    move: false
}
const mouseOffset = {
    x: 0,
    y: 0
}
export default class Shape extends React.Component {
    state = {
        x: this.props.x,
        y: this.props.y,
        id: this.props.id,
        fill: COLOR_FILL,
        stroke: COLOR_STROKE,
        strokeWidth: STROKE_WIDTH,
        status: 'default'
    }
    events = {}
    _onClick(event) {
        this.setState({status: 'active'});
        this.props.onClick && this.props.onClick({event, id: this.state.id});
    }
    _onDoubleClick() {
        console.log('double click');
    }
    _onMouseUp() {
        status.move = false;
        this.props.onMoveOver && this.props.onMoveOver();
    }
    _onMouseDown(e) {
        const {x, y} = this.state;
        mouseOffset.x = e.clientX - x;
        mouseOffset.y = e.clientY - y;
        status.move = true;
        this.props.onMoveStart && this.props.onMoveStart();
    }
    _onMouseMove(e) {
        if (status.move) {
            const cx = e.clientX;
            const cy = e.clientY;
            this.setState({
                x: cx - mouseOffset.x,
                y: cy - mouseOffset.y,
                status: 'move'
            }, this.props.onMove);
        }
    }
    _onMouseOver() {
        if (this.state.status == 'default') {
            this.setState({status: 'hover'});
        }
    }
    _onMouseOut() {
        if (this.state.status == 'hover') {
            this.setState({status: 'default'});
        }
    }
    draw() {
        return null;
    }
    text() {
        return null;
    }
    blur() {
        this.setState({status: 'default'});
    }
    componentWillMount() {
        this.events = {
            mouse: {
                onMouseDown: this._onMouseDown.bind(this),
                onMouseMove: this._onMouseMove.bind(this),
                onMouseUp: this._onMouseUp.bind(this),
                onMouseOver: this._onMouseOver.bind(this),
                onMouseOut: this._onMouseOut.bind(this)
            },
            click: {
                onClick: this._onClick.bind(this),
                onDoubleClick: this._onDoubleClick.bind(this)
            }
        }
    }
    render() {
        const {x, y, status} = this.state;
        const events = Object.assign({}, this.events.click, this.events.mouse);
        return (
            <g className={"shape " + status} transform={"translate(" + x + "," + y + ")"} {...events}>
                {this.draw()}{this.text()}
            </g>
        )
    }
}
