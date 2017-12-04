import { POSITION_TOP, POSITION_RIGHT, POSITION_BOTTOM, POSITION_LEFT, MIN_GAP } from '../common/constants'
import { getElementById } from './graph_logic'
function calcFromLeftToLeftConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    let h = sh >= th ? sh : th
    if (Math.abs(ey) <= th / 2 + MIN_GAP) {
        let hd = ex <= MIN_GAP ? -1 : 1
        let vd = ey >= 0 ? 1 : -1
        let y1 = (ex <= MIN_GAP ? ey : 0) + (h / 2 + MIN_GAP) * hd * vd
        points.push([-MIN_GAP, 0])
        points.push([-MIN_GAP, y1])
        points.push([ex / 2, y1])
        points.push([ex / 2, ey])
    } else {
        let x1 = ex >= 0 ? -MIN_GAP : ex - MIN_GAP
        points.push([x1, 0])
        points.push([x1, ey])
    }
    return points
}
function calcFromLeftToRightConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    // 在右边
    if (ex <= -MIN_GAP) {
        if (ey != 0) {
            points.push([ex / 2, 0])
            points.push([ex / 2, ey])
        }
    } else {
        if (Math.abs(ey) > vmg) {
            points.push([-MIN_GAP, 0])
            points.push([-MIN_GAP, ey / 2])
            points.push([ex + MIN_GAP, ey / 2])
        } else {
            let x1 = ex + tw >= 0 ? ex + tw + MIN_GAP : MIN_GAP
            let y1 = ey <= 0 ? ey - th / 2 - MIN_GAP : ey + th / 2 + MIN_GAP
            points.push([-MIN_GAP, 0])
            points.push([-MIN_GAP, y1])
            points.push([ex + MIN_GAP, y1])
        }
        points.push([ex + MIN_GAP, ey])
    }
    return points
}
function calcFromLeftToTopConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    // 左右临界值
    let cv1 = tw / -2 - MIN_GAP * 2
    // 上中临界值
    let cv2 = sh / -2
    // 中下临界值
    let cv3 = sh / 2 + MIN_GAP * 2
    if (ex <= cv1) {
        let y1 = ey > MIN_GAP ? 0 : ey - MIN_GAP
        points.push([ex / 2, 0])
        points.push([ex / 2, y1])
        points.push([ex, y1])
    } else {
        if (ey <= cv2) {
            let x1 = ex >= tw / 2 ? -MIN_GAP : ex - tw / 2 - MIN_GAP
            points.push([x1, 0])
            points.push([x1, ey - MIN_GAP])
            points.push([ex, ey - MIN_GAP])
        } else if (ey > cv2 && ey < cv3) {
            points.push([-MIN_GAP, 0])
            points.push([-MIN_GAP, cv2 - MIN_GAP])
            points.push([ex, cv2 - MIN_GAP])
        } else if (ey >= cv3) {
            if (ex <= -MIN_GAP) {
                points.push([ex, 0])
            } else {
                points.push([-MIN_GAP, 0])
                points.push([-MIN_GAP, ey / 2])
                points.push([ex, ey / 2])
            }
        }
    }
    return points
}
function calcFromLeftToBottomConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    // 左右临界值
    let cv1 = tw / -2 - MIN_GAP * 2
    let cv2 = sh / -2 - MIN_GAP * 2
    let cv3 = sh / 2
    if (ex <= cv1) {
        let y1 = ey < -MIN_GAP ? 0 : ey + MIN_GAP
        points.push([ex / 2, 0])
        points.push([ex / 2, y1])
        points.push([ex, y1])
    } else {
        if (ey >= cv3) {
            // 下
            let x1 = ex >= tw / 2 ? -MIN_GAP : ex - tw / 2 - MIN_GAP
            points.push([x1, 0])
            points.push([x1, ey + MIN_GAP])
            points.push([ex, ey + MIN_GAP])
        } else if (ey > cv2 && ey < cv3) {
            points.push([-MIN_GAP, 0])
            points.push([-MIN_GAP, cv3 + MIN_GAP])
            points.push([ex, cv3 + MIN_GAP])
        } else if (ey <= cv2) {
            // 上
            if (ex <= -MIN_GAP) {
                points.push([ex, 0])
            } else {
                points.push([-MIN_GAP, 0])
                points.push([-MIN_GAP, ey / 2])
                points.push([ex, ey / 2])
            }
        }
    }
    return points
}

function calcFromRightToLeftConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    // 在右边
    if (ex >= MIN_GAP) {
        if (ey != 0) {
            points.push([ex / 2, 0])
            points.push([ex / 2, ey])
        }
    } else {
        if (Math.abs(ey) > vmg) {
            points.push([MIN_GAP, 0])
            points.push([MIN_GAP, ey / 2])
            points.push([ex - MIN_GAP, ey / 2])
        } else {
            let x1 = ex + tw >= 0 ? ex + tw + MIN_GAP : MIN_GAP
            let y1 = ey <= 0 ? ey - th / 2 - MIN_GAP : ey + th / 2 + MIN_GAP
            points.push([x1, 0])
            points.push([x1, y1])
            points.push([ex - MIN_GAP, y1])
        }
        points.push([ex - MIN_GAP, ey])
    }
    return points
}
function calcFromRightToRightConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    let h = sh >= th ? sh : th
    if (Math.abs(ey) <= th / 2 + MIN_GAP) {
        let hd = ex >= MIN_GAP ? 1 : -1
        let vd = ey <= 0 ? 1 : -1
        let y1 = (ex >= MIN_GAP ? ey : 0) + (h / 2 + MIN_GAP) * hd * vd
        points.push([MIN_GAP, 0])
        points.push([MIN_GAP, y1])
        points.push([ex + MIN_GAP, y1])
        points.push([ex + MIN_GAP, ey])
    } else {
        let x1 = ex <= 0 ? MIN_GAP : ex + MIN_GAP
        points.push([x1, 0])
        points.push([x1, ey])
    }
    return points
}
function calcFromRightToTopConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    // 左右临界值
    let cv1 = tw / 2 + MIN_GAP * 2
    // 上中临界值
    let cv2 = sh / -2
    // 中下临界值
    let cv3 = sh / 2 + MIN_GAP * 2
    if (ex >= cv1) {
        let y1 = ey > MIN_GAP ? 0 : ey - MIN_GAP
        points.push([ex / 2, 0])
        points.push([ex / 2, y1])
        points.push([ex, y1])
    } else {
        if (ey <= cv2) {
            let x1 = ex < tw / -2 ? MIN_GAP : ex + tw / 2 + MIN_GAP
            points.push([x1, 0])
            points.push([x1, ey - MIN_GAP])
            points.push([ex, ey - MIN_GAP])
        } else if (ey > cv2 && ey < cv3) {
            points.push([MIN_GAP, 0])
            points.push([MIN_GAP, cv2 - MIN_GAP])
            points.push([ex, cv2 - MIN_GAP])
        } else if (ey >= cv3) {
            // 右下角特殊区域
            if (ex >= MIN_GAP) {
                points.push([ex, 0])
            } else {
                points.push([MIN_GAP, 0])
                points.push([MIN_GAP, ey / 2])
                points.push([ex, ey / 2])
            }
        }
    }
    return points
}
function calcFromRightToBottomConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    // 左右临界值
    let cv1 = tw / 2 + MIN_GAP * 2
    // 上中临界值
    let cv2 = sh / -2 - MIN_GAP * 2
    // 中下临界值
    let cv3 = sh / 2
    if (ex >= cv1) {
        let y1 = ey <= -MIN_GAP ? 0 : ey + MIN_GAP
        points.push([ex / 2, 0])
        points.push([ex / 2, y1])
        points.push([ex, y1])
    } else {
        if (ey >= cv3) {
            let x1 = ex < tw / -2 ? MIN_GAP : ex + tw / 2 + MIN_GAP
            points.push([x1, 0])
            points.push([x1, ey + MIN_GAP])
            points.push([ex, ey + MIN_GAP])
        } else if (ey > cv2 && ey < cv3) {
            points.push([MIN_GAP, 0])
            points.push([MIN_GAP, cv3 + MIN_GAP])
            points.push([ex, cv3 + MIN_GAP])
        } else if (ey <= cv2) {
            if (ex >= MIN_GAP) {
                points.push([ex, 0])
            } else {
                points.push([MIN_GAP, 0])
                points.push([MIN_GAP, ey / 2])
                points.push([ex, ey / 2])
            }
        }
    }
    return points
}

function calcFromTopToLeftConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    let v1 = sw / 2 + MIN_GAP
    if (ey <= -hmg) {
        let x1 = ex > MIN_GAP ? 0 : ex - MIN_GAP
        points.push([0, ey / 2])
        points.push([x1, ey / 2])
        points.push([x1, ey])
    } else {
        if (ex <= -v1) {
            let y1 = ey >= th / 2 ? -MIN_GAP : ey - th / 2 - MIN_GAP
            points.push([0, y1])
            points.push([ex - MIN_GAP, y1])
            points.push([ex - MIN_GAP, ey])
        } else if (ex > -v1 && ex < vmg) {
            points.push([0, -MIN_GAP])
            points.push([-v1 - MIN_GAP, -MIN_GAP])
            points.push([-v1 - MIN_GAP, ey])
        } else if (ex >= vmg) {
            if (ey <= -MIN_GAP) {
                points.push([0, ey])
            } else {
                points.push([0, -MIN_GAP])
                points.push([ex / 2, -MIN_GAP])
                points.push([ex / 2, ey])
            }
        }
    }
    return points
}
function calcFromTopToRightConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    let v1 = tw + MIN_GAP
    if (ey <= -hmg) {
        let x1 = ex < -MIN_GAP ? 0 : ex + MIN_GAP
        points.push([0, ey / 2])
        points.push([x1, ey / 2])
        points.push([x1, ey])
    } else {
        if (ex >= v1) {
            let y1 = ey >= th / 2 ? -MIN_GAP : ey - th / 2 - MIN_GAP
            points.push([0, y1])
            points.push([ex + MIN_GAP, y1])
            points.push([ex + MIN_GAP, ey])
        } else if (ex < v1 && ex > -vmg) {
            points.push([0, -MIN_GAP])
            points.push([v1 + MIN_GAP, -MIN_GAP])
            points.push([v1 + MIN_GAP, ey])
        } else if (ex <= -vmg) {
            if (ey <= -MIN_GAP) {
                points.push([0, ey])
            } else {
                points.push([0, -MIN_GAP])
                points.push([ex / 2, -MIN_GAP])
                points.push([ex / 2, ey])
            }
        }
    }
    return points
}
function calcFromTopToTopConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    let w = sw >= tw ? sw : tw
    if (Math.abs(ex) <= sw / 2 + MIN_GAP) {
        let vd = ex >= 0 ? 1 : -1
        let hd = ey >= MIN_GAP ? 1 : -1
        let x1 = (ey >= sh + MIN_GAP ? 0 : ex) + (w / 2 + MIN_GAP) * vd * hd
        points.push([0, -MIN_GAP])
        points.push([x1, -MIN_GAP])
        points.push([x1, ey - MIN_GAP])
        points.push([ex, ey - MIN_GAP])
    } else {
        let y1 = ey >= 0 ? -MIN_GAP : ey - MIN_GAP
        points.push([0, y1])
        points.push([ex, y1])
    }
    return points
}
function calcFromTopToBottomConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    if (ey <= -MIN_GAP * 2) {
        if (ex != 0) {
            points.push([0, ey / 2])
            points.push([ex, ey / 2])
        }
    } else {
        let vd = ex >= 0 ? -1 : 1
        let y1 = ey >= sh ? ey + MIN_GAP : sh + MIN_GAP
        points.push([0, -MIN_GAP])
        if (Math.abs(ex) <= vmg) {
            points.push([vd * vmg / 2, -MIN_GAP])
            points.push([vd * vmg / 2, y1])
            points.push([ex, y1])
        } else {
            points.push([ex / 2, -MIN_GAP])
            points.push([ex / 2, ey + MIN_GAP])
            points.push([ex, ey + MIN_GAP])
        }
    }
    return points
}

function calcFromBottomToLeftConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    if (ey >= vmg) {
        let x1 = ex > MIN_GAP ? 0 : ex - MIN_GAP
        points.push([0, ey / 2])
        points.push([x1, ey / 2])
        points.push([x1, ey])
    } else {
        if (ex <= -hmg / 2 + MIN_GAP) {
            let y1 = ex <= tw / 2 ? MIN_GAP : ey + th / 2 + MIN_GAP
            points.push([0, y1])
            points.push([ex - MIN_GAP, y1])
            points.push([ex - MIN_GAP, ey])
        } else if (ex > -hmg / 2 + MIN_GAP && ex < hmg) {
            points.push([0, MIN_GAP])
            points.push([-hmg / 2, MIN_GAP])
            points.push([-hmg / 2, ey])
        } else if (ex >= hmg) {
            if (ey >= MIN_GAP) {
                points.push([0, ey])
            } else {
                points.push([0, MIN_GAP])
                points.push([ex / 2, MIN_GAP])
                points.push([ex / 2, ey])
            }
        }
    }
    return points
}
function calcFromBottomToRightConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    let v1 = sw / 2 + MIN_GAP
    if (ey >= vmg) {
        let x1 = ex < -MIN_GAP ? 0 : ex + MIN_GAP
        points.push([0, ey / 2])
        points.push([x1, ey / 2])
        points.push([x1, ey])
    } else {
        if (ex >= hmg / 2) {
            let y1 = ex >= tw / 2 ? MIN_GAP : ey - th / 2 + MIN_GAP
            points.push([0, y1])
            points.push([ex + MIN_GAP, y1])
            points.push([ex + MIN_GAP, ey])
        } else if (ex < hmg / 2 && ex > -hmg) {
            points.push([0, MIN_GAP])
            points.push([hmg / 2 + MIN_GAP, MIN_GAP])
            points.push([hmg / 2 + MIN_GAP, ey])
        } else if (ex <= -hmg) {
            if (ey >= MIN_GAP) {
                points.push([0, ey])
            } else {
                points.push([0, MIN_GAP])
                points.push([ex / 2, MIN_GAP])
                points.push([ex / 2, ey])
            }
        }
    }
    return points
}
function calcFromBottomToTopConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    if (ey >= MIN_GAP) {
        if (ey != 0) {
            points.push([0, ey / 2])
            points.push([ex, ey / 2])
        }
    } else {
        if (Math.abs(ex) > hmg) {
            points.push([0, MIN_GAP])
            points.push([ex / 2, MIN_GAP])
            points.push([ex / 2, ey - MIN_GAP])
        } else {
            let x1 = ex <= 0 ? ex - tw / 2 - MIN_GAP : ex + tw / 2 + MIN_GAP
            points.push([0, MIN_GAP])
            points.push([x1, MIN_GAP])
            points.push([x1, ey - MIN_GAP])
        }
        points.push([ex, ey - MIN_GAP])
    }
    return points
}
function calcFromBottomToBottomConnectorPoints(ex, ey, sw, sh, tw, th, hmg, vmg) {
    let points = []
    if (Math.abs(ex) <= hmg / 2 + MIN_GAP) {
        let vd = ex >= 0 ? -1 : 1
        let hd = ey >= MIN_GAP ? 1 : -1
        let x1 = (ey <= sh + MIN_GAP ? 0 : ex) + (hmg / 2 + MIN_GAP) * vd * hd
        points.push([0, MIN_GAP])
        points.push([x1, MIN_GAP])
        points.push([x1, ey + MIN_GAP])
        points.push([ex, ey + MIN_GAP])
    } else {
        let y1 = ey <= 0 ? MIN_GAP : ey + MIN_GAP
        points.push([0, y1])
        points.push([ex, y1])
    }
    return points
}
// 计算连接点的方法对象
const calcConnectorPointsFunctions = {
    left: {
        left: calcFromLeftToLeftConnectorPoints,
        right: calcFromLeftToRightConnectorPoints,
        top: calcFromLeftToTopConnectorPoints,
        bottom: calcFromLeftToBottomConnectorPoints
    },
    right: {
        left: calcFromRightToLeftConnectorPoints,
        right: calcFromRightToRightConnectorPoints,
        top: calcFromRightToTopConnectorPoints,
        bottom: calcFromRightToBottomConnectorPoints
    },
    top: {
        left: calcFromTopToLeftConnectorPoints,
        right: calcFromTopToRightConnectorPoints,
        top: calcFromTopToTopConnectorPoints,
        bottom: calcFromTopToBottomConnectorPoints
    },
    bottom: {
        left: calcFromBottomToLeftConnectorPoints,
        right: calcFromBottomToRightConnectorPoints,
        top: calcFromBottomToTopConnectorPoints,
        bottom: calcFromBottomToBottomConnectorPoints
    }
}

/**
 * 计算中间顶点
 * @param  {String} begin 开始位置
 * @param  {String} end   结束位置
 */
function calcCentralPoints(begin, end) {
    // 获取路线的计算方法
    let fn = calcConnectorPointsFunctions[begin][end]
    /**
     * 处理参数
     * 参数处理后将传入8个参数给路线计算方法分别，ex,ey,sw,sh,tw,th,hmg,vmg
     * @param  {Number} x  结束点X轴
     * @param  {Number} y  结束点Y轴
     * @param  {Attribute} sourceAttribute 开始节点的属性
     * @param  {Attribute} targetAttribute 结束节点的属性
     */
    return function(ex, ey, sourceAttribute, targetAttribute) {
        let horizontalMiniGap = MIN_GAP * 2 + (sourceAttribute.width + targetAttribute.width) / 2
        let verticalMiniGap = MIN_GAP * 2 + (sourceAttribute.height + targetAttribute.height) / 2
        return fn(ex, ey, sourceAttribute.width, sourceAttribute.height, targetAttribute.width, targetAttribute.height, horizontalMiniGap, verticalMiniGap) || []
    }
}

// --------------------------------------------------下面是对外访问的函数-------------------------------------------------- //
/**
 * 计算连接器顶点
 * @param {Array} prev 开始节点信息
 * @param {Array} next 结束节点信息
 * @param {Number} ex 结束点X坐标
 * @param {Number} ey 结束点Y坐标
 * @param {Object} graph 图形信息
 */
function calcConnectorPoints(prev, next, ex, ey, graph) {
    let source = getElementById(prev[0], graph)
    let target = getElementById(next[0], graph)
    return calcLinePoints(ex, ey, prev[1], next[1], source.attribute, target.attribute)
}

function calcLinePoints(ex, ey, sp, tp, sa, ta) {
    let points = []
    // 计算中间的顶点
    let centralPoints = calcCentralPoints(sp, tp)(ex, ey, sa, sa)
    points.push([0, 0])
    points = points.concat(centralPoints)
    points.push([ex, ey])
    return points
}

/**
 * 计算菱形顶点
 * @param {Object} attribute 节点属性
 */
function calcDiamondPoints(attribute) {
    let points = calcLinkPoints(attribute)
    return points.map(item => item.axis.join(',')).join(' ')
}

/**
 * 计算连接点
 * @param {Object} attribute 节点属性
 */
function calcLinkPoints(attribute) {
    let { width, height } = attribute
    return [
        {
            position: POSITION_TOP,
            axis: [width / 2, 0]
        },
        {
            position: POSITION_RIGHT,
            axis: [width, height / 2]
        },
        {
            position: POSITION_BOTTOM,
            axis: [width / 2, height]
        },
        {
            position: POSITION_LEFT,
            axis: [0, height / 2]
        }
    ]
}

/**
 * 计算连接点的绝对坐标
 * @param {Object} element 节点数据
 * @param {Array} axis 连接点相对坐标
 */
function calcPointFixedAxis(element, axis) {
    let { x, y } = element.attribute
    return {
        x: x + axis[0],
        y: y + axis[1]
    }
}

export { calcDiamondPoints, calcLinkPoints, calcPointFixedAxis, calcConnectorPoints, calcLinePoints }
