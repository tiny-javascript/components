import React, { Component, PropTypes } from 'react'
class PolylineView extends Component {
    static propTypes = {
        points: PropTypes.string
    }
    static defaultProps = {
        points: ''
    }
    render() {
        return <polyline points={this.props.points} />
    }
}

export default PolylineView
