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
        _getResizeEvents() {
            return {onResizeStart: this.__onResizeStart.bind(this), onResize: this.__onResize.bind(this), onResizeEnd: this.__onResizeEnd.bind(this)};
        }
    }
};
export default Resize.Mixin;
