import React from 'react';
import {Group, Circle} from 'react-konva';
import BasicElement from '../common/BasicElement';
export default class BasicEvent extends BasicElement {
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
    render() {
        const {radius, backgroundColor} = this.state;
        const events = Object.assign({}, this._clickEvents, this._dragEvents, this._hoverEvents);
        const containerProps = this._getContainerProps();
        return (
            <Group {...containerProps} {...events}>
                <Circle x={radius} y={radius} radius={radius} fill={backgroundColor}></Circle>
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
    }
}
