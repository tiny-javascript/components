import React from 'react';
import BasicElement from '../common/BasicElement';
export default class BasicTask extends BasicElement {
    /**
     * 变形中
     */
    _onResize(e) {
        const state = this._resize(e, this.state, this._spins);
        this.setState(state);
        this._refreshPoints();
    }
}
