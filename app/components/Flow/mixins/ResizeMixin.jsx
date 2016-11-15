const Resize = {
    Mixin: {
        /**
         * 缓存坐标和面积
         */
        __cache(x, y, w, h) {
            this._cacheX = x;
            this._cacheY = y;
            this._cacheWidth = w;
            this._cacheHeight = h;
        },
        __onResizeStart(e) {
            this.refs.container.moveToTop();
            this.state.draggable = false;
            const {x, y, width, height} = this.state;
            this.__cache(x, y, width, height);
            this._onResizeStart(e);
            this.setStatus(this._STATUS_RESIZE_);
        },
        __onResize(e) {
            this._onResize(e);
        },
        __onResizeEnd(e) {
            this.state.draggable = true;
            this.__cache(0, 0, 0, 0);
            this._onResizeEnd(e)
            this.setStatus(this._STATUS_ACTIVE_);
        },
        _onResizeStart() {},
        _onResize() {},
        _onResizeEnd() {},
        _getSpins(x, y, width, height) {
            const xMax = x + width;
            const yMax = y + height;
            return {
                'nw-resize': [
                    xMax, yMax
                ],
                'ne-resize': [
                    x, yMax
                ],
                'sw-resize': [
                    xMax, y
                ],
                'se-resize': [x, y]
            }
        },
        _resize(e, state, spins, isEqual) {
            const {x, y, width, height, minArea} = state;
            const px = spins[e.position][0];
            const py = spins[e.position][1];
            const rx = e.target.attrs.x;
            const ry = e.target.attrs.y;
            let nx = x,
                ny = y,
                nw = width,
                nh = height;
            switch (e.position) {
                case 'nw-resize': //左上
                    nw = width - rx > minArea && width - rx || minArea;
                    nh = height - ry > minArea && height - ry || minArea;
                    nx = px - (isEqual && (nw > nh && nw || nh) || nw);
                    ny = py - (isEqual && (nw > nh && nw || nh) || nh);
                    break;
                case 'ne-resize': //右上
                    nw = rx > minArea && rx || minArea;
                    nh = height - ry > minArea && height - ry || minArea;
                    nx = x;
                    ny = py - (isEqual && (nw > nh && nw || nh) || nh);
                    break;
                case 'sw-resize': //左下
                    nw = width - rx > minArea && width - rx || minArea;
                    nh = ry > minArea && ry || minArea;
                    nx = px - (isEqual && (nw > nh && nw || nh) || nw);
                    ny = y;
                    break;
                case 'se-resize': //右下
                    nw = rx > minArea && rx || minArea;
                    nh = ry > minArea && ry || minArea;
                    nx = x;
                    ny = y;
                    break;
            }
            return {x: nx, y: ny, width: nw, height: nh};
        },
        _getResizeEvents() {
            return {onResizeStart: this.__onResizeStart.bind(this), onResize: this.__onResize.bind(this), onResizeEnd: this.__onResizeEnd.bind(this)};
        }
    }
};
export default Resize.Mixin;
