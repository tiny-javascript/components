import GraphModel from '../models/graph_model'
import { OPTION_ELEMENT_CREATE, MOVE_VIEW, MOVE_ELEMENT, MOVE_LINE, POSITION_LEFT, ELEMENT_TYPE_EVENT, EVENT_SUBTYPE_START, EVENT_SUBTYPE_OVER, OPTION_ELEMENT_UPDATE } from '../common/constants'
import { createElement, modifyElement } from './element_logic'
import MoveModel from '../models/move_model'
import { calcPointFixedAxis } from './point_logic'
import { createGuideLineNode } from './line_logic'

/**
 * 解析图形数据
 * @param {String} data JSON数据
 * @param {String} height 图形高度
 * @param {String} startText 开始文本
 * @param {String} overText 结算文本
 */
function parseGraphByJSONData(data, height, startText, overText) {
    let graph = new GraphModel()
    let startElement, overElement
    graph.height = height
    // 如果没有解析数据，需要新增开始和结束节点
    if (!data) {
        startElement = createElement(ELEMENT_TYPE_EVENT, EVENT_SUBTYPE_START, [graph.height])
        overElement = createElement(ELEMENT_TYPE_EVENT, EVENT_SUBTYPE_OVER, [graph.height])
        graph.elements.push(startElement, overElement)
    }
    startElement.attribute.text = startText
    overElement.attribute.text = overText
    return graph
}

/**
 * 根据事件对象获取DOM节点
 * @param {Object} evt 事件对象
 */
function getElementNodeByEvent(evt) {
    return evt.path.reduce((prev, curr) => {
        if (prev) return prev
        return curr instanceof SVGElement && curr.classList.contains('element') ? curr : null
    }, null)
}

/**
 * 根据事件对象获取节点ID
 * @param {Object} evt 事件对象
 */
function getElementId(evt) {
    let node = getElementNodeByEvent(evt)
    return node ? node.getAttribute('id') : ''
}

/**
 * 根据ID获取节点数据
 * @param {String} id 节点ID
 * @param {Object} graph 图形数据
 */
function getElementById(id, graph) {
    return graph.elements.find(item => item.id == id)
}

/**
 * 根据事件获取节点
 * @param {Object} evt 鼠标事件对象
 * @param {Object} graph 图形数据
 */
function getElementByEvent(evt, graph) {
    return getElementById(getElementId(evt), graph)
}

/**
 * 处理选项数据
 * @param {Array} options 选项数据
 * @param {Object} graph 图形数据
 */
function handleOptions(options, graph) {
    options.forEach(option => {
        let { type, data } = option
        switch (type) {
            case OPTION_ELEMENT_CREATE:
                let element = createElement(data)
                element.attribute.x = 10 - graph.x
                element.attribute.y = 10 - graph.y
                graph.elements.push(element)
                break
            case OPTION_ELEMENT_UPDATE:
                modifyElement(data, graph)
                break
        }
    })
}

/**
 * 创建移动数据模型
 * @param {Object} evt 鼠标事件
 * @param {Object} graph 图形对象
 */
function createMoveModel(evt, graph) {
    if (checkNodeType(evt, 'element-connector')) {
        return null
    }
    let move = new MoveModel()
    // 确定移动类型
    if (checkNodeType(evt, 'point')) {
        move.type = MOVE_LINE
    } else if (checkNodeType(evt, 'element')) {
        move.type = MOVE_ELEMENT
    } else if (checkNodeType(evt, 'graph')) {
        move.type = MOVE_VIEW
    }
    if (move.type == MOVE_VIEW) {
        move.source = { x: graph.x, y: graph.y }
    } else if (move.type == MOVE_ELEMENT) {
        let element = getElementByEvent(evt, graph)
        move.node = getElementNodeByEvent(evt)
        move.source = { x: element.attribute.x, y: element.attribute.y, element }
    } else if (move.type == MOVE_LINE) {
        let axis = evt.target.dataset.axis.split(',').map(item => Number(item))
        let element = getElementByEvent(evt, graph)
        // 连接器无法从结束点开始
        if (element.type == ELEMENT_TYPE_EVENT && element.subType == EVENT_SUBTYPE_OVER) {
            return null
        }
        let { x, y } = calcPointFixedAxis(element, axis)
        let connectorNode = document.getElementById('flowGuideLine')
        connectorNode.setAttribute('transform', `translate(${x}, ${y})`)
        move.node = connectorNode.querySelector('polyline')
        // 连线开始节点
        move.source = { x, y, element, position: evt.target.dataset.paramter }
        // 连线模拟的结束节点
        move.target = { x: 0, y: 0, element: null, position: POSITION_LEFT }
    }
    move.begin.x = evt.clientX
    move.begin.y = evt.clientY
    return move
}

/**
 * 检查Node类型
 * @param {Object} evt 鼠标事件
 * @param {String} className 样式名称
 */
function checkNodeType(evt, className) {
    return evt.path.reduce((prev, node) => {
        if (prev) return prev
        return node instanceof SVGElement && node.classList.contains(className)
    }, false)
}

/**
 * 计算新坐标
 * @param {Object} move 移动数据模型
 * @param {Number} scale 缩放率
 */
function calcNewAxis(move, scale = 1) {
    let { source, begin, end } = move
    let offsetX = end.x - begin.x
    let offsetY = end.y - begin.y
    return {
        x: source.x + offsetX,
        y: source.y + offsetY
    }
}

/**
 * 闭环检查
 * @param {Object} graph 图形信息
 */
function checkClosureLoop(graph) {
    return false
}

export { parseGraphByJSONData, getElementId, getElementById, getElementByEvent, getElementNodeByEvent, handleOptions, createMoveModel, calcNewAxis }
