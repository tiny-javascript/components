import React, { Component, PropTypes } from 'react'
export default class RectView extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        radius: PropTypes.number
    }
    static defaultProps = {
        radius: 3
    }
    render() {
        let { width, height, radius } = this.props
        return <rect rx={radius} ry={radius} width={width} height={height} />
    }
}
