import React, { Component, PropTypes } from 'react'
import { POINT_RADIUS } from '../common/constants'
import { calcLinkPoints } from '../logics/point_logic'
import ElementModel from '../models/element_model'
import CircleView from '../views/circle_view'

class Controller extends Component {
    static propTypes = {
        element: PropTypes.object
    }
    static contextTypes = {
        graph: PropTypes.object
    }
    static defaultProps = {
        element: new ElementModel()
    }
    renderConnectorPoint() {
        return this.props.element.connectorPoints.map((point, index) => {
            let [x, y] = point.axis
            return <CircleView className="point" key={index} x={x} y={y} radius={POINT_RADIUS} parameter={point.position} />
        })
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props != nextProps
    }
}

export default Controller
