import React from 'react';
import AbstractElement from '../common/AbstractElement';
import mixin from 'decorators/mixin';
import HoverMixin from '../mixins/HoverMixin';
@mixin(HoverMixin)
export default class BasicPoint extends AbstractElement {
    componentWillMount() {
        this.state.radius = this.props.radius;
    }
    shouldComponentUpdate(props, state) {
        return this.state != state;
    }
}
