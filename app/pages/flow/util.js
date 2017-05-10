function createRect(width, height, radius) {
    let offset = 0.5;
    width = width + offset;
    height = height + offset;
    if (radius) {
        return createRectWithRadius(width, height, radius, offset);
    } else {
        let path = 'M' + offset + ',' + offset;
        let points = [
            width,
            offset,
            width,
            height,
            offset,
            height,
            offset,
            offset
        ];
        return path + 'L' + points.join(' ');
    }
}
function createRectWithRadius(width, height, radius, offset) {
    let createCorner = function(ex, ey) {
        return 'A' + radius + ',' + radius + ' 0 0,1 ' + ex + ',' + ey;
    }
    let createLine = function(ex, ey) {
        return 'L' + ex + ',' + ey;
    }
    let path = 'M' + offset + ',' + (offset + radius);
    let points = [
        createCorner(offset + radius, offset),
        createLine(width - radius, offset),
        createCorner(width, offset + radius),
        createLine(width, height - radius),
        createCorner(width - radius, height),
        createLine(offset + radius, height),
        createCorner(offset, height - radius),
        createLine(offset, offset + radius)
    ];
    return path + ' ' + points.join(' ');
}
export {createRect}
