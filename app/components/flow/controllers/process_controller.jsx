import React from 'react'
import Controller from './controller'
import RectView from '../views/rect_view'
class ProcessController extends Controller {
    render() {
        let { id, attribute, status } = this.props.element
        let { x, y, text, width, height } = attribute
        return (
            <g id={id} className={'element element-process ' + status} transform={`translate(${x},${y})`}>
                <RectView width={width} height={height} />
                <text y="6">{text}</text>
                {this.renderConnectorPoint()}
            </g>
        )
    }
}

export default ProcessController
