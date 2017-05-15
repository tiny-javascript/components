import React from 'react';
import {COLOR_FILL, COLOR_STROKE, STROKE_WIDTH} from '../constants';
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
    setAxis(x, y) {
        this.setState({x, y});
    }
    componentWillMount() {
        this.events = {
            onMouseOver: this._onMouseOver.bind(this),
            onMouseOut: this._onMouseOut.bind(this),
            onClick: this._onClick.bind(this),
            onDoubleClick: this._onDoubleClick.bind(this)
        }
    }
    render() {
        const {id, x, y, status} = this.state;
        const events = this.events;
        return (
            <g id={id} className={"shape " + status} transform={"translate(" + x + "," + y + ")"} {...events}>
                {this.draw()}{this.text()}
            </g>
        )
    }
}
