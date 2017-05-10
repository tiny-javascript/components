import React from 'react';
const status = {
    isDrag: false
}
const mouseOffset = {
    x: 0,
    y: 0
}
export default class Shape extends React.Component {
    state = {
        x: this.props.x,
        y: this.props.y,
        width: this.props.width,
        height: this.props.height
    }
    events = {}
    _onStartDrag(e) {
        const {x, y} = this.state;
        mouseOffset.x = e.clientX - x;
        mouseOffset.y = e.clientY - y;
        status.isDrag = true;
        this.props.onBeforeDrag && this.props.onBeforeDrag();
    }
    _onDrag(e) {
        if (status.isDrag) {
            const cx = e.clientX;
            const cy = e.clientY;
            this.setState({
                x: cx - mouseOffset.x,
                y: cy - mouseOffset.y
            }, this.props.onDrag);
        }
    }
    _onEndDrag() {
        status.isDrag = false;
        this.props.onAfterDrag && this.props.onAfterDrag();
    }
    _onSelect() {
        this.props.onSelect && this.props.onSelect(this.props.data);
    }
    componentWillMount() {
        this.events.drag = {
            onMouseDown: this._onStartDrag.bind(this),
            onMouseMove: this._onDrag.bind(this),
            onMouseUp: this._onEndDrag.bind(this)
        }
        this.events.click = {
            onClick: this._onSelect.bind(this)
        }
    }
}
