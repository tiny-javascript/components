import React, { Component, PropTypes } from 'react'
class PolygonView extends Component {
    static propTypes = {
        points: PropTypes.string
    }
    static defaultProps = {
        points: ''
    }
    render() {
        return <polygon x="0" y="0" points={this.props.points} />
    }
}

export default PolygonView
