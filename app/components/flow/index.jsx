import React, { Component, PropTypes } from 'react'
import { ELEMENT_STATUS_ACTIVE, MOVE_VIEW, MOVE_ELEMENT, MOVE_LINE, GRAPH_STATUS_LINK, GRAPH_STATUS_EDIT, ELEMENT_TYPE_CONNECTOR, GRAPH_STATUS_MOVE, ELEMENT_TYPE_EVENT } from './common/constants'
import { parseGraphByJSONData, handleOptions, createMoveModel, calcNewAxis, getElementByEvent } from './logics/graph_logic'
import { isActiveElement, moveElement, createElement, deleteElement } from './logics/element_logic'
import { drawConnector, handleDrawConnectorComplete } from './logics/line_logic'
import ControllerFactory from './controllers/controller_factory'
import MoveModel from './models/move_model'
import './flow.less'
const markerProps = {
    viewBox: '0 0 10 10',
    refX: 10,
    refY: 5,
    markerWidth: 6,
    markerHeight: 6,
    orient: 'auto'
}
class FlowContainer extends Component {
    static childContextTypes = {
        graph: PropTypes.object
    }
    static propTypes = {
        startText: PropTypes.string,
        overText: PropTypes.string,
        data: PropTypes.string,
        height: PropTypes.string,
        readOnly: PropTypes.bool,
        onBeforeRender: PropTypes.func,
        onSelect: PropTypes.func,
        onDelete: PropTypes.func
    }
    static defaultProps = {
        startText: 'start',
        overText: 'over',
        height: '500',
        readOnly: false,
        onBeforeRender: () => {},
        onSelect: () => {},
        onDelete: () => {}
    }
    state = {
        graph: null,
        selectedElements: []
    }
    move = null
    onClick(e) {
        let element = getElementByEvent(e.nativeEvent, this.state.graph)
        if (!element) {
            this.props.onSelect(undefined)
            this.setState({ selectedElements: [] })
            return
        }
        let { selectedElements } = this.state
        if (e.nativeEvent.shiftKey) {
            selectedElements.push(element)
        } else {
            selectedElements = [element]
        }
        this.setState({ selectedElements })
    }
    onDoubleClick() {
        this.props.onSelect(this.state.selectedElements[0])
    }
    onMouseDown(e) {
        let { graph } = this.state
        this.move = createMoveModel(e.nativeEvent, this.state.graph)
        if (!this.move) {
            return
        }
        if (this.move.type == MOVE_LINE) {
            graph.status = GRAPH_STATUS_LINK
        } else if (this.move.type == MOVE_ELEMENT) {
            graph.status = GRAPH_STATUS_MOVE
        }
        this.setState({ graph })
    }
    onMouseMove(e) {
        if (!this.move) return
        // 开启移动中状态
        if (!this.move.active) {
            this.move.active = true
            // 将移动中的节点提升到最上面
            if (this.move.node && this.move.type != MOVE_LINE) {
                this.refs.layer.appendChild(this.move.node)
            }
        }
        let { graph } = this.state
        let { end, type } = this.move
        end.x = e.clientX
        end.y = e.clientY
        let newAxis = calcNewAxis(this.move)
        switch (type) {
            case MOVE_VIEW:
                graph = Object.assign({}, graph, newAxis)
                this.setState({ graph })
                break
            case MOVE_ELEMENT:
                moveElement(this.move, graph, newAxis)
                break
            case MOVE_LINE:
                drawConnector(this.move, graph)
                break
        }
    }
    onMouseUp(e) {
        if (!this.move) {
            return
        }
        let { graph } = this.state
        if (this.move.type == MOVE_LINE) {
            this.move.node.setAttribute('points', '')
            handleDrawConnectorComplete(e.nativeEvent, this.move, graph)
        }
        if (graph.status != GRAPH_STATUS_EDIT) {
            graph.status = GRAPH_STATUS_EDIT
            this.setState({ graph })
        }
        this.move = null
    }
    onKeyUp(e) {
        let code = e.keyCode || e.which
        if (code == 8 || code == 46) {
            this.delete()
        }
    }
    onWheel(e) {
        //e.preventDefault()
    }
    render() {
        let { graph, selectedElements } = this.state
        let { x, y, status, height, scale } = graph
        let events = {
            onClick: this.onClick.bind(this),
            onDoubleClick: this.onDoubleClick.bind(this),
            onMouseMove: this.onMouseMove.bind(this),
            onMouseDown: this.onMouseDown.bind(this),
            onMouseUp: this.onMouseUp.bind(this),
            onKeyUp: this.onKeyUp.bind(this),
            onWheel: this.onWheel.bind(this)
        }
        return (
            <svg ref="svg" className={'graph ' + status} width="100%" height={height} tabIndex="-1" {...events}>
                <defs>
                    <marker id="triangle-default" className="marker" {...markerProps}>
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                    <marker id="triangle-disabled" className="marker disabled" {...markerProps}>
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                    <marker id="triangle-success" className="marker success" {...markerProps}>
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                    <marker id="triangle-process" className="marker process" {...markerProps}>
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                    <marker id="triangle-pause" className="marker pause" {...markerProps}>
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                    <marker id="triangle-error" className="marker error" {...markerProps}>
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                </defs>
                <g ref="layer" className="layer" transform={`translate(${x},${y}),scale(${scale})`}>
                    {graph.elements.map(element => {
                        const Controller = ControllerFactory.create(element.type)
                        return Controller ? <Controller key={element.id} element={element} active={isActiveElement(element, selectedElements)} /> : null
                    })}
                </g>
                <g id="flowGuideLine" className="element element-connector dashed">
                    <polyline />
                </g>
            </svg>
        )
    }
    getChildContext() {
        return { graph: this.state.graph }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState
    }
    componentWillMount() {
        let { data, height, startText, overText } = this.props
        // 回传一个更新方法交给上一层，可以省略掉事件
        this.props.onBeforeRender(this.update.bind(this))
        this.state.graph = parseGraphByJSONData(data, height, startText, overText)
    }
    delete() {
        let { selectedElements, graph } = this.state
        if (!selectedElements.length) {
            return
        }
        selectedElements.forEach(element => {
            // 开始结束不能被删除
            if (element.type !== ELEMENT_TYPE_EVENT) {
                deleteElement(element, graph)
            }
        })
        this.setState({ graph })
    }
    /**
     * 根据传递的选项数据进行更新
     * @param {Array} options 选项数据
     */
    update(options) {
        let { graph } = this.state
        handleOptions(options, graph)
        this.setState({ graph })
    }
}

export default FlowContainer
