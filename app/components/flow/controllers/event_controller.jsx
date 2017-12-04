import React from 'react'
import Controller from './controller'
import CircleView from '../views/circle_view'
class EventController extends Controller {
    render() {
        let { id, attribute, status } = this.props.element
        let { x, y, width, height, text } = attribute
        return (
            <g id={id} className={'element element-event ' + status} transform={`translate(${x},${y})`}>
                <CircleView x={width / 2} y={height / 2} radius={width / 2} />
                <text y="6">{text}</text>
                {this.renderConnectorPoint()}
            </g>
        )
    }
}

export default EventController
