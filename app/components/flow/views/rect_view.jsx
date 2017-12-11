import React, { Component, PropTypes } from 'react'
import { RECT_RADIUS } from '../common/constants'
export default class RectView extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        radius: PropTypes.number
    }
    static defaultProps = {
        radius: RECT_RADIUS
    }
    render() {
        let { width, height, radius } = this.props
        return <rect rx={radius} ry={radius} width={width} height={height} />
    }
}
