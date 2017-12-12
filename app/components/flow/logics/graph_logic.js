import GraphModel from '../models/graph_model'
import {
    OPTION_ELEMENT_CREATE,
    MOVE_VIEW,
    MOVE_ELEMENT,
    MOVE_LINE,
    POSITION_LEFT,
    ELEMENT_TYPE_EVENT,
    EVENT_SUBTYPE_START,
    EVENT_SUBTYPE_OVER,
    OPTION_ELEMENT_UPDATE,
    OPTION_ELEMENT_ALIGN,
    ELEMENT_STATUS_ERROR,
    ERROR_LINK_BREAK,
    ERROR_LOOP_CLOSURE,
    OPTION_GRAPH_UPDATE,
    OPTION_GRAPH_VALIDATE
} from '../common/constants'
import { createElement, modifyElement, alignElements } from './element_logic'
import MoveModel from '../models/move_model'
import { calcPointFixedAxis } from './point_logic'
import { createGuideLineNode } from './line_logic'
/**
 * 渲染错误节点
 * @param {Array} errorData 错误节点ID集合
 * @param {Object} graph 图形数据
 */
function renderErrorElements(errorData, graph) {
    if (!errorData || !(errorData instanceof Array)) {
        return
    }
    errorData.forEach(id => {
        let element = getElementById(id, graph)
        element.status = ELEMENT_STATUS_ERROR
    })
}
/**
 * 闭环检查
 * @param {Object} graph 图形信息
 */
function checkClosureLoop(graph) {
    let route = Object.create(null)
    let next = (element, level) => {
        if (!element.nexts.length) {
            return
        }
        // 缓存上一级路径
        let cache = route[level] || []
        // 删除上一级路径数据
        delete route[level]
        // 遍历后面的节点，并生成新路径
        element.nexts.forEach((connectorId, index) => {
            // 获取连接器
            let connector = getElementById(connectorId, graph)
            // 获取连接器对应的下一个节点
            let nextElement = getElementById(connector.nexts[0], graph)
            let pathname = level + '_' + index
            // 拷贝上一级路径并生成新路径，并附加新的元素
            let path = cache.map(item => item)
            path.push(connectorId, nextElement.id)
            route[pathname] = path
            if (cache.indexOf(nextElement.id) !== -1) {
                throw pathname
            }
            next(nextElement, pathname)
        })
    }
    let result = { error: false, data: [] }
    try {
        let start = getElementById('start', graph)
        next(start, 's')
    } catch (e) {
        result.error = true
        result.data = route[e]
    }
    return result
}
/**
 * 断链检查
 * @param {Object} graph 图形信息
 */
function checkLinkBreak(graph) {
    let result = { error: false, data: [] }
    return result
}
/**
 * 更新图形
 * @param {Object} data 更新数据
 * @param {Object} graph 图形数据
 */
function updateGraph(data, graph) {
    if (data.field == 'scale') {
        graph.scale = data.value
    }
}

// --------------------------------------------------下面是对外访问的函数-------------------------------------------------- //

/**
 * 根据事件对象和类名查询节点
 * @param {Event} evt 鼠标事件
 * @param {String} className 类名
 */
function queryNodeByEventWithClassName(evt, className) {
    let node = evt.target
    let path = []
    while (node instanceof SVGElement) {
        path.push(node)
        node = node.parentNode
    }
    return path.reduce((prev, curr) => {
        if (prev) return prev
        let classes = curr.getAttribute('class')
        return classes && classes.split(' ').indexOf(className) !== -1 ? curr : null
    }, null)
}

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
 * 根据事件对象获取节点ID
 * @param {Object} evt 事件对象
 */
function getElementId(evt) {
    let node = queryNodeByEventWithClassName(evt, 'element')
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
 * 处理节点选项数据
 * @param {Array} options 选项数据
 * @param {Object} graph 图形数据
 * @param {Array} selectedElements 选中的节点
 */
function handleElementOptions(options, graph, selectedElements) {
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
            case OPTION_ELEMENT_ALIGN:
                alignElements(selectedElements, data, graph)
                break
        }
    })
}
/**
 * 处理图形选项数据
 * @param {Array} options 选项数据
 * @param {Object} graph 图形数据
 */
function handleGraphOption(option, graph) {
    let { type, data } = option
    switch (type) {
        case OPTION_GRAPH_UPDATE:
            updateGraph(data, graph)
            break
        case OPTION_GRAPH_VALIDATE:
            let errorType = validateGraph(graph, true)
            if (errorType) {
                data && data(errorType)
            }
            break
    }
}

/**
 * 校验图形信息
 * @param {Object} graph 图形数据
 * @param {Boolean} validateLinkBreak 是否进行断链校验
 */
function validateGraph(graph, validateLinkBreak) {
    if (validateLinkBreak) {
        let linkBreakResult = checkLinkBreak(graph)
        if (linkBreakResult.error) {
            renderErrorElements(linkBreakResult.data, graph)
            return ERROR_LINK_BREAK
        }
    }
    let loopClosureResult = checkClosureLoop(graph)
    if (loopClosureResult.error) {
        let start = loopClosureResult.data.indexOf(loopClosureResult.data[loopClosureResult.data.length - 1])
        renderErrorElements(loopClosureResult.data.slice(start), graph)
        return ERROR_LOOP_CLOSURE
    }
    return ''
}

/**
 * 创建移动数据模型
 * @param {Object} evt 鼠标事件
 * @param {Object} graph 图形对象
 */
function createMoveModel(evt, graph) {
    if (queryNodeByEventWithClassName(evt, 'element-connector')) {
        return null
    }
    let move = new MoveModel()
    // 确定移动类型
    if (queryNodeByEventWithClassName(evt, 'point')) {
        move.type = MOVE_LINE
    } else if (queryNodeByEventWithClassName(evt, 'element')) {
        move.type = MOVE_ELEMENT
    } else if (queryNodeByEventWithClassName(evt, 'graph')) {
        move.type = MOVE_VIEW
    }
    if (move.type == MOVE_VIEW) {
        move.source = { x: graph.x, y: graph.y }
    } else if (move.type == MOVE_ELEMENT) {
        let element = getElementByEvent(evt, graph)
        move.node = queryNodeByEventWithClassName(evt, 'element')
        move.source = { x: element.attribute.x, y: element.attribute.y, element }
    } else if (move.type == MOVE_LINE) {
        let axis = evt.target
            .getAttribute('data-axis')
            .split(',')
            .map(item => Number(item))
        let element = getElementByEvent(evt, graph)
        // 连接器无法从结束点开始
        if (element.type == ELEMENT_TYPE_EVENT && element.subType == EVENT_SUBTYPE_OVER) {
            return null
        }
        let { x, y } = calcPointFixedAxis(element, axis)
        move.node = document.getElementById('flowGuideLine').querySelector('polyline')
        // 连线开始节点
        move.source = { x, y, element, position: evt.target.getAttribute('data-parameter') }
        // 连线模拟的结束节点
        move.target = { x: 0, y: 0, element: null, position: POSITION_LEFT }
    }
    move.begin.x = evt.clientX
    move.begin.y = evt.clientY
    return move
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
        x: source.x + offsetX * (1 / scale),
        y: source.y + offsetY * (1 / scale)
    }
}

/**
 * 图形缩放
 * @param {Object} evt 鼠标事件
 * @param {Object} graph 图形数据
 */
function zoom(evt, graph) {
    let delta = evt.detail ? evt.detail * -120 : evt.wheelDelta
    let wheel = delta / 120
    if (delta < 0) {
        graph.scale = graph.scale >= 1.5 ? 1.5 : graph.scale + 0.01
    }
    if (delta > 0) {
        graph.scale = graph.scale <= 0.5 ? 0.5 : graph.scale - 0.01
    }
}

function reset(graph) {
    graph.elements.forEach(element => (element.status = ''))
}

export { parseGraphByJSONData, getElementId, getElementById, getElementByEvent, handleElementOptions, handleGraphOption, createMoveModel, calcNewAxis, zoom, reset }
