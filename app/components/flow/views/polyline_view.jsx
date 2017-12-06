import React, { Component, PropTypes } from 'react'
class PolylineView extends Component {
    static propTypes = {
        points: PropTypes.string,
        markerEnd: PropTypes.string,
        className: PropTypes.string
    }
    static defaultProps = {
        points: ''
    }
    render() {
        let { points, markerEnd, className } = this.props
        return <polyline className={className} points={points} markerEnd={markerEnd} />
    }
}

export default PolylineView
