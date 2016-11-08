const Click = {
    Mixin: {
        __onClick() {
            this.setStatus(this.STATUS_ACTIVE);
        },
        _onClick() {},
        _getClickEvents() {
            return {onclick: this.__onClick.bind(this)}
        }
    }
}
export default Click.Mixin;
