import React from 'react'
import Controller from './controller'
import CircleView from '../views/circle_view'
class EventController extends Controller {
    cls = 'element-event'
    render() {
        let { id, attribute } = this.props.element
        let { x, y, width, height } = attribute
        return (
            <g id={id} className={this.getClassName()} transform={`translate(${x},${y})`}>
                <CircleView x={width / 2} y={height / 2} radius={width / 2} />
                {this.renderText()}
                {this.renderConnectorPoint()}
            </g>
        )
    }
}

export default EventController
