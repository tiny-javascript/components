import React from 'react';
import AbstractElement from '../common/AbstractElement';
import mixin from 'decorators/mixin';
import HoverMixin from '../mixins/HoverMixin';
@mixin(HoverMixin)
export default class BasicPoint extends AbstractElement {
    setVisible(visible) {
        this.setState({visible});
    }
    componentWillMount() {
        this.state.radius = this.props.radius;
        this.state.visible = this.props.visible;
    }
    shouldComponentUpdate(props, state) {
        return this.state != state;
    }
}
