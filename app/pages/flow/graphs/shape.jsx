import React from 'react';
export default class Shape extends React.Component {
    static defaultProps = {
        x: 0,
        y: 0,
        id: '',
        width: 100,
        height: 48
    }
    state = {
        x: this.props.x,
        y: this.props.y,
        id: this.props.id,
        width: this.props.width,
        height: this.props.height,
        status: 'default'
    }
    events = {}
    _onClick(event) {
        this.setState({ status: 'active' });
        this.props.onClick && this.props.onClick({ event, id: this.state.id });
    }
    _onDoubleClick() {
        console.log('double click');
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
    draw() {
        return null;
    }
    text() {
        return null;
    }
    blur() {
        this.setState({ status: 'default' });
    }
    setAxis(x, y) {
        this.setState({ x, y });
    }
    componentWillMount() {
        this.events = {
            onClick: this._onClick.bind(this),
            onMouseOut: this._onMouseOut.bind(this),
            onMouseOver: this._onMouseOver.bind(this),
            onDoubleClick: this._onDoubleClick.bind(this)
        }
    }
    render() {
        let events = this.events;
        let { id, x, y, status } = this.state;
        return (
            <g id={id} className={"shape task " + status} transform={"translate(" + x + "," + y + ")"} {...events}>
                {this.draw()}{this.text()}
            </g>
        )
    }
}
