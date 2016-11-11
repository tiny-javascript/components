const Hover = {
    Mixin: {
        __onMouseEnter(e) {
            this._onMouseEnter(e);
            this.setStatus(this._STATUS_HOVER_);
        },
        __onMouseLeave(e) {
            // 恢复光标
            this.setCursor();
            let lastStatus = this._statusPool[this._statusPool.length - 1];
            if (lastStatus == this._STATUS_HOVER_) {
                lastStatus = this._statusPool[this._statusPool.length - 2];
            }
            this._onMouseLeave(e);
            this.setStatus(lastStatus);
        },
        _onMouseEnter() {},
        _onMouseLeave() {},
        _getHoverEvents() {
            return {onmouseenter: this.__onMouseEnter.bind(this), onmouseleave: this.__onMouseLeave.bind(this)}
        }
    }
}
export default Hover.Mixin;
