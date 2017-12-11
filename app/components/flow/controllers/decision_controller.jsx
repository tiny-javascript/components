import React from 'react'
import Controller from './controller'
import PolygonView from '../views/polygon_view'
import { calcDiamondPoints } from '../logics/point_logic'
class DecisionController extends Controller {
    points = []
    cls = 'element-decision'
    render() {
        let { id, attribute } = this.props.element
        let { x, y } = attribute
        return (
            <g id={id} className={this.getClassName()} transform={`translate(${x},${y})`}>
                <PolygonView points={this.points} />
                {this.renderText()}
                {this.renderConnectorPoint()}
            </g>
        )
    }
    componentWillMount() {
        this.points = calcDiamondPoints(this.props.element.attribute)
    }
    componentWillUpdate(nextProps, nextState) {
        this.points = calcDiamondPoints(nextProps.element.attribute)
    }
    
}

export default DecisionController
