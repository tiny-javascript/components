import EventContainer from '../common/EventContainer';
const Click = {
    Mixin: {
        __onClick(e) {
            EventContainer.executeEvent('element.blur', [this.refs.container]);
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
