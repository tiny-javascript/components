import React from 'react';
import {Group, RegularPolygon} from 'react-konva';
import BasicElement from '../common/BasicElement';
export default class BasicGateway extends BasicElement {
    _onResize(e) {
        const {x, y, width, height} = this._resize(e, this.state, this._spins, true);
        const radius = (width > height && width || height) / 2;
        this.setState({
            x,
            y,
            radius,
            width: radius * 2,
            height: radius * 2
        });
        this._refreshPoints();
    }
    _renderIcon() {
        return null;
    }
    render() {
        const {radius, backgroundColor} = this.state;
        const events = Object.assign({}, this._clickEvents, this._dragEvents, this._hoverEvents);
        const containerProps = this._getContainerProps();
        return (
            <Group {...containerProps} {...events}>
                <RegularPolygon x={radius} y={radius} sides={4} radius={radius} stroke="#000" strokeWidth="3" fill='#ffb352'></RegularPolygon>
                {this._renderIcon()}
                {this._renderBackground()}
            </Group>
        )
    }
    componentWillMount() {
        super.componentWillMount();
        const {radius} = this.props;
        this.state.width = radius * 2;
        this.state.height = radius * 2;
        this.state.radius = this.props.radius;
        this.state.padding = this.props.padding;
        this.state.iconLineWidth = this.props.iconLineWidth;
    }
}
