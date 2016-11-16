import React from 'react';
import AbstractElement from '../common/AbstractElement';
import mixin from 'decorators/mixin';
import HoverMixin from '../mixins/HoverMixin';
import DragMixin from '../mixins/DragMixin';
@mixin(HoverMixin, DragMixin)
export default class BasicPoint extends AbstractElement {
    setVisible(visible) {
        this.setState({visible});
    }
    componentWillMount() {
        this._dragEvents = this._getDragEvents();
        this._hoverEvents = this._getHoverEvents();
        this.state.radius = this.props.radius;
        this.state.visible = this.props.visible;
    }
    shouldComponentUpdate(props, state) {
        return this.state != state;
    }
}
