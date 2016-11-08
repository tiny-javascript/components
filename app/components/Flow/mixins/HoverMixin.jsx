const Hover = {
    Mixin: {
        __onMouseEnter(e) {
            this._onMouseEnter(e);
        },
        __onMouseLeave(e) {
            // 恢复光标
            this.setCursor();
            this._onMouseLeave(e);
        },
        _onMouseEnter() {},
        _onMouseLeave() {},
        _getHoverEvents() {
            return {onmouseenter: this.__onMouseEnter.bind(this), onmouseleave: this.__onMouseLeave.bind(this)}
        }
    }
}
export default Hover.Mixin;
