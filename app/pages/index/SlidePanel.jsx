import React from 'react';
import SlidePanelComponent from 'components/SlidePanel/Index';
export default class SlidePanelPage extends React.Component {
    _onShowLeft(e) {
        e.stopPropagation();
        const node = <span>左边面板</span>;
        SlidePanelComponent.display(node, {position: 'left'});
    }
    _onShowRight(e) {
        e.stopPropagation();
        const node = <span>右边面板</span>;
        SlidePanelComponent.display(node, {position: 'right'});
    }
    _onShowTop(e) {
        e.stopPropagation();
        const node = <span>上边面板</span>;
        SlidePanelComponent.display(node, {
            position: 'top',
            modal: true
        });
    }
    _onShowBottom(e) {
        e.stopPropagation();
        const node = <span>下边面板</span>;
        SlidePanelComponent.display(node, {
            position: 'bottom',
            modal: true
        });
    }
    render() {
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">SlidePanel-侧滑组件</div>
                <div className="panel-body">
                    <button ref="btnLeft" className="btn btn-primary" onClick={this._onShowRight.bind(this)}>左边出来</button>
                    <button ref="btnRight" className="btn btn-primary" onClick={this._onShowRight.bind(this)}>右边出来</button>
                    <button ref="btnTop" className="btn btn-primary" onClick={this._onShowRight.bind(this)}>顶部出来</button>
                    <button ref="btnBottom" className="btn btn-primary" onClick={this._onShowRight.bind(this)}>底部出来</button>
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.refs.btnLeft.addEventListener('click', this._onShowLeft.bind(this), false);
        this.refs.btnRight.addEventListener('click', this._onShowRight.bind(this), false);
        this.refs.btnTop.addEventListener('click', this._onShowTop.bind(this), false);
        this.refs.btnBottom.addEventListener('click', this._onShowBottom.bind(this), false);
    }
    componentWillUnmount() {
        this.refs.btnLeft.removeEventListener('click', this._onShowLeft.bind(this));
        this.refs.btnRight.removeEventListener('click', this._onShowRight.bind(this));
        this.refs.btnTop.removeEventListener('click', this._onShowTop.bind(this));
        this.refs.btnBottom.removeEventListener('click', this._onShowBottom.bind(this));
    }
}
