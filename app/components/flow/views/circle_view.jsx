import React, { Component, PropTypes } from 'react'
import { SHAPE_HEIGHT } from '../common/constants'
class CircleView extends Component {
    static propTypes = {
        x: PropTypes.number,
        y: PropTypes.number,
        radius: PropTypes.number,
        parameter: PropTypes.any,
        className: PropTypes.string
    }
    static defaultProps = {
        x: 0,
        y: 0,
        radius: SHAPE_HEIGHT / 2,
        className: ''
    }
    render() {
        let { x, y, radius, className, parameter } = this.props
        return <circle className={className} cx={x} cy={y} r={radius} data-axis={[x, y]} data-paramter={parameter} />
    }
}

export default CircleView
