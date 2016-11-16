import EventContainer from '../common/EventContainer';
const Connector = {
    Mixin: {
        __onConnectStart(e) {
            this.state.draggable = false;
            EventContainer.executeEvent('connector.create',[]);
            this._onConnectStart(e);
            this.setStatus(this._STATUS_CONNECT_);
        },
        __onConnect(e) {
            console.log('connect');
            this._onConnect(e);
        },
        __onConnectEnd(e) {
            this.state.draggable = true;
            this._onConnectEnd(e);
            this.setStatus(this._STATUS_ACTIVE_);
        },
        _onConnectStart() {},
        _onConnect() {},
        _onConnectEnd() {},
        _getConnectEvents() {
            return {onConnectStart: this.__onConnectStart.bind(this), onConnect: this.__onConnect.bind(this), onConnectEnd: this.__onConnectEnd.bind(this)};
        }
    }
};
export default Connector.Mixin;
