import React from 'react';
import Shape from './shape';
export default class Circle extends Shape {
    componentWillMount() {
        super.componentWillMount();
        this.state.r = this.props.r;
        this.state.text = this.props.text;
    }
    _render() {
        const { r, fill, stroke, strokeWidth } = this.state;
        return <circle cx={r} cy={r} r={r} />
    }
}
