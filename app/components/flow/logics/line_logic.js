import { calcConnectorPoints, calcLinePoints } from './point_logic'
import { getElementByEvent, calcNewAxis } from './graph_logic'
import { calcPositionInElement, createElement } from './element_logic'
import { ELEMENT_TYPE_CONNECTOR } from '../common/constants'

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
    let polylineNode = node.querySelector('polyline')
    node.setAttribute('transform', `translate(${x}, ${y})`)
    polylineNode.setAttribute('points', line)
}

function drawConnector(move) {
    let ex = move.end.x - move.begin.x
    let ey = move.end.y - move.begin.y
    let points = createPolyline([[0, 0], [ex - 5, ey + 5]])
    move.node.setAttribute('points', points)
}

function handleDrawConnectorComplete(evt, move, graph) {
    let axis = calcNewAxis(move, graph.scale)
    let target = getElementByEvent(evt, graph)
    if (!target) {
        return
    }
    let source = move.source.element
    let sourcePosition = move.source.position
    let targetPosition = calcPositionInElement(axis, target)
    let connector = createElement(ELEMENT_TYPE_CONNECTOR, '', [source, target, sourcePosition, targetPosition])
    graph.elements.push(connector)
}

export { createPolyline, updateConnector, drawConnector, handleDrawConnectorComplete }
