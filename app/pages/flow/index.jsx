import React from 'react';
import uuid from 'uuid';
import Layout, { LAYOUT_WIDTH, LAYOUT_HEIGHT, SHAPE_RECT, SHAPE_LINE } from './layout';
import './index.css';
export default class Flow extends React.Component {
    state = {
        data: {
            tasks: new Map(),
            links: new Map()
        },
        graph: [],
        element: null
    }
    /**
     * 将服务器数据解析成操作数据
     */
    _parse() { }
    /**
     * 将操作数据还原成服务器数据
     */
    _reset() { }
    /**
     * 将操作数据翻译成图形数据
     */
    _translate() { }
    _createElement(id) {
        return {
            name: '',
            color: '#66c484',
            graphKey: id,
            button: {
                redo: false,
                continue: false,
                interrupt: false,
                onRedoClick: this._onRedoClick.bind(this, id),
                onContinueClick: this._onContinueClick.bind(this, id),
                onInterruptClick: this._onInterruptClick.bind(this, id)
            },
            data: {}
        }
    }
    _onAdd() {
        this.refs.layout.add(shape => {
            let task = this._createElement(shape.id);
            this.state.data.tasks.set(shape.id, task);
        });
    }
    _onLink(id, source, target) {
        let link = this._createElement(id);
        link.data.prev = source;
        link.data.next = target;
        this.state.data.links.set(id, link);
    }
    _onClean() {
        let nullElement = this._createElement('');
        this.setState({ element: nullElement });
    }
    _onDelete(shape) {
        let { tasks, links } = this.state.data;
        if (shape.type == SHAPE_RECT) {
            tasks.delete(shape.id);
        } else if (shape.type == SHAPE_LINE) {
            links.delete(shape.id);
        }
    }
    _onSelect(shape) {
        let { data, element } = this.state;
        let { tasks, links } = data;
        if (shape.id == 'start' || element.graphKey == shape.id) {
            return;
        }
        switch (shape.type) {
            case SHAPE_RECT:
                element = tasks.get(shape.id);
                break;
            case SHAPE_LINE:
                element = links.get(shape.id);
                break;
        }
        this.setState({ element });
    }
    _onSetLink() {
        this.refs.layout.setStatus(Layout.STATUS_LINKING);
    }
    _onNameChange(e) {
        let { element } = this.state;
        element.name = e.target.value;
        if (element.graphKey) {
            this.refs.layout.setText(element.graphKey, element.name);
        }
        this.setState({ element });
    }
    _onColorChange(e) {
        let { element } = this.state;
        element.color = e.target.value;
        if (element.graphKey) {
            this.refs.layout.setBackground(element.graphKey, element.color);
        }
        this.setState({ element });
    }
    _onButtonChange(e) {
        let { element } = this.state;
        if (!element.graphKey) {
            return;
        }
        element.button[e.target.value] = e.target.checked;
        this.refs.layout.setButton(element.graphKey, element.button);
        this.setState({ element });
    }
    _onRedoClick(id) {
        console.log('redo', id);
    }
    _onContinueClick(id) {
        console.log('continue', id);
    }
    _onInterruptClick(id) {
        console.log('interrupt', id);
    }
    render() {
        let events = this._events;
        let { element, graph } = this.state;
        graph = JSON.parse(JSON.stringify(graph));
        let onButtonChange = this._onButtonChange.bind(this)
        return (
            <div className="content">
                <form className="form-inline">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" style={{ width: 250 }} placeholder="请输入节点名称" value={element.name} onChange={this._onNameChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label>Color</label>
                        <input type="color" className="form-control" style={{ width: 50 }} value={element.color} onChange={this._onColorChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label>Button</label>
                        <div className="checkbox">
                            <label><input type="checkbox" name="button" value="redo" onChange={onButtonChange} checked={element.button.redo} />重做</label>
                        </div>
                        <div className="checkbox">
                            <label><input type="checkbox" name="button" value="continue" onChange={onButtonChange} checked={element.button.continue} />继续</label>
                        </div>
                        <div className="checkbox">
                            <label><input type="checkbox" name="button" value="interrupt" onChange={onButtonChange} checked={element.button.interrupt} />中断</label>
                        </div>
                    </div>
                    <button type="button" className="btn btn-default" onClick={this._onAdd.bind(this)}>添加任务</button>
                    <button type="button" className="btn btn-info" onClick={this._onSetLink.bind(this)}>连接</button>
                </form>
                <div className="layout">
                    <Layout ref="layout" width={LAYOUT_WIDTH} height={LAYOUT_HEIGHT} data={graph} {...events} />
                </div>
            </div>
        )
    }
    componentWillMount() {
        this._events = {
            onLink: this._onLink.bind(this),
            onClean: this._onClean.bind(this),
            onDelete: this._onDelete.bind(this),
            onSelect: this._onSelect.bind(this)
        };
        this.state.element = this._createElement('');
    }
}
