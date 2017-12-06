import React from 'react'
import Controller from './controller'
import RectView from '../views/rect_view'
import { getIconBySubtype } from '../logics/icon_logic'
import IconView from '../views/icon_view'
class ProcessController extends Controller {
    cls = 'element-process'
    render() {
        let { id, attribute, subType } = this.props.element
        let { x, y, width, height } = attribute
        let icon = getIconBySubtype(subType)
        return (
            <g id={id} className={this.getClassName()} transform={`translate(${x},${y})`}>
                <RectView width={width} height={height} />
                <IconView icon={icon} x={15} y={20} />
                {this.renderText()}
                {this.renderConnectorPoint()}
            </g>
        )
    }
}

export default ProcessController
