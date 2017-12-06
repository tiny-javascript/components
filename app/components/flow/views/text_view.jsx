import React, { Component, PropTypes } from 'react'
import { FONT_SIZE, LINE_HEIGHT } from '../common/constants'

export class TextGroupView extends Component {
    static propTypes = {
        x: PropTypes.number,
        y: PropTypes.number,
        fontSize: PropTypes.number,
        text: PropTypes.array.isRequired
    }
    static defaultProps = {
        text: [],
        fontSize: FONT_SIZE
    }
    render() {
        let { x, y, text, fontSize } = this.props
        return (
            <text y={y} fontSize={fontSize}>
                {text.map((item, index) => {
                    return (
                        <tspan key={index} x={x} dy={LINE_HEIGHT}>
                            {item}
                        </tspan>
                    )
                })}
            </text>
        )
    }
}
export default class TextView extends Component {
    static propTypes = {
        x: PropTypes.number,
        y: PropTypes.number,
        fontSize: PropTypes.number,
        text: PropTypes.string.isRequired
    }
    static defaultProps = {
        text: '',
        fontSize: FONT_SIZE
    }
    render() {
        let { x, y, text, fontSize } = this.props
        return (
            <text x={x} y={y} fontSize={fontSize}>
                {text}
            </text>
        )
    }
}
