import React from 'react'
import Controller from './controller'
import { calcConnectorPoints } from '../logics/point_logic'
import { createPolyline } from '../logics/line_logic'
import PolylineView from '../views/polyline_view'
class ConnectorController extends Controller {
    render() {
        let { id, attribute, status, prevs, nexts } = this.props.element
        let { x, y, width, height, text } = attribute
        let points = calcConnectorPoints(prevs, nexts, width, height, this.context.graph)
        let line = createPolyline(points)
        return (
            <g id={id} className={'element element-connector ' + status} transform={`translate(${x},${y})`}>
                <PolylineView points={line} />
                <text y="6">{text}</text>
            </g>
        )
    }
}

export default ConnectorController
