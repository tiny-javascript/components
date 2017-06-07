import React from 'react';
export default class Shape extends React.Component {
    static defaultProps = {
        x: 0,
        y: 0,
        id: '',
        width: 100,
        height: 48,
        text: ''
    }
    state = {
        x: this.props.x,
        y: this.props.y,
        id: this.props.id,
        width: this.props.width,
        height: this.props.height,
        text: this.props.text,
        fill: '',
        status: 'default'
    }
    events = {}
    _onClick(e) {
        e.stopPropagation();
        this.setState({ status: 'active' });
        this.props.onClick && this.props.onClick(this.state.id);
    }
    _onMouseOver() {
        if (this.state.status == 'default') {
            this.setState({ status: 'hover' });
        }
    }
    _onMouseOut() {
        if (this.state.status == 'hover') {
            this.setState({ status: 'default' });
        }
    }
    _render() {
        return null;
    }
    _renderText() {
        const { text, width, height } = this.state;
        let x = width / 2;
        let y = (height + 12) / 2;
        return text && (
            <text x={x} y={y}>{text}</text>
        ) || null;
    }
    _renderOther() {
        return null;
    }
    render() {
        let events = this.events;
        let { id, x, y, status } = this.state;
        return (
            <g id={id} className={"flow-shape task " + status} transform={"translate(" + x + "," + y + ")"} {...events}>
                {this._render()}{this._renderText()}{this._renderOther()}
            </g>
        )
    }
    componentWillMount() {
        this.events = {
            onClick: this._onClick.bind(this),
            onMouseOut: this._onMouseOut.bind(this),
            onMouseOver: this._onMouseOver.bind(this)
        }
    }
    blur() {
        this.setState({ status: 'default' });
    }
    setAxis(x, y) {
        this.setState({ x, y });
    }
    setText(text) {
        this.setState({ text });
    }
    setBackground(color) {
        this.setState({ fill: color });
    }
}
