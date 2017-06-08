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
        graph: { x: 0, y: 0, nodes: [] },
        element: null
    }
    /**
     * 将服务器数据解析成操作数据
     */
    _parse(data) {
        let tasks = new Map();
        let links = new Map();
        data.forEach(item => {
            let task = this._createElement(item.graphKey);
            task.name = item.name;
            task.type = item.type;
            tasks.set(item.graphKey, task);
            item.nexts.forEach(next => {
                let link = this._createElement(next.graphKey);
                link.name = next.name;
                link.data = {
                    prev: item.graphKey,
                    next: next.task.graphKey
                }
                links.set(next.graphKey, link);
            });
        });
        return { tasks, links };
    }
    /**
     * 将操作数据还原成服务器数据
     */
    _reset() {
        let data = [];
        let dataMap = new Map();
        dataMap.set('start', {
            name: 'start',
            graphKey: 'start',
            prevs: [],
            nexts: []
        });
        let { tasks, links } = this.state.data;
        tasks.forEach(task => {
            dataMap.set(task.graphKey, {
                name: task.name,
                code: task.graphKey,
                graphKey: task.graphKey,
                type: task.type,
                prevs: [],
                nexts: []
            });
        });
        links.forEach(link => {
            let prevTask = dataMap.get(link.data.prev);
            let nextTask = dataMap.get(link.data.next);
            prevTask.nexts.push({
                name: link.name,
                graphKey: link.graphKey,
                task: {
                    code: nextTask.code,
                    graphKey: nextTask.graphKey
                },
                condExpr: []
            });
            nextTask.prevs.push({
                task: {
                    code: prevTask.code,
                    graphKey: prevTask.graphKey
                }
            });
        });
        dataMap.forEach(item => data.push(item));
        return data;
    }
    /**
     * 将操作数据翻译成图形数据
     */
    _translate() { }
    _createElement(id) {
        return {
            name: '',
            color: '#66c484',
            graphKey: id,
            type: '',
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
    _onSave() {
        let data = this._reset();
        let graph = this.refs.layout.getData();
        localStorage.setItem('data', JSON.stringify(data));
        localStorage.setItem('graph', JSON.stringify(graph));
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
    _onTypeChange(e) {
        let { element } = this.state;
        element.type = e.target.value;
        if (element.graphKey) {
            this.refs.layout.setType(element.graphKey, element.type);
        }
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
        let { element, graph, data } = this.state;
        graph = JSON.parse(JSON.stringify(graph));
        let onTypeChange = this._onTypeChange.bind(this);
        let onButtonChange = this._onButtonChange.bind(this);
        return (
            <div className="content">
                <form className="form-inline">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" style={{ width: 250 }} placeholder="请输入节点名称" value={element.name} onChange={this._onNameChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <div className="radio">
                            <label><input type="radio" name="type" value="workflow" onChange={onTypeChange} checked={element.type == 'workflow'} />编排</label>
                        </div>
                        <div className="radio">
                            <label><input type="radio" name="type" value="operation" onChange={onTypeChange} checked={element.type == 'operation'} />操作</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Color</label>
                        <input type="color" className="form-control" style={{ width: 50 }} value={element.color} onChange={this._onColorChange.bind(this)} />
                    </div>
                    <div className="form-group">
                        <label>Button</label>
                        <div className="checkbox">
                            <label><input type="checkbox" value="redo" onChange={onButtonChange} checked={element.button.redo} />重做</label>
                        </div>
                        <div className="checkbox">
                            <label><input type="checkbox" value="continue" onChange={onButtonChange} checked={element.button.continue} />继续</label>
                        </div>
                        <div className="checkbox">
                            <label><input type="checkbox" value="interrupt" onChange={onButtonChange} checked={element.button.interrupt} />中断</label>
                        </div>
                    </div>
                    <button type="button" className="btn btn-default" onClick={this._onAdd.bind(this)}>添加任务</button>
                    <button type="button" className="btn btn-info" onClick={this._onSetLink.bind(this)}>连接</button>
                    <button type="button" className="btn btn-info" onClick={this._onSave.bind(this)}>保存</button>
                </form>
                <div className="layout">
                    <Layout ref="layout" x={graph.x} y={graph.y} width={LAYOUT_WIDTH} height={LAYOUT_HEIGHT} data={graph.nodes} {...events} />
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
        let graph = localStorage.getItem('graph');
        if (graph) {
            this.state.graph = JSON.parse(graph);
        }
        let data = localStorage.getItem('data');
        if (data) {
            data = JSON.parse(data);
            this.state.data = this._parse(data);
        }
    }
    componentDidMount() {
        let { tasks } = this.state.data;
        tasks.forEach(task => {
            this.refs.layout.setType(task.graphKey, task.type);
        });
    }
}
