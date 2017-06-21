import uuid from 'uuid';
import { SHAPE_WIDTH, SHAPE_HEIGHT, POSITION_TOP, POSITION_RIGHT, POSITION_BOTTOM, POSITION_LEFT } from './constants';

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
/**
 * 创建线的路径
 * @param {*} x1 开始x轴坐标
 * @param {*} y1 开始y轴坐标
 * @param {*} x2 结束x轴坐标
 * @param {*} y2 结束y轴坐标
 */
export function createLinePath(x1, y1, x2, y2, hasArrow) {
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
    if (hasArrow) {
        points.push('M' + x2 + ',' + y2);
        points.push('L' + (x2 - 5) + ',' + (y2 - 5));
        points.push('M' + x2 + ',' + y2);
        points.push('L' + (x2 - 5) + ',' + (y2 + 5));
    }
    return points.join(' ');
}
export function map2array(map) {
    let arr = [];
    map.forEach(function (item) {
        arr.push(item);
    });
    return arr;
}
export function array2map(arr, field) {
    let map = new Map();
    arr.forEach(function (item) {
        map.set(item[field], item);
    });
    return map;
}
export function queryId(node) {
    let id = false;
    while (node && node.tagName && !id) {
        id = node.getAttribute('id');
        node = node.parentNode;
    }
    return id;
}
export function getTextWidth(text) {
    text = text || '';
    let node = document.getElementById('text');
    node.innerHTML = text;
    return node.offsetWidth;
}
export function getLinkPoints(width, height) {
    let map = new Map();
    map.set(POSITION_TOP, [width / 2, 0]);
    map.set(POSITION_RIGHT, [width, height / 2]);
    map.set(POSITION_BOTTOM, [width / 2, height]);
    map.set(POSITION_LEFT, [0, height / 2]);
    return map;
}
export function getLinkPointAxis(element, position) {
    let { attrs, points } = element;
    let point = points.get(position);
    return [attrs.x + point[0], attrs.y + point[1]];
}