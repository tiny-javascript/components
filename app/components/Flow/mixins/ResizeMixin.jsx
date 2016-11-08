const Resize = {
    Mixin: {
        __onResizeStart(e) {
            this.setStatus(this.STATUS_RESIZE);
            this._onResizeStart(e);
        },
        __onResize(e) {
            this._onResize(e);
        },
        __onResizeEnd(e) {
            this.setStatus(this.STATUS_ACTIVE);
            this._onResizeEnd(e)
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
