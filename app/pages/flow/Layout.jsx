import React from 'react';
import Rect from './graphs/rect';
import Circle from './graphs/circle';
import {SHAPE_CIRCLE, SHAPE_RECT, SHAPE_DIAMOND} from './constants';
export default class Layout extends React.Component {
    state = {
        shapes: this.props.data.shapes,
        lines: this.props.data.lines,
        active: ''
    }
    _createLine(line) {
        return null;
    }
    _createShape(shape) {
        let {id, type, attrs} = shape;
        let props = {
            id,
            key: id,
            ref: id,
            onClick: this._onShapeClick.bind(this)
        }
        const Node = this._shapeMap.get(type);
        return <Node {...props} {...attrs}/>;
    }
    _onLayoutClick(e) {
        if (this.state.active) {
            this.refs[this.state.active].blur();
        }
    }
    _onShapeClick(e) {
        e.event.stopPropagation();
        const {active} = this.state;
        if (active && active !== e.id) {
            this.refs[active].blur();
        }
        this.state.active = e.id;
    }
    addShape(shape) {
        const {shapes} = this.state;
        shapes.push(shape);
        this.setState({shapes});
    }
    addLine(line) {
        const {lines} = this.state;
        lines.push(line);
        this.setState({lines});
    }
    componentWillMount() {
        let shapeMap = new Map();
        shapeMap.set(SHAPE_CIRCLE, Circle);
        shapeMap.set(SHAPE_RECT, Rect);
        this._shapeMap = shapeMap;
    }
    render() {
        const {width, height} = this.props;
        const {shapes, lines} = this.state;
        return (
            <svg width={width} height={height} onClick={this._onLayoutClick.bind(this)}>
                <defs>
                    <filter id="drop-shadow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"></feGaussianBlur>
                        <feOffset in="blur" dx="0" dy="1" result="offsetBlur"></feOffset>
                        <feMerge>
                            <feMergeNode in="offsetBlur"></feMergeNode>
                            <feMergeNode in="SourceGraphic"></feMergeNode>
                        </feMerge>
                    </filter>
                </defs>
                <g id="lines">{lines.map(this._createLine.bind(this))}</g>
                <g id="shapes">{shapes.map(this._createShape.bind(this))}</g>
            </svg>
        )
    }
}
