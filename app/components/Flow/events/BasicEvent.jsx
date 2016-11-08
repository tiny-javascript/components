import React from 'react';
import BasicElement from '../common/BasicElement';
export default BasicEvent extends BasicElement {
    render() {
        const {x, y} = this.state;
        const {radius} = this.props;
        const events = Object.assign({}, this._getDragEvents());
        return (
            <Group stroke="#000" strokeWidth="2" x={x} y={y} width={radius * 2} height={radius * 2} draggable={true} {...events}>
                <Circle x={radius} y={radius} radius={radius} fill="#66c484"/>
            </Group>
        )
    }
}
