import uuid from 'uuid';
import { SHAPE_RECT, SHAPE_CIRCLE, SHAPE_LINE, SHAPE_WIDTH, SHAPE_HEIGHT } from './layout';
/**
 * 创建矩形
 * @param {*} x x轴坐标
 * @param {*} y y轴坐标
 */
function createReat(x, y) {
    let id = uuid.v4();
    return {
        id,
        type: SHAPE_RECT,
        lines: {
            in: [],
            out: []
        },
        attrs: {
            x: x,
            y: y,
            width: SHAPE_WIDTH,
            height: SHAPE_HEIGHT
        }
    }

}
/**
 * 创建圆形
 * @param {*} x x轴坐标
 * @param {*} y y轴坐标
 * @param {*} id 唯一标识
 */
function createCircle(x, y, id) {
    id = id || uuid.v4();
    return {
        id: id,
        type: SHAPE_CIRCLE,
        lines: {
            in: [],
            out: []
        },
        attrs: {
            x: x,
            y: y,
            r: SHAPE_HEIGHT / 2,
            width: SHAPE_HEIGHT,
            height: SHAPE_HEIGHT,
            text: '开始'
        }
    }
}
/**
 * 创建连线
 * @param {*} source 开始对象
 * @param {*} target 结束对象
 */
function createLine(source, target) {
    let id = uuid.v4();
    return {
        id,
        type: SHAPE_LINE,
        from: source.id,
        to: target.id,
        attrs: {
            x1: source.x,
            y1: source.y,
            x2: target.x,
            y2: target.y
        }
    }
}


/**
 * 将map转换成数组
 * @param {*} map 
 */
function translate(map) {
    let tmp = [];
    map.forEach(value => tmp.push(value));
    return tmp;
}

/**
 * 创建线的路径
 * @param {*} x1 开始x轴坐标
 * @param {*} y1 开始y轴坐标
 * @param {*} x2 结束x轴坐标
 * @param {*} y2 结束y轴坐标
 */
function createLinePath(x1, y1, x2, y2) {
    if (x1 == x2 && y1 == y2) {
        return false;
    }
    x1 = x1 - 0.5;
    y1 = y1 - 0.5;
    x2 = x2 - 0.5;
    y2 = y2 - 0.5;
    let gap = 50; // 最小间隙
    let radius = 3; // 圆角半径
    let pos = y1 - y2 >= 0 ? 1 : -1;
    let corners = getCorners(radius);
    let points = ['M' + x1 + ',' + y1];
    points.push('H' + (x1 > x2 && (x1 + gap) || (x1 + (x2 - x1) / 2)));
    if (x1 > x2) { // 终点在左边
        points.push(pos == 1 && corners.up.bottom.right || corners.down.top.right);
        if (y1 >= y2) { // 在上边
            if (y1 - y2 >= SHAPE_HEIGHT + gap) {  // 线从中间过
                points.push('V' + (y1 + (y2 - y1) / 2));
                points.push(corners.up.top.right);
                points.push('H' + (x2 - gap));
                points.push(corners.up.bottom.left);
                points.push('V' + (y2 + radius));
                points.push(corners.up.top.left);
            } else { // 线从上边过
                points.push('V' + (y2 - SHAPE_HEIGHT));
                points.push(corners.up.top.right);
                points.push('H' + (x2 - gap));
                points.push(corners.down.top.left);
                points.push('V' + (y2 - radius));
                points.push(corners.down.bottom.left);
            }
        } else { // 在下边
            if (y2 - y1 >= SHAPE_HEIGHT + gap) { // 线从中间过
                points.push('V' + (y1 + (y2 - y1) / 2));
                points.push(corners.down.bottom.right);
                points.push('H' + (x2 - gap));
                points.push(corners.down.top.left);
                points.push('V' + (y2 - radius));
                points.push(corners.down.bottom.left);
            } else { // 线从下边过
                points.push('V' + (y2 + SHAPE_HEIGHT));
                points.push(corners.down.bottom.right);
                points.push('H' + (x2 - gap));
                points.push(corners.up.bottom.left);
                points.push('V' + (y2 + radius));
                points.push(corners.up.top.left);
            }
        }
    } else if (x1 < x2) { // 终点在右边
        if (y1 != y2) {
            points.push(pos == 1 && corners.up.bottom.right || corners.down.top.right);
            points.push('V' + (y2 + radius * pos));
            points.push(pos == 1 && corners.up.top.left || corners.down.bottom.left);
        }
    }
    points.push('H' + x2);
    return points.join(' ');
}
/**
 * 创建圆角
 * @param {*} x 终点X坐标
 * @param {*} y 终点y坐标
 * @param {*} r 半径
 * @param {*} d 方向
 */
function createLineCorner(x, y, r, d) {
    let attrs = [];
    attrs.push(r); // x轴半径
    attrs.push(r); // y轴半径
    attrs.push(0); // x轴旋转角度
    attrs.push(0); // 角度大小，0是小角，1是大角
    attrs.push(d); // 弧线方向, 0是逆时针，1是顺时针
    attrs.push(x);
    attrs.push(y);
    return 'a' + attrs.join(',');
}
/**
 * 获取所有圆角，up代表向上走，down代表向下走
 * @param {*} radius 圆角半径
 */
function getCorners(radius) {
    return {
        up: {
            top: {
                left: createLineCorner(radius, -radius, radius, 1),
                right: createLineCorner(-radius, -radius, radius, 0)
            },
            bottom: {
                left: createLineCorner(-radius, -radius, radius, 1),
                right: createLineCorner(radius, -radius, radius, 0)
            }
        },
        down: {
            top: {
                left: createLineCorner(-radius, radius, radius, 0),
                right: createLineCorner(radius, radius, radius, 1)
            },
            bottom: {
                left: createLineCorner(radius, radius, radius, 0),
                right: createLineCorner(-radius, radius, radius, 1)
            }
        }
    }
}

export { createReat, createCircle, createLine, createLinePath, translate };