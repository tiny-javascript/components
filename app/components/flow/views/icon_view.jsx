import React, { Component, PropTypes } from 'react'
import { ICON_WORKFLOW, ICON_ACTION, ICON_MANUAL, ICON_ABORT, ICON_AUDIT, ICON_SKIP, ICON_REDO } from '../common/constants'
class IconView extends Component {
    static propTypes = {
        x: PropTypes.number,
        y: PropTypes.number,
        title: PropTypes.string,
        fontSize: PropTypes.number,
        className: PropTypes.string,
        icon: PropTypes.string.isRequired,
        onClick: PropTypes.func
    }
    static defaultProps = {
        x: 0,
        y: 0,
        fontSize: 18,
        className: ''
    }
    renderIconText(icon, props) {
        let node = null
        switch (icon) {
            case ICON_WORKFLOW:
                node = <text {...props}>&#xe800;</text>
                break
            case ICON_ACTION:
                node = <text {...props}>&#xe7b8;</text>
                break
            case ICON_MANUAL:
                node = <text {...props}>&#xe981;</text>
                break
            case ICON_ABORT:
                node = <text {...props}>&#xe761;</text>
                break
            case ICON_REDO:
                node = <text {...props}>&#xe947;</text>
                break
            case ICON_AUDIT:
                node = <text {...props}>&#xe9b6;</text>
                break
            case ICON_SKIP:
                node = <text {...props}>&#xe946;</text>
                break
        }
        return node
    }
    render() {
        let { x, y, title, icon, className, fontSize, onClick } = this.props
        if (!icon) {
            return null
        }
        let props = { fontSize, onClick }
        return (
            <g className={'icon ' + className} transform={`translate(${x},${y})`}>
                <title>{title}</title>
                {this.renderIconText(icon, props)}
            </g>
        )
    }
}

export default IconView
