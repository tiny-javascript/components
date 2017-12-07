import React from 'react'
import Controller from './controller'
import { calcConnectorPoints, clacTextAxis } from '../logics/point_logic'
import { createPolyline } from '../logics/line_logic'
import PolylineView from '../views/polyline_view'
import { FONT_SIZE } from '../common/constants'
import TextView from '../views/text_view'
class ConnectorController extends Controller {
    cls = 'element-connector'
    render() {
        let { id, attribute, prevs, nexts, status } = this.props.element
        let { x, y, width, height, text } = attribute
        let points = calcConnectorPoints(prevs, nexts, width, height, this.context.graph)
        let line = createPolyline(points)
        let textAxis = clacTextAxis(points)
        status = status || 'default'
        return (
            <g id={id} className={this.getClassName()} transform={`translate(${x},${y})`}>
                <PolylineView className="bg" points={line} />
                <PolylineView className="line" points={line} markerEnd={`url(#triangle-${status})`} />
                <TextView x={textAxis.x} y={textAxis.y} text={text} />
            </g>
        )
    }
}

export default ConnectorController
