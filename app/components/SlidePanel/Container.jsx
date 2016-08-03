import React, {Component, PropTypes} from 'react';
import Layout from './Layout';
export default class SlidePanelContainer extends Component {
    state = {
        queue: [],
        options: {
            modal: false,
            position: 'right'
        }
    }
    _showLayout(layout) {
        const {modal, zIndex} = layout.options;
        if (modal) {
            this.refs.backdrop.style.display = 'block';
        }
        // 隐藏上一个
        const {queue} = this.state;
        if (queue.length > 1) {
            const last = queue[queue.length - 2];
            this._hideLayout(last);
        }
        // 显示当前
        this.refs['layout' + zIndex].show();
        layout.shown = true;
    }
    _hideLayout(layout) {
        if (!layout) {
            return;
        }
        const {modal, zIndex} = layout.options;
        if (modal) {
            this.refs.backdrop.style.display = 'none';
        }
        this.refs['layout' + zIndex].hide();
        setTimeout(() => {
            const queue = _.remove(this.state.queue, item => {
                return item.options.zIndex != layout.options.zIndex;
            })
            this.setState({queue});
        }, 500);
    }
    _onBodyClick(e) {
        this._hideLayout(_.last(this.state.queue))
    }
    addLayout(panel, configs) {
        const {queue, options} = this.state;
        const last = _.last(this.state.queue);
        configs = _.merge({}, options, configs);
        configs.zIndex = last && last.options.zIndex + 1 || 1001;
        configs.panel = panel;
        queue.push({options: _.cloneDeep(configs), shown: false});
        this.setState({queue});
    }
    componentWillMount() {
        document.addEventListener('click', this._onBodyClick.bind(this), false);
    }
    render() {
        return (
            <div className="sp-container">
                {this.state.queue.map(item => {
                    const {panel, zIndex, position} = item.options;
                    return <Layout key={zIndex} ref={'layout' + zIndex} zIndex={zIndex} position={position}>{panel}</Layout>;
                })}
                <div ref="backdrop" className="sp-backdrop"></div>
            </div>
        );
    }
    componentDidUpdate() {
        const layout = _.last(this.state.queue);
        if (layout && !layout.shown) {
            this._showLayout(layout);
        }
    }
    componentWillUnmount() {
        document.removeEventListener('click', this._onBodyClick.bind(this));
    }
}
