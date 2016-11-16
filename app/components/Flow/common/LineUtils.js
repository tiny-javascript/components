const MIN_PADDING = 50;
const DIRECTION_NORTH = 'north';
const DIRECTION_SOUTH = 'south';
const DIRECTION_EAST = 'east';
const DIRECTION_WEST = 'west';
const DIRECTION_SOUTHEAST = 'southeast';
const DIRECTION_NORTHEAST = 'northeast';
const DIRECTION_SOUTHWEST = 'southwest';
const DIRECTION_NORTHWEST = 'northwest';
/**
 * 计算结束点相对于开始点的方位
 */
function calcPostion(sx, sy, ex, ey) {
    let direction = '';
    // 正东
    if (sx < ex && sy == ey) {
        direction = DIRECTION_EAST;
    }
    // 正西
    if (sx > ex && sy == ey) {
        direction = DIRECTION_WEST;
    }
    // 正南
    if (sx == ex && sy < ey) {
        direction = DIRECTION_SOUTH;
    }
    // 正北
    if (sx == ex && sy > ey) {
        direction = DIRECTION_NORTH;
    }
    // 东南
    if (sx < ex && sy < ey) {
        direction = DIRECTION_SOUTHEAST;
    }
    // 东北
    if (sx < ex && sy > ey) {
        direction = DIRECTION_NORTHEAST;
    }
    // 西南
    if (sx > ex && sy < ey) {
        direction = DIRECTION_SOUTHWEST;
    }
    // 西北
    if (sx > ex && sy > ey) {
        direction = DIRECTION_NORTHWEST;
    }
    return direction;
}
/**
 * 根据方位和连接对象计算偏移量
 */
function calcOffset(startElement, endElement, position) {
    let offset = 0;
    switch (position) {
        case DIRECTION_NORTH:
            break;
        case DIRECTION_SOUTH:
            break;
        case DIRECTION_EAST:
            break;
        case DIRECTION_WEST:
            break;
        case DIRECTION_SOUTHEAST:
            break;
        case DIRECTION_NORTHEAST:
            break;
        case DIRECTION_SOUTHWEST:
            break;
        case DIRECTION_NORTHWEST:
            break;
    }
    return offset;
}
/*从上面开始*/
function createLinePointsFromNorthToNorth(sx, sy, ex, ey, position, offset) {
    let middlePoints = [];
    switch (position) {
        case DIRECTION_EAST:
        case DIRECTION_WEST:
            middlePoints.push(sx);
            middlePoints.push(sy - MIN_PADDING);
            middlePoints.push(ex);
            middlePoints.push(ey - MIN_PADDING);
            break;
        case DIRECTION_NORTH:
            break;
        case DIRECTION_SOUTH:
            break;
        case DIRECTION_SOUTHEAST:
            break;
        case DIRECTION_NORTHEAST:
            break;
        case DIRECTION_SOUTHWEST:
            break;
        case DIRECTION_NORTHWEST:
            break;
    }
    return [sx, sy].concat(middlePoints).concat([ex, ey]);
}
function createLinePointsFromNorthToEast(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromNorthToSouth(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromNorthToWest(sx, sy, ex, ey, position, offset) {}
/*从右面开始*/
function createLinePointsFromEastToNorth(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromEastToEast(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromEastToSouth(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromEastToWest(sx, sy, ex, ey, position, offset) {}
/*从下面开始*/
function createLinePointsFromSouthToNorth(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromSouthToEast(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromSouthToSouth(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromSouthToWest(sx, sy, ex, ey, position, offset) {}
/*从左面开始*/
function createLinePointsFromWestToNorth(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromWestToEast(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromWestToSouth(sx, sy, ex, ey, position, offset) {}
function createLinePointsFromWestToWest(sx, sy, ex, ey, position, offset) {}
function createExecuteFunc(direction) {
    let func = null;
    switch (direction) {
        case 'n2n':
            func = createLinePointsFromNorthToNorth;
            break;
        case 'n2e':
            func = createLinePointsFromNorthToEast;
            break;
        case 'n2s':
            func = createLinePointsFromNorthToSouth;
            break;
        case 'n2w':
            func = createLinePointsFromNorthToWest;
            break;
        case 'e2n':
            func = createLinePointsFromEastToNorth;
            break;
        case 'e2e':
            func = createLinePointsFromEastToEast;
            break;
        case 'e2s':
            func = createLinePointsFromEastToSouth;
            break;
        case 'e2w':
            func = createLinePointsFromEastToWest;
            break;
        case 's2n':
            func = createLinePointsFromSouthToNorth;
            break;
        case 's2e':
            func = createLinePointsFromSouthToEast;
            break;
        case 's2s':
            func = createLinePointsFromSouthToSouth;
            break;
        case 's2w':
            func = createLinePointsFromSouthToWest;
            break;
        case 'w2n':
            func = createLinePointsFromWestToNorth;
            break;
        case 'w2e':
            func = createLinePointsFromWestToEast;
            break;
        case 'w2s':
            func = createLinePointsFromWestToSouth;
            break;
        case 'w2w':
            func = createLinePointsFromWestToWest;
            break;
    }
    return func;
}
/**
 * 创建连接线坐标点
 * @param  {[type]} startAxis    [description]
 * @param  {[type]} startElement [description]
 * @param  {[type]} startPoint   [description]
 * @return {[type]}              [description]
 */
export function createLinePoints(startAxis, startElement, startPoint) {
    return function(endAxis, endElement, endPoint) {
        const type = startPoint.substr(0, 1) + '2' + endPoint.substr(0, 1);
        return function() {
            const sx = startAxis[0];
            const sy = startAxis[1];
            const ex = endAxis[0];
            const ey = endAxis[1];
            const position = calcPostion(sx, sy, ex, ey);
            const offset = calcOffset(startElement, endElement, position);
            return createExecuteFunc(type)(sx, sy, ex, ey, position, offset);
        }
    }
}
