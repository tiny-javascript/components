import ElementModel from '../models/element_model'
import { ELEMENT_TYPE_EVENT_START, ELEMENT_TYPE_EVENT_OVER, ELEMENT_TYPE_EVENT, SHAPE_HEIGHT, ELEMENT_TYPE_PROCESS, ELEMENT_TYPE_CONNECTOR, ELEMENT_TYPE_DECISION, POSITION_LEFT, POSITION_RIGHT, POSITION_BOTTOM, POSITION_TOP } from '../common/constants'
import { calcLinkPoints, calcPointFixedAxis } from './point_logic'
import { getElementById } from './graph_logic'
import { updateConnector } from './line_logic'

/**
 * 创建事件节点
 * @param {int} graphHeight 图形高度
 */
function createEventElement(subType, graphHeight, radius = 60) {
    let element = new ElementModel()
    element.type = ELEMENT_TYPE_EVENT
    element.subType = subType
    element.attribute.width = element.attribute.height = radius
    // 事件节点默认垂直居中
    element.attribute.y = (graphHeight - element.attribute.height) / 2
    return element
}
/**
 * 创建开始事件节点
 * @param {int} graphHeight 图形高度
 */
function createStartElement(graphHeight) {
    let element = createEventElement(ELEMENT_TYPE_EVENT_START, graphHeight)
    element.id = 'start'
    element.attribute.x = 50
    element.connectorPoints = calcLinkPoints(element.attribute)
    return element
}
/**
 * 创建开始结束节点
 * @param {int} graphHeight 图形高度
 */
function createOverElement(graphHeight) {
    let element = createEventElement(ELEMENT_TYPE_EVENT_OVER, graphHeight, 80)
    element.id = 'over'
    element.attribute.x = 800
    element.connectorPoints = calcLinkPoints(element.attribute)
    return element
}

/**
 * 创建流程节点
 */
function createProcessElement() {
    let element = new ElementModel()
    element.type = ELEMENT_TYPE_PROCESS
    element.connectorPoints = calcLinkPoints(element.attribute)
    return element
}

/**
 * 创建判断节点
 */
function createDesicionElement() {
    let element = new ElementModel()
    element.type = ELEMENT_TYPE_DECISION
    element.connectorPoints = calcLinkPoints(element.attribute)
    return element
}

/**
 * 创建连接器节点
 * @param {Element} source 开始节点
 * @param {Element} target 结束节点
 * @param {String} sourcePosition 开始位置
 * @param {String} targetPosition 结束位置
 */
function createConnectorElement(source, target, sourcePosition, targetPosition) {
    let startPoint = source.connectorPoints.find(item => item.position == sourcePosition)
    let endPoint = target.connectorPoints.find(item => item.position == targetPosition)
    let startPointFixedAxis = calcPointFixedAxis(source, startPoint.axis)
    let endPointFixedAxis = calcPointFixedAxis(target, endPoint.axis)
    let element = new ElementModel()
    element.type = ELEMENT_TYPE_CONNECTOR
    element.prevs = [source.id, sourcePosition]
    element.nexts = [target.id, targetPosition]
    element.attribute.x = startPointFixedAxis.x
    element.attribute.y = startPointFixedAxis.y
    element.attribute.width = endPointFixedAxis.x - startPointFixedAxis.x
    element.attribute.height = endPointFixedAxis.y - startPointFixedAxis.y
    source.nexts.push(element.id)
    target.prevs.push(element.id)
    return element
}

/**
 * 节点移动时处理connector
 * @param {Object} graph 图形数据
 * @param {Element} element 移动的节点
 * @param {Number} position 变化位置，0代表开始节点在移动，1代表结束节点在移动
 */
function handleConnectorInElementMove(graph, element, position) {
    return function(id) {
        // 更新Connector数据模型，重新计算终点，也就是width和height
        let connector = getElementById(id, graph)
        let { attribute, prevs, nexts } = connector
        // 如果是开始节点变化，需要更新x,y
        if (position == 0) {
            let startPoint = element.connectorPoints.find(item => item.position == prevs[1])
            let startPointFixedAxis = calcPointFixedAxis(element, startPoint.axis)
            let offsetX = startPointFixedAxis.x - attribute.x
            let offsetY = startPointFixedAxis.y - attribute.y
            attribute.x = startPointFixedAxis.x
            attribute.y = startPointFixedAxis.y
            attribute.width -= offsetX
            attribute.height -= offsetY
        } else if (position == 1) {
            let endPoint = element.connectorPoints.find(item => item.position == nexts[1])
            let endPointFixedAxis = calcPointFixedAxis(element, endPoint.axis)
            attribute.width = endPointFixedAxis.x - attribute.x
            attribute.height = endPointFixedAxis.y - attribute.y
        }
        // 更新Line Node
        updateConnector(connector, graph)
    }
}

// --------------------------------------------------下面是对外访问的函数-------------------------------------------------- //
/**
 * 创建节点
 * @param {String} type 节点类型
 * @param {String} subType 节点子类型
 * @param {Array} options 节点参数
 */
function createElement(type, subType, options) {
    let element = null
    switch (type) {
        case ELEMENT_TYPE_EVENT:
            if (subType == ELEMENT_TYPE_EVENT_START) {
                element = createStartElement(...options)
            } else if (subType == ELEMENT_TYPE_EVENT_OVER) {
                element = createOverElement(...options)
            }
            break
        case ELEMENT_TYPE_PROCESS:
            element = createProcessElement()
            break
        case ELEMENT_TYPE_DECISION:
            element = createDesicionElement()
            break
        case ELEMENT_TYPE_CONNECTOR:
            element = createConnectorElement(...options)
            break
    }
    return element
}

/**
 * 移动节点
 * @param {Object} move 移动数据模型
 * @param {Object} graph 图形数据
 * @param {Object} newAxis 新坐标
 */
function moveElement(move, graph, newAxis) {
    let { x, y } = newAxis
    let { node, source } = move
    if (source.element.type == ELEMENT_TYPE_CONNECTOR) return
    node.setAttribute('transform', `translate(${x}, ${y})`)
    source.element.attribute.x = x
    source.element.attribute.y = y
    // 更新所有连接器
    source.element.prevs.forEach(handleConnectorInElementMove(graph, source.element, 1))
    source.element.nexts.forEach(handleConnectorInElementMove(graph, source.element, 0))
}

/**
 * 判断节点是否活动
 * @param {Object} element 节点
 * @param {Array} selectedElements 选中节点集合
 */
function isActiveElement(element, selectedElements) {
    return selectedElements.findIndex(item => item.id == element.id) !== -1
}

/**
 * 计算文本长度
 * @param {String} text 文本
 */
function calcTextWidth(text) {
    var canvas = document.createElement('canvas')
    var context = canvas.getContext('2d')
    context.font = '12px Arial'
    return context.measureText(text).width
}

/**
 * 切割文本
 * @param {String} text 被切割的文本
 * @param {Number} max 最大长度
 * @param {Number} fontsize 字体
 */
function cutText(text, max, fontsize) {
    let curLen = 0,
        start = 0,
        end = 0,
        result = []

    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i)
        let pixelLen = code > 255 ? fontsize : fontsize / 2
        curLen += pixelLen
        if (curLen > max) {
            end = i
            result.push(text.substring(start, end))
            start = i
            curLen = pixelLen
        }
        if (i === text.length - 1) {
            end = i
            result.push(str.substring(start, end + 1))
        }
    }
    return result
}

/**
 * 计算坐标在节点内位置
 * @param {Object} axis 坐标
 * @param {Element} element 节点数据
 */
function calcPositionInElement(axis, element) {
    let { x, y, width, height } = element.attribute
    let inX = axis.x - x - width / 2
    let inY = height / 2 - (axis.y - y)
    let pi = Math.atan2(inY, inX)
    if (Math.abs(pi) <= Math.atan2(0, -width / 2) && Math.abs(pi) >= Math.atan2(height / 2, -width / 2)) {
        return POSITION_LEFT
    } else if (Math.abs(pi) >= Math.atan2(0, width / 2) && Math.abs(pi) <= Math.atan2(height / 2, width / 2)) {
        return POSITION_RIGHT
    } else if (pi > Math.atan2(height / 2, width / 2) && pi < Math.atan2(height / 2, -width / 2)) {
        return POSITION_TOP
    } else if (pi > Math.atan2(-height / 2, -width / 2) && pi < Math.atan2(-height / 2, width / 2)) {
        return POSITION_BOTTOM
    }
    return ''
}

export { createElement, isActiveElement, moveElement, calcTextWidth, cutText, calcPositionInElement }
