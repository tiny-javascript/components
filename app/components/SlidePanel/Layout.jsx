import React, {Component, PropTypes} from 'react';
export default class SlidePanelLayout extends Component {
    static propTypes = {
        position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
        zIndex: PropTypes.number.isRequired,
        children: PropTypes.element.isRequired
    }
    _click(e) {
        e.stopPropagation();
    }
    show() {
        const cls = this.refs.layout.className;
        setTimeout(() => {
            this.refs.layout.className = cls + ' active';
        }, 10);
    }
    hide() {
        const cls = this.refs.layout.className;
        setTimeout(() => {
            this.refs.layout.className = cls.replace('active', 'move');
        }, 10);
    }
    render() {
        const {position, zIndex} = this.props;
        const styles = {
            zIndex
        };
        return (
            <div ref="layout" className={"sp-layout sp-" + position} style={styles}>{this.props.children}</div>
        );
    }
    componentDidMount() {
        this.refs.layout.addEventListener('click', this._click.bind(this), false);
    }
    componentWillUnmount() {
        this.refs.layout.removeEventListener('click', this._click.bind(this));
    }
}
