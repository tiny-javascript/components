import React, { Component, PropTypes } from 'react'
import { ICON_WORKFLOW, ICON_ACTION, ICON_MANUAL } from '../common/constants'

function redoIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe947;
        </text>
    )
}
function continueIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe946;
        </text>
    )
}
function manualIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe982;
        </text>
    )
}
function interruptIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe761;
        </text>
    )
}
function checkScriptIcon(attrs, type) {
    return (
        <text key={type} {...attrs}>
            &#xe9b6;
        </text>
    )
}

class IconView extends Component {
    static propTypes = {
        x: PropTypes.number,
        y: PropTypes.number,
        title: PropTypes.string,
        fontSize: PropTypes.number,
        className: PropTypes.string,
        icon: PropTypes.string.isRequired
    }
    static defaultProps = {
        x: 0,
        y: 0,
        fontSize: 18,
        className: ''
    }
    renderIconText(icon, fontSize) {
        let node = null
        switch (icon) {
            case ICON_WORKFLOW:
                node = <text fontSize={fontSize}>&#xe800;</text>
                break
            case ICON_ACTION:
                node = <text fontSize={fontSize}>&#xe7b8;</text>
                break
            case ICON_MANUAL:
                node = <text fontSize={fontSize}>&#xe981;</text>
                break
        }
        return node
    }
    render() {
        let { x, y, title, icon, className, fontSize } = this.props
        if (!icon) {
            return null
        }
        return (
            <g className={'icon ' + className} transform={`translate(${x},${y})`}>
                <title>{title}</title>
                {this.renderIconText(icon, fontSize)}
            </g>
        )
    }
}

export default IconView
