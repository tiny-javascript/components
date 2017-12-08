import React from 'react'
import Controller from './controller'
import RectView from '../views/rect_view'
import { getIconBySubtype } from '../logics/icon_logic'
import IconView from '../views/icon_view'
import { ELEMENT_STATUS_PROCESSS, ELEMENT_STATUS_PAUSE } from '../common/constants'
class ProcessController extends Controller {
    cls = 'element-process'
    animate() {
        let { status, attribute } = this.props.element
        if (!(status == ELEMENT_STATUS_PROCESSS || status == ELEMENT_STATUS_PAUSE)) {
            return null
        }
        let values = [0, attribute.width - 5, 0].join('; ')
        return (
            <rect className="animation" x="0" y="0" width="5" height={attribute.height}>
                <animate attributeType="XML" attributeName="x" dur="1.5s" values={values} repeatCount="indefinite" />
            </rect>
        )
    }
    render() {
        let { id, attribute, subType } = this.props.element
        let { x, y, width, height } = attribute
        let icon = getIconBySubtype(subType)
        return (
            <g id={id} className={this.getClassName()} transform={`translate(${x},${y})`}>
                <RectView width={width} height={height} />
                {this.animate()}
                <IconView icon={icon} x={15} y={20} />
                {this.renderText()}
                {this.renderConnectorPoint()}
            </g>
        )
    }
}

export default ProcessController
