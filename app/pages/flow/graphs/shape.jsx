import React from 'react';
export default class Shape extends React.Component {
    static defaultProps = {
        id: '',
        x: 0,
        y: 0,
        width: 100,
        height: 48,
        text: '',
        className: ''
    }
    events = {}
    _render() {
        return null;
    }
    _renderText() {
        const { text, width, height } = this.props;
        let x = width / 2;
        let y = (height + 12) / 2;
        return text && (
            <text x={x} y={y}>{text}</text>
        ) || null;
    }
    _renderType() {
        return null;
    }
    _renderOther() {
        return null;
    }
    render() {
        let { id, x, y, className, events } = this.props;
        className = 'shape ' + className;
        return (
            <g id={id} className={className} transform={"translate(" + x + "," + y + ")"} {...events}>
                {this._render()}{this._renderText()}{this._renderOther()}{this._renderType()}
            </g>
        )
    }
}
