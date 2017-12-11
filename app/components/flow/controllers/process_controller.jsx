import React from 'react'
import Controller from './controller'
import RectView from '../views/rect_view'
import { getIconBySubtype, getIconByButtonType, getButttonIconAxis } from '../logics/icon_logic'
import IconView from '../views/icon_view'
import { ELEMENT_STATUS_PROCESSS, ELEMENT_STATUS_PAUSE, BUTTON_LAYER_WIDTH, FONT_SIZE, RECT_RADIUS } from '../common/constants'
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
    renderButtons() {
        let { buttons, attribute } = this.props.element
        if (!buttons.length) {
            return null
        }
        let x = attribute.width - BUTTON_LAYER_WIDTH
        return (
            <g className="button-layer" transform={`translate(${x},0)`}>
                <rect width={BUTTON_LAYER_WIDTH} height={attribute.height} rx={RECT_RADIUS} ry={RECT_RADIUS} />
                {buttons.map((btn, index) => {
                    let icon = getIconByButtonType(btn.type)
                    let { x, y } = getButttonIconAxis(FONT_SIZE, attribute.height, index + 1, buttons.length)
                    return <IconView key={index} className="button-icon" x={x} y={y} icon={icon} title={btn.title} onClick={btn.fn} />
                })}
            </g>
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
                {this.renderButtons()}
                {this.renderConnectorPoint()}
            </g>
        )
    }
}

export default ProcessController
