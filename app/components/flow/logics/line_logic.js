import { calcConnectorPoints, calcLinePoints } from './point_logic'
import { getElementByEvent, calcNewAxis } from './graph_logic'
import { calcPositionInElement, createElement } from './element_logic'
import { ELEMENT_TYPE_CONNECTOR, EVENT_SUBTYPE_START, ELEMENT_TYPE_EVENT } from '../common/constants'

/**
 * 创建多边形线
 * @param {Array} points 线的顶点
 */
function createPolyline(points) {
    return points.map(item => item.join(',')).join(' ')
}

/**
 * 更新连接器
 * @param {Element} connector 连接器
 * @param {Object} graph 图形数据
 */
function updateConnector(connector, graph) {
    let { prevs, nexts, attribute } = connector
    let { x, y, width, height } = attribute
    let points = calcConnectorPoints(prevs, nexts, width, height, graph)
    let line = createPolyline(points)
    let node = document.getElementById(connector.id)
    let polylineNodes = node.querySelectorAll('polyline')
    let textNode = node.querySelector('text')
    node.setAttribute('transform', `translate(${x}, ${y})`)
    textNode.setAttribute('x', width / 2)
    textNode.setAttribute('y', height / 2)
    polylineNodes.forEach(item => item.setAttribute('points', line))
}

/**
 * 绘画连接线
 * @param {Object} move 移动数据
 */
function drawConnector(move, graph) {
    let ex = move.end.x - move.begin.x + graph.x
    let ey = move.end.y - move.begin.y + graph.y
    let points = createPolyline([[graph.x, graph.y], [ex - 5, ey + 5]])
    move.node.setAttribute('points', points)
}

/**
 * 处理连接线绘画完成
 * @param {Event} evt 鼠标事件
 * @param {Object} move 移动数据
 * @param {Object} graph 图形数据
 */
function handleDrawConnectorComplete(evt, move, graph) {
    let axis = calcNewAxis(move, graph.scale)
    let target = getElementByEvent(evt, graph)
    let source = move.source.element
    if (!target) {
        return
    }
    // 自己不能连接自己
    if (target.id == source.id) {
        return
    }
    // 连接器无法在开始点结束
    if (target.type == ELEMENT_TYPE_EVENT && target.subType == EVENT_SUBTYPE_START) {
        return
    }
    let sourcePosition = move.source.position
    let targetPosition = calcPositionInElement(axis, target)
    let connector = createElement(ELEMENT_TYPE_CONNECTOR, '', [source, target, sourcePosition, targetPosition])
    graph.elements.push(connector)
}

export { createPolyline, updateConnector, drawConnector, handleDrawConnectorComplete }
