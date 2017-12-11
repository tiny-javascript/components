import React, { Component, PropTypes } from 'react'
import { POINT_RADIUS, FONT_SIZE, MAX_FONT_SIZE, GRAPH_STATUS_READONLY } from '../common/constants'
import { calcLinkPoints } from '../logics/point_logic'
import ElementModel from '../models/element_model'
import CircleView from '../views/circle_view'
import TextView, { TextGroupView } from '../views/text_view'
import { cutText } from '../logics/element_logic'

class Controller extends Component {
    static propTypes = {
        element: PropTypes.object,
        active: PropTypes.bool
    }
    static contextTypes = {
        graph: PropTypes.object
    }
    static defaultProps = {
        element: new ElementModel(),
        active: false
    }
    cls = ''
    getClassName() {
        let cls = ['element', this.cls]
        if (this.props.active) {
            cls.push('active')
        }
        if (this.props.element.status) {
            cls.push(this.props.element.status)
        }
        return cls.join(' ')
    }
    renderConnectorPoint() {
        if (this.context.graph.status == GRAPH_STATUS_READONLY) {
            return null
        }
        return this.props.element.connectorPoints.map((point, index) => {
            let [x, y] = point.axis
            return <CircleView className="point" key={index} x={x} y={y} radius={POINT_RADIUS} parameter={point.position} />
        })
    }
    renderText() {
        let { text, lineBreak, width, height } = this.props.element.attribute
        let x = width / 2
        let y = height / 2
        if (!lineBreak) {
            y += FONT_SIZE / 2
            return <TextView x={x} y={y} text={text} />
        }
        text = cutText(text, MAX_FONT_SIZE, FONT_SIZE)
        return <TextGroupView x={x} y={20} text={text} />
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props != nextProps
    }
}

export default Controller
