import { calcConnectorPoints, calcLinePoints, clacTextAxis } from './point_logic'
import { getElementByEvent, calcNewAxis } from './graph_logic'
import { calcPositionInElement, createElement } from './element_logic'
import { ELEMENT_TYPE_CONNECTOR, EVENT_SUBTYPE_START, ELEMENT_TYPE_EVENT } from '../common/constants'

/**
 * 创建多边形线
 * @param {Array} points 线的顶点
 */
function createPolyline(points) {
    return points.map(item => item.join(',')).join(' ')
    // return points.map((item, index) => (index ? 'L' : 'M') + item.join(',')).join('')
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
    let textAxis = clacTextAxis(points)
    let node = document.getElementById(connector.id)
    let polylineNodes = node.querySelectorAll('polyline')
    let textNode = node.querySelector('text')
    node.setAttribute('transform', `translate(${x}, ${y})`)
    textNode.setAttribute('x', textAxis.x)
    textNode.setAttribute('y', textAxis.y)
    for (let i = 0; i < polylineNodes.length; ++i) {
        polylineNodes[i].setAttribute('points', line)
    }
}

/**
 * 绘画连接线
 * @param {Object} move 移动数据
 */
function drawConnector(move) {
    let rect = document.querySelector('.graph').getBoundingClientRect()
    let sx = move.begin.x - rect.left
    let sy = move.begin.y - rect.top
    let ex = sx + (move.end.x - move.begin.x)
    let ey = sy + (move.end.y - move.begin.y)
    let points = createPolyline([[sx, sy], [ex - 5, ey + 5]])
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
    // 检查节点间循环
    let checkLoop = source.prevs.reduce((prev, curr) => prev || target.nexts.indexOf(curr) != -1, false)
    if (checkLoop) {
        return
    }
    // 检查节点间重复
    let checkRepeat = source.nexts.reduce((prev, curr) => prev || target.prevs.indexOf(curr) != -1, false)
    if (checkRepeat) {
        return
    }
    let sourcePosition = move.source.position
    let targetPosition = calcPositionInElement(axis, target)
    let connector = createElement(ELEMENT_TYPE_CONNECTOR, '', [source, target, sourcePosition, targetPosition])
    graph.elements.push(connector)
}

export { createPolyline, updateConnector, drawConnector, handleDrawConnectorComplete }
