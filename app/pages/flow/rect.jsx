import React from 'react';
export default class Rect extends React.Component {
    static defaultProps = {
        x: 100,
        y: 100,
        width: 90,
        height: 60,
        text: ''
    }
    _getRectAttributes(width, height) {
        return {
            x: 0,
            y: 0,
            rx: 3,
            ry: 3,
            width: width,
            height: height,
            fill: '#fff',
            stroke: '#000',
            strokeWidth: 1
        }
    }
    componentWillMount() {
        this._textNode = document.getElementById('text');
    }
    render() {
        const {x, y, width, height, text} = this.props;
        this._textNode.innerHTML = text;
        const realWidth = (this._textNode.offsetWidth > width && this._textNode.offsetWidth || width) + 20;
        const rectAttributes = this._getRectAttributes(realWidth, height);
        const textAttributes = {
            x: realWidth / 2,
            y: height / 2 + 6
        }
        return (
            <g transform={"translate(" + x + "," + y + ")"}>
                <rect {...rectAttributes}></rect>
                <text {...textAttributes}>{text}</text>
            </g>
        )
    }
}
