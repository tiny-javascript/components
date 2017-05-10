import React from 'react';
import Shape from './shape';
import {createRect} from './util';
const status = {
    isDrag: false
}
let mouseOffset = {
    x: 0,
    y: 0
}
export default class Rect extends Shape {
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
            height: height
        }
    }
    _getTextWidth(text) {
        const node = document.getElementById('text');
        node.innerHTML = text;
        return node.offsetWidth;
    }
    _getActualWidth() {
        const {width} = this.props;
        const textWidth = this._getTextWidth(this.state.text);
        return textWidth > width && textWidth || width;
    }
    setText(name) {
        this.setState({text: name, width: this._getActualWidth()});
    }
    componentWillMount() {
        super.componentWillMount();
        this.state.text = this.props.text;
        this.state.width = this._getActualWidth();
    }
    render() {
        const {x, y, width, height, text} = this.state;
        const events = Object.assign({}, this.events.drag, this.events.click);
        const textAttributes = {
            x: (width + 20) / 2,
            y: height / 2 + 6
        }
        const path = createRect(width + 20, height, 4);
        return (
            <g className="node-item" transform={"translate(" + x + "," + y + ")"} filter="url(#drop-shadow)" {...events}>
                <path d={path}/>
                <text {...textAttributes}>{text}</text>
            </g>
        )
    }
}
