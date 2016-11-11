const Click = {
    Mixin: {
        __onClick(e) {
            this._onClick(e);
            this.setStatus(this._STATUS_ACTIVE_);
        },
        _onClick(e) {},
        _getClickEvents() {
            return {onclick: this.__onClick.bind(this)}
        }
    }
}
export default Click.Mixin;
